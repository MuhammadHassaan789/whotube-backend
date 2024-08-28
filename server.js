const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fetchVideoDescription = require('./utils/fetchVideoDescription');  // Import the utility function
require('dotenv').config();

// Initialize the app
const app = express();
app.use(cors());
app.use(express.json());

const noteSchema = new mongoose.Schema({
    videoUrl: String,
    timestamp: String,
    note: String,
  });

  const Note = mongoose.model('Note', noteSchema);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Define the VideoLink schema
const videoLinkSchema = new mongoose.Schema({
  links: [String],
});

const VideoLink = mongoose.model('VideoLink', videoLinkSchema);

// Route to replace the current playlist with a new one
app.post('/api/videos', async (req, res) => {
  const { links } = req.body;

  try {
    await VideoLink.deleteMany({});
    const newVideoLinks = new VideoLink({ links });
    await newVideoLinks.save();

    res.status(201).send(newVideoLinks);
  } catch (err) {
    console.error("Error saving new playlist:", err);
    res.status(500).send("Server error");
  }
});

// Route to get video links
app.get('/api/videos', async (req, res) => {
  try {
    const videoLinks = await VideoLink.find();
    res.status(200).send(videoLinks);
  } catch (err) {
    console.error("Error fetching video links:", err);
    res.status(500).send("Server error");
  }
});

// New route to get video descriptions
app.post('/api/video-description', async (req, res) => {
    const { url } = req.body;
  
    try {
      const description = await fetchVideoDescription(url);
      res.status(200).json({ description });
    } catch (error) {
      console.error('Error fetching video description:', error);
      res.status(500).json({ description: 'Description not available' });
    }
  });

  app.post('/api/notes', async (req, res) => {
    console.log('Request Body:', req.body); // Debugging line
    const { videoUrl, timestamp, note } = req.body;
  
    try {
      const newNote = new Note({
        videoUrl,
        timestamp,
        note,
      });
      await newNote.save();
      res.status(201).json(newNote);
    } catch (error) {
      console.error('Error saving note:', error);
      res.status(500).json({ message: 'Error saving note' });
    }
  });

  app.get('/api/notes', async (req, res) => {
    try {
      const notes = await Note.find();
      res.status(200).json(notes);
    } catch (error) {
      console.error('Error fetching notes:', error);
      res.status(500).json({ message: 'Error fetching notes' });
    }
  });
  

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
