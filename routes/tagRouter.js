const express = require('express');
const { validateTag, fetchTags, addPhoto, saveTag } = require('../controllers/tagController');
const router = express.Router();

// Fetch all tags for a photo
router.get('/:photoId', fetchTags);

// Validate a tag
router.post('/validate', validateTag);

// Add a new photo (admin functionality)
router.post('/add-photo', addPhoto);

// Route to save a tag
router.post('/save', saveTag);


module.exports = router;
