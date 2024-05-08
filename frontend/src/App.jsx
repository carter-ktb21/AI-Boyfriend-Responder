import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [generatedText, setGeneratedText] = useState('');
  const [input, setInput] = useState('');
  const [audioUrl, setAudioUrl] = useState('');

  const generateContent = async () => {
    const prompt = "Write a summary about " + input + ", but act as if you were me talking to my girlfriend."
      + " I will now describe myself a little. I'm pretty silly with a good vocabulary. I'm pretty passionate when talking about things that I like, including theology, history, and logic."
      + " Also, if the subject matter in your response is NOT theology or a heavy subject matter, add cheesy romantic lines and cringey jokes."
      + " Be short and succint, keeping your response under 200 characters, but while also being thorough. Only write in paragraph format.";
    console.log(prompt);
    try {
      const response = await axios.post('https://ai-boyfriend-questions-api.azurewebsites.net/api/generateContent?code=HBMXVZdkDbwLH56gkAgVvBfEjhWIT8VmRuIKiD_lkxpBAzFuWZEBGw%3D%3D', {
        prompt: prompt
      }, {
        responseType: 'blob',
      });
      getAudioUrl();
    } catch (error) {
      console.error('Error generating content:', error);
    }
  };

  const getAudioUrl = async () => {
    try {
      // Make a request to the getAudioFunction Azure Function
      const response = await axios.get('https://ai-boyfriend-questions-api.azurewebsites.net/api/getAudioFile?code=b4yvN1ihW2mu0TmWkVDD759onuXxIhyr5wVCyrjdN9LiAzFufOjxKA==');
      // Extract the SAS URL from the response
      const sasUrl = response.data.sasUrl;
      // Set the SAS URL in state
      setAudioUrl(sasUrl);
    } catch (error) {
      console.error('Error getting audio URL:', error);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "100px" }}>
      <h1>What did your boyfriend talk about this time?</h1>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter prompt"
        style={{ margin: "20px" }}
      />
      <button onClick={generateContent}>Generate</button>
      <p>{generatedText}</p>
      {audioUrl && (
        <audio controls>
          <source src={audioUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
}

export default App;