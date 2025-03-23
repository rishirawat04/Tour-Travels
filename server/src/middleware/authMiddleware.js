import User from "../models/userModel.js"
import jwt from "jsonwebtoken";

export const verifyToken = async(req, res, next) => {
    const token = req.cookies?.token


    if(!token) {
        return res.status(401).json({message: "Access denied. Please login"})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id)
        if(!user) {
            return res.status(401).json({ message: "User not found."})
        }
        req.user = decoded;
        next()
    } catch (error) {
        res.status(500).json({ message: "Invalid or expired token."})
    }
}

// Middleware for role-based access control
export const verifyRole =(role) => (req, res, next) => {
    if(req.user.role !== role) {
        return res.status(403).json({ message: "Access denied. You do not have permission."})
    }
    next();
}