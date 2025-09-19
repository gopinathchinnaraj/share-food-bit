import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: String,
  caption: String,
  image: String,
  location: {
    latitude: Number,
    longitude: Number,
    address: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date,
  author: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // 🔽 New Fields
  assignedNgoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NGO',
    default: null
  },
  isAcceptedByNgo: {
    type: Boolean,
    default: false
  },
  assignedDeliveryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  deliveryStatus: {
    type: String,
    enum: ['pending', 'in_transit', 'delivered'],
    default: 'pending'
  }
});

export default mongoose.model('Post', postSchema);
