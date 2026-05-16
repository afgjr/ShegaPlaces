import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'

// Configure Cloudinary using process.env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
}

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const ext = MIME_TYPE_MAP[file.mimetype]
    return {
      folder: 'share_ur_place',
      format: ext,
      public_id: file.originalname.split('.')[0].replace(/[^a-zA-Z0-9]/g, '') + '-' + Date.now()
    };
  }
});

const fileUpload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  storage: storage,
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype]
    const error = isValid ? null : new Error('Invalid mime type!')
    cb(error, isValid)
  }
})

export default fileUpload
