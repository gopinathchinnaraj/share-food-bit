import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import { Readable } from 'stream';

const router = express.Router();

// Use in-memory storage for Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// GridFS bucket initialization
let gfsBucket;

mongoose.connection.once('open', () => {
  gfsBucket = new GridFSBucket(mongoose.connection.db, {
    bucketName: 'uploads',
  });
});

// ===== Upload Route ===== //
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  if (!gfsBucket) {
    return res.status(503).json({ message: 'GridFS is not initialized.' });
  }

  const readableStream = new Readable();
  readableStream.push(req.file.buffer);
  readableStream.push(null);

  const uploadStream = gfsBucket.openUploadStream(req.file.originalname, {
    contentType: req.file.mimetype,
  });

  readableStream.pipe(uploadStream)
    .on('error', (error) => {
      console.error('Upload error:', error);
      res.status(500).json({ message: 'Error uploading file.' });
    })
    .on('finish', () => {
      const fileUrl = `http://localhost:3008/files/${uploadStream.filename}`;
      res.status(200).json({
        message: 'File uploaded successfully!',
        filename: uploadStream.filename,
        url: fileUrl,
      });
    });
});

// ===== Get Image by Filename ===== //
router.get('/:filename', async (req, res) => {
  if (!gfsBucket) {
    return res.status(503).json({ message: 'GridFS is not initialized.' });
  }

  try {
    const fileCursor = await gfsBucket.find({ filename: req.params.filename }).toArray();

    if (!fileCursor || fileCursor.length === 0) {
      return res.status(404).json({ message: 'File not found.' });
    }

    const file = fileCursor[0];
    res.set('Content-Type', file.contentType);

    const downloadStream = gfsBucket.openDownloadStreamByName(req.params.filename);
    downloadStream.pipe(res);

  } catch (err) {
    console.error('Error retrieving file:', err);
    res.status(500).json({ message: 'Error retrieving image.' });
  }
});


export default router;
