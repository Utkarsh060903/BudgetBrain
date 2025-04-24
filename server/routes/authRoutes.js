import express from 'express';
import { registerUser, loginUser, getUserInfo, googleLogin } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
const router = express.Router();

// Route for user registration
router.post('/register', registerUser);

// Route for user login
router.post('/login', loginUser);

// Route for Google sign-in
router.post('/google-login', googleLogin);

// Route to get user information
router.get('/getUser', protect, getUserInfo);

router.post('/upload-image', upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.status(200).json({ imageUrl });
})

export default router;