const express = require('express');
const app = express();
const PORT = 80;

app.set('json spaces', 0);

app.get('/', (req, res) => {
  let ts = Date.now()
  const response = {
    message: 'My name is Austin',
    timestamp: ts
  };
  res.json(response);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});