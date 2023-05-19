/* eslint-disable no-console */
const path = require('path');
const fs = require('fs');
const express = require('express');
const multer = require('multer');
import { Replicate } from "langchain/llms/replicate";
const http = require('http');
const https = require('https');

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    const fileNameArr = file.originalname.split('.');
    cb(null, `${Date.now()}.${fileNameArr[fileNameArr.length - 1]}`);
  },
});
const upload = multer({ storage });
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public/assets'));
app.use(express.static('uploads'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/record', upload.single('audio'), async (req, res) => {
  let files = fs.readdirSync(path.join(__dirname, 'uploads'));
  const lastFile = files[files.length - 1];

  const transcription = await transcribeAudio(lastFile);
  console.log('Transcription:', transcription);

  const txtPath = path.join(__dirname, 'uploads', req.file.filename.replace("mp3", "txt"))
  fs.writeFileSync(txtPath, transcription);

  const image = await replciate(transcription)  
  const imagePath = path.join(__dirname, 'uploads', req.file.filename.replace("mp3", "png"))

  downloadImageToUrl(image, imagePath)  

  return res.json({ success: true })
}) 

app.get('/recordings', async (req, res) => {
  let filesTexts = fs.readdirSync(path.join(__dirname, 'uploads'));

  const files = filesTexts.filter((file) => {
    // check that the files are audio files
    const fileNameArr = file.split('.');
    return fileNameArr[fileNameArr.length - 1] === 'mp3';
  }).map((file) => `/${file}`);


  const prompts = filesTexts.filter((file) => {
    // check that the files are text files
    const fileNameArr = file.split('.');
    return fileNameArr[fileNameArr.length - 1] === 'txt';
  }).map((txt) => fs.readFileSync(path.join(__dirname, 'uploads', txt), 'utf8'));

  return res.json({ success: true, files, prompts });
});

const replciate = async (transcription) => {
  const replicateModel = new Replicate({
    model:
    "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
    input:{image_dimensions: '512x512'}
    });
    const replicateResponse = await replicateModel.call(
      transcription
    );

    const image = replicateResponse
    console.log({ image });

    return image
}

const downloadImageToUrl = (url, filename) => {
  let client = http;
  if (url.toString().indexOf("https") === 0) {
     client = https;
  }
  return new Promise((resolve, reject) => {
     client.get(url, (res) => {
         res.pipe(fs.createWriteStream(filename))
         .on('error', reject)
         .once('close', () => resolve(filename))
     })
 })
};

async function transcribeAudio(filename) {
  const transcript = await openai.createTranscription(
    fs.createReadStream(path.join(__dirname, 'uploads', filename)),
    "whisper-1"
  );
  return transcript.data.text;
}

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
