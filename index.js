const express = require('express');
const app = express();
const PORT = 80;

app.get('/', (req, res) => {
  res.json({message: "My name is Austin", timestamp: Date.now()});
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});