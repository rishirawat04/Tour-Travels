import User from "../models/userModel.js"
import jwt from "jsonwebtoken";

export const verifyToken = async(req, res, next) => {
    const token = req.cookies?.token


    if(!token) {
        return res.status(401).json({
            success: false,
            message: "Authentication required. Please login to continue.",
            requiresAuth: true
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id)
        if(!user) {
            return res.status(401).json({ 
                success: false,
                message: "User account not found. Please login again.",
                requiresAuth: true
            });
        }
        req.user = decoded;
        next()
    } catch (error) {
        res.status(401).json({ 
            success: false,
            message: "Session expired. Please login again.", 
            requiresAuth: true
        });
    }
}

// Middleware for role-based access control
export const verifyRole =(role) => (req, res, next) => {
    if(req.user.role !== role) {
        return res.status(403).json({ message: "Access denied. You do not have permission."})
    }
    next();
}