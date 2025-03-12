const express = require('express');
const app = express();
const PORT = 80;

app.get('/', (req, res) => {
    const response = {
      message: "My name is not Austin",
      timestamp: Date.now(),
      testing: "Testing testing testing"
    };
    res.json(response);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
