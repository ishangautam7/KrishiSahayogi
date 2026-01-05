import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }
    console.log(token);

    if (!token) {
        return res.status(401).json({ success: false, message: "Not authorized to access this route" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret_for_development_replace_immediately");
        req.user = await User.findById(decoded._id);
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Not authorized to access this route" });
    }
};
export const optionalProtect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret_for_development_replace_immediately");
        req.user = await User.findById(decoded._id);
        next();
    } catch (error) {
        // If token is invalid, just proceed without user
        next();
    }
};
