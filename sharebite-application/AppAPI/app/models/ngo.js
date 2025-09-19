// models/ngo.js
import mongoose from 'mongoose';

const ngoSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  verified: {
    type: Boolean,
    default: false
  }
});

const NGO = mongoose.model('NGO', ngoSchema);
export default NGO;
