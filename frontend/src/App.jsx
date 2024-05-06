import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [generatedText, setGeneratedText] = useState('');
  const [input, setInput] = useState('');

  const generateContent = async () => {
    const prompt = "Write a summary about " + input + ", but act as if you were me talking to my girlfriend."
    + "I will now describe myself a little. I'm pretty silly with a good vocabulary. I enjoy theology and music and am pretty passionate when talking about things that I like."
    + "Be short and succint while also thorough. Only write in paragraph format.";
    console.log(prompt);
    try {
      const response = await axios.get('https://ai-boyfriend-questions-api.azurewebsites.net/api/generateContent?code=HBMXVZdkDbwLH56gkAgVvBfEjhWIT8VmRuIKiD_lkxpBAzFuWZEBGw%3D%3D', {
        params: { prompt },
      });
      setGeneratedText(response.data.text);
    } catch (error) {
      console.error('Error generating content:', error);
    }
  };

  return (
    <div style={{display:"flex", flexDirection:"column", alignItems:"center", padding:"100px"}}>
      <h1>What did your boyfriend talk about this time?</h1>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter prompt"
        style={{margin:"20px"}}
      />
      <button onClick={generateContent}>Generate</button>
      <p>{generatedText}</p>
    </div>
  );
}

export default App;