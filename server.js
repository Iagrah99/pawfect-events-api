const express = require('express');

const port = process.env.PORT || 5001;

const app = express();

app.get('/api/events', (req, res) => {
  res.status(200).json({ message: 'Here are the avaliable events' });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
