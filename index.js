const express = require('express');
const app = express();
const PORT = 80;

app.get('/', (req, res) => {
  const response = {
    message: "My name is Austin Norquist",
    timestamp: Date.now(),
    Liatrio: "demo!",
    test: "testing"
  };
  res.json(response);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});