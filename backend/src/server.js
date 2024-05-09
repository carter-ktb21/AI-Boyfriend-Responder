require('dotenv').config();
const express = require('express');
const path = require("path")
const cors = require('cors'); // Import cors
const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } = require('@google/generative-ai');
const ElevenLabs = require("elevenlabs-js");

ElevenLabs.setApiKey(process.env.ELEVENLABS_API_KEY)

const app = express();
const apiKey = process.env.API_KEY; // Retrieve API key from environment variable

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-pro', safetySettings: [{
  category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
  threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH // Neccessary to allow the AI to act as if it were a boyfriend
}]});

// Enable All CORS Requests
app.use(cors());
app.use(express.json());

app.post('/generateContent', async (req, res) => {
    const prompt = req.body.prompt; // Retrieve prompt from query parameters
    console.log('Received request to generate content with prompt:', prompt); // Log the prompt
  
    try {
      const result = await model.generateContent(
        prompt
      );
      if (!result.response) {
        throw new Error('Response is undefined');
      }
      
      const response = result.response;
      const text = response.text();
      console.log('Generated text:', text); // Log the generated text
      
      const audioFile = "test.mp3";

      const absolutePath = path.join(__dirname, "..", audioFile);

      ElevenLabs.textToSpeech("3gsg3cxXyFLcGIfNbM6C", text, "eleven_monolingual_v1", {
        stability: 0.95,
        similarity_boost: 0.75,
        style: 0.06,
        use_speaker_boost: true
      }).then(async (labs_res) => {
        await labs_res.saveFile(audioFile);

        res.sendFile(absolutePath);

      });
    } catch (error) {
      console.error('Error generating content:', error); // Log any errors
      res.status(500).json({ error: error.message });
    }
  });

const PORT = 5001;
app.listen(PORT, () => console.log(`Backend server running on http://localhost:${PORT}`));