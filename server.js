const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const dataFile = './db/db.json';
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// for Middleware to parse JSON data use express.json() / express.urlencoded()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static('public'));
// home page / landing page


// the notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

// GET /api/notes should read the db.json file and return all saved notes as JSON.

app.get('/api/notes', (req, res) => {
  // Read the content of db.json using promises
  fs.readFile(dataFile, 'utf8')
    .then(data => {
      // Parse the content as JSON
      const notes = JSON.parse(data);

      // Respond with the notes as JSON
      res.json(notes);
    })
    .catch(err => {
      // Handle errors, e.g., by sending an error response
      console.error(err);
      res.status(500).json({ error: 'Error reading or parsing db.json' });
    });
});



// POST /api/notes should receive a new note to save on the request body, add it to the db.json 
// Define the endpoint for POST /api/notes
app.post('/api/notes', async (req, res) => {
  try {
    // Read existing notes from db.json
    const existingNotes = await fs.readFile(dataFile, 'utf8');
    const notes = JSON.parse(existingNotes);

    // Get the new note from the request body
    const newNote = req.body;
    // Here we are taking the INCOMING DATA and ADDING some extra info
    const tempNote = {
      id: uuidv4(),  // here we ADD a UNIQUE IDENTIFER 
      title: req.body.title,
      text: req.body.text,
    }
    // Add the new note to the existing notes
    notes.push(tempNote);

    // Write the updated notes back to db.json
    await fs.writeFile(dataFile, JSON.stringify(notes, null, 2), 'utf8');

    // Respond with the updated notes as JSON
    res.json(notes);
  } catch (error) {
    // Handle errors, e.g., by sending an error response
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// DELETE functionality
let notes = [
  { id: uuidv4(), title: 'Note 1', content: 'Content 1' },
  { id: uuidv4(), title: 'Note 2', content: 'Content 2' },
];

app.get('/api/notes', (req, res) => {
  res.json(notes);
});

app.post('/api/notes', async (req, res) => {
  const newNote = { id: uuidv4(), ...req.body };
  notes.push(newNote);
  await fs.writeFile(dataFile, JSON.stringify(notes, null, 2), 'utf8');
  res.json(notes);
});

app.delete('/api/notes/:id', async (req, res) => {
  const noteId = req.params.id;

  try {
    const existingData = await fs.readFile(dataFile, 'utf8');
    notes = JSON.parse(existingData);

    const noteIndex = notes.findIndex(note => note.id === noteId);

    if (noteIndex !== -1) {
      notes.splice(noteIndex, 1);
      await fs.writeFile(dataFile, JSON.stringify(notes, null, 2), 'utf8');
      res.send('');
    } else {
      res.status(404).json({ error: 'Note not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
