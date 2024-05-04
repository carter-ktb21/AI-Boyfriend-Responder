import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [generatedText, setGeneratedText] = useState('');
  const [input, setInput] = useState('');

  const generateContent = async () => {
    const prompt = "Write a summary about " + input + ". Be short and succint while also thorough. Only write in paragraph format.";
    console.log(prompt);
    try {
      const response = await axios.get('http://localhost:5001/generateContent', {
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