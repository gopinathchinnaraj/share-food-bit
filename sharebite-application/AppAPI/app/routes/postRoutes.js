import express from 'express';
import Post from '../models/Post.js';
//import NGO from '../models/NGO.js';
import NGO from '../models/ngo.js';
const router = express.Router();

// Auto-assign nearest NGO (dummy logic for now)
const assignNearestNGO = async (post) => {
  const ngo = await NGO.findOne();
  if (ngo) {
    post.assignedNgoId = ngo._id;
    await post.save();
  }
};

// Route to create new post (with auto-assignment)
router.post('/', async (req, res) => {
  try {
    const newPost = new Post(req.body);
    await newPost.save();
    await assignNearestNGO(newPost);
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Get posts assigned to a specific NGO
router.get('/assigned-to-ngo/:ngoId', async (req, res) => {
  try {
    const posts = await Post.find({
      assignedNgoId: req.params.ngoId,
      isAcceptedByNgo: false
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// NGO accepts post
router.patch('/:postId/accept', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    post.isAcceptedByNgo = true;
    await post.save();
    res.json({ message: 'Post accepted by NGO' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// Get posts assigned to a delivery partner
router.get('/assigned-delivery/:deliveryId', async (req, res) => {
  try {
    const posts = await Post.find({
      assignedDeliveryId: req.params.deliveryId,
      isAcceptedByNgo: true
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update delivery status
router.patch('/:postId/status', async (req, res) => {
  const { status } = req.body;
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    post.deliveryStatus = status;
    await post.save();
    res.json({ message: 'Delivery status updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});


// app/routes/postRoutes.js
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Post.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Post not found' });

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});


export default router;
