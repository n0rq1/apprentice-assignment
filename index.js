const express = require('express');
const app = express();
const PORT = 80;

app.get('/', (req, res) => {
  const response = {
    message: "My name is Austin",
    timestamp: Date.now()
  };

  const minified = JSON.stringify(response);

  res.setHeader('Content-Type', 'application/json');
  res.send(minified); 
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
