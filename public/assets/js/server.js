const express = require('express');
const path = require('path');
// const bodyParsing = require('body-parser');

const app = express();
const PORT = PORT || 3001;

// for Middleware to parse JSON data use express.json() / express.urlencoded()
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use('/api',api);

app .use(express.static('public'));
// home page / landing page
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/assets/js/index.js'))
);

// the notes page
app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/assets/js/index.js'))
);



app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);

