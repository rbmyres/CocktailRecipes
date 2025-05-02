const express = require('express');
const multer = require('multer');
const verifyJWT = require('../middleware/verifyJWT');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const accountID = process.env.R2_ACCOUNT_ID;

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${accountID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

async function uploadToR2(file, folder = '') {
  const fileName = `${folder}/${Date.now()}-${file.originalname}`;
  
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  });
  
  await s3Client.send(command);
  
  return `https://${accountID}.r2.cloudflarestorage.com/mixer-uploads/${fileName}`;
}

router.post("/icon", verifyJWT, upload.single("user_icon"), async (req, res, next) => {
    if (!req.file) return res.status(400).json({ message: 'No icon provided' });
    
    try {
        const iconURL = await uploadToR2(req.file, 'user-icons');
        const user_id = req.user.id;
        const db = req.db;

        db.query(
            "UPDATE users SET user_icon = ? WHERE user_id = ?;",
            [iconURL, user_id],
            (err, result) => {
                if (err){
                    return res.status(500).send({ message: "Server error"});
                }
                return res.json({ iconURL });
            }
        );
    } catch (error) {
        console.error('Error uploading to R2:', error);
        return res.status(500).json({ message: 'Error uploading image to cloud storage' });
    }
});

router.post('/recipe_image', verifyJWT, upload.single('recipe_image'), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No recipe image provided' });
    
    try {
        const imageURL = await uploadToR2(req.file, 'recipe-images');
        
        res.json({ imageURL });
    } catch (error) {
        console.error('Error uploading to R2:', error);
        return res.status(500).json({ message: 'Error uploading image to cloud storage' });
    }
});

module.exports = router;