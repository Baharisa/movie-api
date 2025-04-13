// Import the Express library
const express = require('express');

// Create an instance of an Express app
const app = express();

app.use(express.json()); // Middleware to parse JSON body

// Choose a port (5000 is common for backend APIs)
const PORT = 5000;

// Define a test route: GET /api/hello
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from your first API! 👋' });
});

// Temporary in-memory movie list
const movies = [
  { id: 1, title: 'Inception', year: 2010 },
  { id: 2, title: 'The Matrix', year: 1999 },
  { id: 3, title: 'Interstellar', year: 2014 }
];

// GET /api/movies → returns the list of movies
app.get('/api/movies', (req, res) => {
  res.json(movies);
});

// POST /api/movies → adds a new movie to the list
app.post('/api/movies', (req, res) => {
  const { title, year } = req.body;

  if (!title || !year) {
    return res.status(400).json({ error: 'Title and year are required.' });
  }

  const newMovie = {
    id: movies.length + 1,
    title,
    year
  };

  movies.push(newMovie);
  res.status(201).json(newMovie); // Respond with the created movie
});



// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
