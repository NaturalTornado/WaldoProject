const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Fetch tags for a specific photo
 * @route GET /tags/:photoId
 */
const fetchTags = async (req, res) => {
    const { photoId } = req.params;

    try {
        const tags = await prisma.tags.findMany({
            where: { photo_id: Number(photoId) },
        });
        res.json(tags);
    } catch (error) {
        console.error('Error fetching tags:', error.message);
        res.status(500).json({ error: 'Failed to fetch tags' });
    }
};

/**
 * Validate a marker placement against stored tags
 * @route POST /tags/validate
 */
const validateTag = async (req, res) => {
    const { photoId, name, xPercent, yPercent } = req.body;
    const margin = 5; // Allowable margin of error in percentage

    try {
        // Find the tag that matches the criteria within the margin
        const tag = await prisma.tags.findFirst({
            where: {
                photo_id: Number(photoId),
                name,
                x_percent: { gte: xPercent - margin, lte: xPercent + margin },
                y_percent: { gte: yPercent - margin, lte: yPercent + margin },
            },
        });

        if (tag) {
            res.json({ success: true, message: 'Marker validated successfully' });
        } else {
            res.json({ success: false, message: 'Incorrect marker placement' });
        }
    } catch (error) {
        console.error('Error validating tag:', error.message);
        res.status(500).json({ error: 'Validation failed' });
    }
};

/**
 * Add a new photo to the database (Admin Functionality)
 * @route POST /tags/add-photo
 */
const addPhoto = async (req, res) => {
    const { title, filePath } = req.body;

    try {
        // Check if the photo already exists
        const existingPhoto = await prisma.photos.findUnique({
            where: { file_path: filePath },
        });
        if (existingPhoto) {
            return res.status(400).json({ error: 'Photo already exists.' });
        }

        // Add the photo to the database
        const newPhoto = await prisma.photos.create({
            data: {
                title,
                file_path: filePath,
            },
        });

        res.json({
            success: true,
            message: 'Photo added successfully',
            photo: newPhoto,
        });
    } catch (error) {
        console.error('Error adding photo:', error.message);
        res.status(500).json({ error: 'Failed to add the photo' });
    }
};


/**
 * Save a tag to the database (Admin Functionality)
 * @route POST /tags/save
 */
const saveTag = async (req, res) => {
    const { photoId, name, xPercent, yPercent } = req.body;

    const photo = await prisma.photos.findUnique({
        where: { id: Number(photoId) },

    });

    if (!photo) {

        return res.status(400).json({error: "Photo ID does not exist"});
    }

    if(!photoID || !name || xPercent === undefined || yPercent === undefined) {return res.status(400).json({error: 
        "Missing required fields: PhotoID, name, xPercent, yPercent",
        });

    }

    try {
        const newTag = await prisma.tags.create({
            data: {
                photo_id: Number(photoId),
                name: String(name),
                x_percent: parseFloat(xPercent),
                y_percent: parseFloat(yPercent),
            },
        });

        res.json({
            success: true,
            message: 'Tag saved successfully',
            tag: newTag,
        });
    } catch (error) {
        console.error('Error saving tag:', error.message);
        res.status(500).json({ error: 'Failed to save the tag!!!!!!' });
    }
};

module.exports = {
    fetchTags,
    validateTag,
    addPhoto,
    saveTag,
};
