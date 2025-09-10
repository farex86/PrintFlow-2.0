const express = require('express');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { neon } = require('@neondatabase/serverless');
const path = require('path');
const router = express.Router();

const sql = neon(process.env.DATABASE_URL);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow common file types for printing
    const allowedTypes = /jpeg|jpg|png|gif|pdf|ai|psd|eps|svg|indd|docx|doc|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('File type not allowed'));
    }
  }
});

// @route   POST /api/files/upload
// @desc    Upload file to Cloudinary
// @access  Private
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { project_id, description, category = 'general' } = req.body;

    // Upload to Cloudinary
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'printflow',
          public_id: `${Date.now()}-${req.file.originalname}`,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(req.file.buffer);
    });

    const cloudinaryResult = await uploadPromise;

    // Save file info to database
    const newFile = await sql`
      INSERT INTO files (
        project_id, original_name, cloudinary_public_id, cloudinary_url,
        file_type, file_size, description, category
      )
      VALUES (
        ${project_id}, ${req.file.originalname}, ${cloudinaryResult.public_id}, 
        ${cloudinaryResult.secure_url}, ${req.file.mimetype}, ${req.file.size},
        ${description}, ${category}
      )
      RETURNING *
    `;

    res.status(201).json({
      success: true,
      data: newFile[0]
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ message: 'File upload failed' });
  }
});

// @route   POST /api/files/upload-multiple
// @desc    Upload multiple files
// @access  Private
router.post('/upload-multiple', upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const { project_id, description, category = 'general' } = req.body;
    const uploadedFiles = [];

    for (const file of req.files) {
      try {
        // Upload to Cloudinary
        const uploadPromise = new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              resource_type: 'auto',
              folder: 'printflow',
              public_id: `${Date.now()}-${file.originalname}`,
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
          uploadStream.end(file.buffer);
        });

        const cloudinaryResult = await uploadPromise;

        // Save file info to database
        const newFile = await sql`
          INSERT INTO files (
            project_id, original_name, cloudinary_public_id, cloudinary_url,
            file_type, file_size, description, category
          )
          VALUES (
            ${project_id}, ${file.originalname}, ${cloudinaryResult.public_id}, 
            ${cloudinaryResult.secure_url}, ${file.mimetype}, ${file.size},
            ${description}, ${category}
          )
          RETURNING *
        `;

        uploadedFiles.push(newFile[0]);
      } catch (fileError) {
        console.error(`Error uploading ${file.originalname}:`, fileError);
      }
    }

    res.status(201).json({
      success: true,
      data: uploadedFiles
    });
  } catch (error) {
    console.error('Multiple file upload error:', error);
    res.status(500).json({ message: 'File upload failed' });
  }
});

// @route   GET /api/files
// @desc    Get all files
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { project_id, category } = req.query;

    let query = `
      SELECT f.*, p.name as project_name
      FROM files f
      LEFT JOIN projects p ON f.project_id = p.id
    `;

    const conditions = [];
    const params = [];

    if (project_id) {
      conditions.push(`f.project_id = $${params.length + 1}`);
      params.push(project_id);
    }

    if (category) {
      conditions.push(`f.category = $${params.length + 1}`);
      params.push(category);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` ORDER BY f.created_at DESC`;

    const files = await sql.unsafe(query, params);

    res.json({
      success: true,
      data: files
    });
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/files/:id
// @desc    Get single file
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const files = await sql`
      SELECT f.*, p.name as project_name
      FROM files f
      LEFT JOIN projects p ON f.project_id = p.id
      WHERE f.id = ${id}
      LIMIT 1
    `;

    if (files.length === 0) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.json({
      success: true,
      data: files[0]
    });
  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/files/:id
// @desc    Update file info
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { description, category, is_approved } = req.body;

    const updatedFile = await sql`
      UPDATE files SET
        description = COALESCE(${description}, description),
        category = COALESCE(${category}, category),
        is_approved = COALESCE(${is_approved}, is_approved),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    if (updatedFile.length === 0) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.json({
      success: true,
      data: updatedFile[0]
    });
  } catch (error) {
    console.error('Update file error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/files/:id
// @desc    Delete file
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get file info first
    const files = await sql`
      SELECT * FROM files WHERE id = ${id} LIMIT 1
    `;

    if (files.length === 0) {
      return res.status(404).json({ message: 'File not found' });
    }

    const file = files[0];

    // Delete from Cloudinary
    if (file.cloudinary_public_id) {
      try {
        await cloudinary.uploader.destroy(file.cloudinary_public_id);
      } catch (cloudinaryError) {
        console.error('Cloudinary delete error:', cloudinaryError);
      }
    }

    // Delete from database
    await sql`DELETE FROM files WHERE id = ${id}`;

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/files/project/:projectId
// @desc    Get files by project
// @access  Private
router.get('/project/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;

    const files = await sql`
      SELECT * FROM files
      WHERE project_id = ${projectId}
      ORDER BY created_at DESC
    `;

    res.json({
      success: true,
      data: files
    });
  } catch (error) {
    console.error('Get project files error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
