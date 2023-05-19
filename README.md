# Speech To Text to Image Generation

I just built an app where you can record your voice and see the text extracted from your voice and the image generated.

I turn my audio into text using [Whisper](https://openai.com/research/whisper)  which is an OpenAI Speech Recognition Model that turns audio into text with up to 99% accuracy. Whisper is a speech transcription system form the creators of ChatGPT. Anyone can use it, and it is completely free. The system is trained on 680 000 hours of speech data from the network and recognizes 99 languages.

I generated images from texts using Replicate. [Replicate](https://replicate.com/blog/machine-learning-needs-better-tools) runs machine learning models on the cloud. They have a library of open-source
models that we can run with a few lines of code. 


To get started.
```
       Clone the repository

       git clone https://github.com/Ashot72/Speech-to-Text-to-Image
       cd Speech-to-Text-to-Image

       Add your keys to .env file
       
       # installs dependencies
       npm install

       # to run locally
        npm start
      
```

Go to [Speech To Text to Image Generation Video](https://youtu.be/ZI6Q60PrUCE) page

Go to [Speech To Text to Image Generation description](https://ashot72.github.io/Speech-to-Text-to-Image/doc.htm) page
