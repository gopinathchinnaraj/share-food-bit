import express from 'express';
import NGO from '../models/ngo.js';

const router = express.Router();

// Register NGO
router.post('/create', async (req, res) => {
  try {
    const ngo = new NGO(req.body);
    await ngo.save();
    res.status(201).json({ message: 'NGO created', ngo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all NGOs
router.get('/', async (req, res) => {
  try {
    const ngos = await NGO.find();
    res.json(ngos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
