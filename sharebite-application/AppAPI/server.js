import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import { GridFSBucket } from 'mongodb';
import initialize from './app/app.js';
import mailService from './mailService.js';
import uploadRoute from './app/routes/upload.js';
import ngoRoutes from './app/routes/ngoRoutes.js';
import postRoutes from './app/routes/postRoutes.js'; 
import uploadRouter from './app/routes/upload.js';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3008;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Enable CORS for your frontend
app.use(cors({
  origin: 'http://localhost:3002',
  methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.options('*', cors());

// Serve static files (optional if needed)
app.use('/uploads', express.static('uploads'));

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected...'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Initialize GridFSBucket
let gfsBucket;
mongoose.connection.once('open', () => {
  gfsBucket = new GridFSBucket(mongoose.connection.db, {
    bucketName: 'uploads',
  });
  console.log('✅ GridFSBucket initialized');
  app.locals.gfsBucket = gfsBucket; // ✅ pass it to routes
});

// ✅ Image upload route
app.use('/api/posts', postRoutes); // base path
app.use('/upload', uploadRoute);
app.use('/posts', postRoutes);
app.use('/api/ngos', ngoRoutes);
app.use('/files', uploadRouter);     // for GET /files/:filename
app.use('/upload', uploadRouter); 


// ✅ Your existing logic
initialize(app);
app.use(mailService);

// ✅ Start the server
app.listen(PORT, () => console.log(`🚀 Server is running on http://localhost:${PORT}`));
