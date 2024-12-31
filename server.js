const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // React app's address
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});

// Simplified Proverb Schema
const proverbSchema = new mongoose.Schema({
  // Core Information
  originalText: { type: String, required: true },
  englishTranslation: String,
  language: { type: String, required: true },
  country: { type: String, required: true },
  
  // Meaning and Usage
  literalMeaning: String,
  metaphoricalMeaning: String,
  usageScenarios: String,
  lifeLesson: String,
  
  // Applications and Impact
  therapeuticValue: String,
 relevantSituations: [String],
  moodCategory: String,
  successStories: String,
  
  // Metadata
  createdAt: { type: Date, default: Date.now }
});

const Proverb = mongoose.model('Proverb', proverbSchema);

// Routes
// Create proverb
app.post('/api/proverbs', async (req, res) => {
  try {
    const proverb = new Proverb(req.body);
    await proverb.save();
    res.status(201).json(proverb);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all proverbs
app.get('/api/proverbs', async (req, res) => {
  try {
    const proverbs = await Proverb.find();
    res.json(proverbs);
  } catch (error) {
    console.error('Error fetching proverbs:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update proverb
app.put('/api/proverbs/:id', async (req, res) => {
  try {
    const proverb = await Proverb.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!proverb) {
      return res.status(404).json({ message: 'Proverb not found' });
    }
    
    res.json(proverb);
  } catch (error) {
    console.error('Error updating proverb:', error);
    res.status(400).json({ message: error.message });
  }
});

// Delete proverb
app.delete('/api/proverbs/:id', async (req, res) => {
  try {
    const proverb = await Proverb.findByIdAndDelete(req.params.id);
    
    if (!proverb) {
      return res.status(404).json({ message: 'Proverb not found' });
    }
    
    res.json({ message: 'Proverb deleted successfully' });
  } catch (error) {
    console.error('Error deleting proverb:', error);
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});