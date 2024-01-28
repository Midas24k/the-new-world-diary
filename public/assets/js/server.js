const express = require('express');
const path = require('path');
const dbData = require(db/db.json)
// const bodyParsing = require('body-parser');

const app = express();
const PORT = PORT || 3001;

// for Middleware to parse JSON data use express.json() / express.urlencoded()
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use('/api',api);

app.use(express.static('public'));
// home page / landing page

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/assets/js/index.js'))
);

// the notes page
app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/assets/js/index.js'))
);

// GET /api/notes should read the db.json file and return all saved notes as JSON.

app.get('/api/notes', (req, res) => {
    // Read the content of db.json
    fs.readFile('db.json', 'utf8', (err, data) => {
      if (err) {
        // Handle the error, by sending an error response
        return res.status(500).json({ error: 'Error reading db.json' });
      }
  
      try {
        // Parse the content as JSON
        const notes = JSON.parse(data);
  
        // Respond with the notes as JSON
        res.json(notes);
      } catch (parseError) {
        // Handle parsing error, e.g., if db.json is not valid JSON
        res.status(500).json({ error: 'Error parsing db.json' });
      }
    });
  });


// POST /api/notes should receive a new note to save on the request body, add it to the db.json 


// Define the endpoint for POST /api/notes
app.post('/api/notes', async (req, res) => {
  try {
    // Read existing notes from db.json
    const existingNotes = await fs.readFile('db.json', 'utf8');
    const notes = JSON.parse(existingNotes);

    // Get the new note from the request body
    const newNote = req.body;

    // Add the new note to the existing notes
    notes.push(newNote);

    // Write the updated notes back to db.json
    await fs.writeFile('db.json', JSON.stringify(notes, null, 2), 'utf8');

    // Respond with the updated notes as JSON
    res.json(notes);
  } catch (error) {
    // Handle errors, e.g., by sending an error response
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);

