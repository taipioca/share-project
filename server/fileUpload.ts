const express = require('express');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');

const router = express.Router(); // Create a new Express router

// Create a connection to MongoDB
const conn = mongoose.createConnection('mongodb://localhost/test');

// Initialize GridFS
let gfs;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Create a storage engine
const storage = new GridFsStorage({
  url: 'mongodb://localhost/test',
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = file.originalname;
      const fileInfo = {
        filename: filename,
        bucketName: 'uploads'
      };
      resolve(fileInfo);
    });
  }
});
const upload = multer({ storage });

// Add an endpoint to upload files
router.post('/upload', upload.single('file'), (req, res) => {
  res.json({ file: req.file });
});

// Add an endpoint to retrieve files
router.get('/image/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({ err: 'No file exists' });
    }

    // Check if file is an image
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      // Read the file and pipe it to the response
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({ err: 'Not an image' });
    }
  });
});


export default router;


