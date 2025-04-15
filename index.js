// Import the Express library
const express = require('express');
const connectDB = require('./config/db'); // <- this line
const Favorite = require('./models/Favorite');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');
const cors = require('cors');



// Create an instance of an Express app
const app = express();

// Connect to MongoDB
connectDB();

app.use(express.json()); // Middleware to parse JSON body

app.use(cors());


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

// POST /api/favorites → save a favorite movie to MongoDB
app.post('/api/favorites', auth, async (req, res) => {
  try {
    const { title, year, imdbID, poster } = req.body;

    if (!title || !imdbID) {
      return res.status(400).json({ error: 'Title and imdbID are required.' });
    }

    const newFavorite = new Favorite({
      title,
      year,
      imdbID,
      poster,
      user: req.user  // <- associate with logged-in user
    });

    await newFavorite.save();
    res.status(201).json({ message: 'Favorite saved!', favorite: newFavorite });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'This movie is already in favorites.' });
    }
    console.error('❌ Error saving favorite:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// GET /api/favorites → fetch all saved favorites from MongoDB
app.get('/api/favorites', auth, async (req, res) => {
  try {
    const userFavorites = await Favorite.find({ user: req.user }).sort({ createdAt: -1 });

    res.json({
      message: 'Your favorites!',
      favorites: userFavorites
    });
  } catch (err) {
    console.error('❌ Error fetching favorites:', err);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});


// POST /api/users/register → create new user
app.post('/api/users/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email is already registered.' });
    }

    // Create new user
    const newUser = new User({ username, email, password });
    await newUser.save();

    // Create JWT token
    const token = jwt.sign({ id: newUser._id }, 'JoeyActuallyisCarissa', {
      expiresIn: '7d'
    });

    res.status(201).json({
      message: 'User registered!',
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (err) {
    console.error('❌ Error registering user:', err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

// POST /api/users/login → authenticate user
app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Sign token
    const token = jwt.sign({ id: user._id }, 'supersecretkey123', {
      expiresIn: '7d'
    });

    res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error('❌ Error logging in:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});




// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
