const express = require("express");
const multer = require("multer");
const streamifier = require("streamifier");
const cloudinary = require("cloudinary").v2;
const { protect, admin } = require("../middleware/authMiddleware");
const dotenv = require("dotenv");
dotenv.config();
//clodinary configuration


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


module.exports = cloudinary;

const router = express.Router();

// Store file in memory
const storage = multer.memoryStorage();

const upload = multer({
  storage
  
});

// Upload image
router.post(
  "/",
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "No image uploaded",
        });
      }

      const streamUpload= (fileBuffer) =>{
        return new Promise((resolve,reject)=>
        {
            const stream=cloudinary.uploader.upload_stream((error,result)=>{
                if(result){
                    resolve(result);
                }
                else{
                    reject(error);
                }
            })
            streamifier.createReadStream(fileBuffer).pipe(stream);
        })
      }
      const result = await streamUpload(req.file.buffer);

      res.json({
        imageUrl: result.secure_url,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: error.message,
      });
    }
  }
);

module.exports = router;