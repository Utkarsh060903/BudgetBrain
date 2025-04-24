import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const protect = async (req, res, next) => {  
    console.log("Auth header:", req.headers.authorization);
    let token = req.headers.authorization? req.headers.authorization.split(" ")[1] : null;
    console.log("Token extracted:", token ? "Token present" : "No token");
    
    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token decoded:", decoded);
        req.user = await User.findById(decoded.id).select("-password");
        console.log("User found:", req.user ? "Yes" : "No");
        next();
    } catch (error) {
        console.error("Token verification error:", error);
        res.status(401).json({ message: "Not authorized, token failed" });
    }   
}