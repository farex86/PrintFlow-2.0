const express = require('express');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const router = express.Router();
const File = require('../models/File'); // Mongoose model
const Project = require('../models/Project');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|ai|psd|eps|svg|indd|docx|doc|txt/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) cb(null, true);
    else cb(new Error('File type not allowed'));
  },
});

// Upload single file
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const { project_id, description, category = 'general' } = req.body;

    const cloudinaryResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto', folder: 'printflow', public_id: `${Date.now()}-${req.file.originalname}` },
        (err, result) => (err ? reject(err) : resolve(result))
      );
      uploadStream.end(req.file.buffer);
    });

    const newFile = await File.create({
      project_id,
      original_name: req.file.originalname,
      cloudinary_public_id: cloudinaryResult.public_id,
      cloudinary_url: cloudinaryResult.secure_url,
      file_type: req.file.mimetype,
      file_size: req.file.size,
      description,
      category,
    });

    res.status(201).json({ success: true, data: newFile });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ message: 'File upload failed' });
  }
});

// Get all files
router.get('/', async (req, res) => {
  try {
    const query = {};
    if (req.query.project_id) query.project_id = req.query.project_id;
    if (req.query.category) query.category = req.query.category;

    const files = await File.find(query)
      .populate('project_id', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: files });
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single file
router.get('/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id).populate('project_id', 'name');
    if (!file) return res.status(404).json({ message: 'File not found' });
    res.json({ success: true, data: file });
  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete file
router.delete('/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });

    if (file.cloudinary_public_id) {
      try {
        await cloudinary.uploader.destroy(file.cloudinary_public_id);
      } catch (err) {
        console.error('Cloudinary delete error:', err);
      }
    }

    await File.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
