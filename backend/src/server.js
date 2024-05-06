require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Import cors
const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } = require('@google/generative-ai');

const app = express();
const apiKey = process.env.API_KEY; // Retrieve API key from environment variable

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-pro', safetySettings: [{
  category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
  threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH
}]});

// Enable All CORS Requests
app.use(cors());

app.get('/generateContent', async (req, res) => {
    const prompt = req.query.prompt; // Retrieve prompt from query parameters
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
      res.json({ text });
    } catch (error) {
      console.error('Error generating content:', error); // Log any errors
      res.status(500).json({ error: error.message });
    }
  });

const PORT = 5001;
app.listen(PORT, () => console.log(`Backend server running on http://localhost:${PORT}`));