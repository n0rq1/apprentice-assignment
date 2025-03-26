const express = require('express');
const app = express();
const PORT = 80;

const ts = Date.now();

app.get('/', (req, res) => {
  const response = {
    message: "My name is Austin Norquist",
    timestamp: ts
  };
  res.json(response);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});