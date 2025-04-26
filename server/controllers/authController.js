import jwt from "jsonwebtoken";
import User from "../models/user.js";
import dotenv from "dotenv";
import admin from "firebase-admin"; // You'll need to install this package

dotenv.config();

// Initialize Firebase Admin SDK (if not already initialized in your app)
// You'll need to get your Firebase service account credentials file
// And save it securely on your server
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL
    })
  });
}

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

export const registerUser = async (req, res) => {
  const { fullName, email, password, profileImageUrl } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = new User({
      fullName,
      email,
      password,
      profileImageUrl,
    });

    await user.save();

    res.status(201).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const googleLogin = async (req, res) => {
  const { idToken, fullName, profileImageUrl } = req.body;
  
  if (!idToken) {
    return res.status(400).json({ message: "No ID token provided" });
  }
  
  try {
    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email } = decodedToken;
    
    // Check if user exists
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create a new user if they don't exist
      user = new User({
        email,
        fullName: fullName || email.split('@')[0],
        profileImageUrl: profileImageUrl || '',
        password: Math.random().toString(36).slice(-8), // Generate a random password
        authProvider: 'google'
      });
      
      await user.save();
    } else if (user.authProvider === 'google') {
      // Update existing Google user's info if needed
      if (fullName && (!user.fullName || user.fullName === email.split('@')[0])) {
        user.fullName = fullName;
      }
      
      if (profileImageUrl && !user.profileImageUrl) {
        user.profileImageUrl = profileImageUrl;
      }
      
      await user.save();
    }
    
    // Generate JWT token
    const token = generateToken(user._id);
    
    res.status(200).json({
      id: user._id,
      user,
      token
    });
    
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(401).json({ message: "Invalid Google token" });
  }
};

export const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};