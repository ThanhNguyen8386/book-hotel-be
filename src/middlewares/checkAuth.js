import { expressjwt } from "express-jwt";
import User from "../models/users";
const jwt = require('jsonwebtoken')

export const requireSignin = expressjwt({
  algorithms: ["HS256"],
  secret: "Happyweekend",
  requestProperty: "auth",
});

export const isAuth = async (req, res, next) => {
  try {
    const { email } = req.auth;
    const user = await User.findOne({ email }).exec();

    if (!user) {
      res.status(404).json({
        message: "Bạn không có quyền truy cập",
      });
      return;
    }

    req.profile = user;
    next();
  } catch (error) {
    res.status(404).json({
      status: false,
      message: error,
    });
  }
};

export const isAdmin = async (req, res, next) => {
  const role = req.profile.role;

  if (role !== 1) {
    res.status(403).json({
      message: "Bạn không có quyền truy cập",
    });

    return;
  }

  next();
};

export const verifyToken = (req, res, next) => {

  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null

  if (!token) return res.status(401).json({ message: "Token không tồn tại" })
  else {
    jwt.verify(token, "Happyweekend", (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ message: "Token hết hạn" })
        }
        return res.status(403).json({ message: "Token không hợp lệ" })
      }
      
      req.user = decoded
    })
    next()
  }
}

export const roleMiddleware = (roles) => {
  return (req, res, next) => {
    
    if (roles.includes(Number(req.user.role))) {
      next();
    }
    else return res.status(403).json({ message: 'Access denied' });
  };
};

export const generateAccessToken = (user) => {
  return jwt.sign(user, "Happyweekend", { expiresIn: '15m' }) 
}

export const generateRefreshToken = (user) => {
  return jwt.sign(user, "Happyweekend", { expiresIn: '7d' }) 
}