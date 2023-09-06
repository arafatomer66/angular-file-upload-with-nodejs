const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs').promises;
const app = express();
const port = 3300;

// Enable CORS for development (you may want to restrict this in production)
app.use(cors());

// Serve uploaded files statically from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Adjust this path if necessary
  },
  filename: function (req, file, cb) {
    // Sanitize the filename by replacing spaces with underscores
    const originalFilename = file.originalname;
    const sanitizedFilename = originalFilename.replace(/ /g, '_');
    cb(null, sanitizedFilename);
  },
});

const upload = multer({ storage: storage });

// File upload endpoint
app.post('/upload', upload.array('files'), (req, res) => {
  res.json({ message: 'Files uploaded successfully' });
});

// List uploaded files endpoint
app.get('/list', async (req, res) => {
  try {
    const files = await fs.readdir('uploads/');
    res.json({ files });
  } catch (error) {
    console.error('Error listing files', error);
    res.status(500).json({ error: 'Error listing files' });
  }
});

// Delete a file by filename endpoint
app.delete('/delete/:filename', async (req, res) => {
  const filename = req.params.filename;
  const filePath = `uploads/${filename}`;

  try {
    // Check if the file exists
    await fs.access(filePath);

    // Delete the file
    await fs.unlink(filePath);
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file', error);
    res.status(500).json({ error: 'Error deleting file' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
