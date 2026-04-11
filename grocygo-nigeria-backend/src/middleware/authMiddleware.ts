import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export const verifyToken = (req: any, res: Response, next: NextFunction) => {
  // 1. Get token from the header (Bearer <token>)
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // 2. Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // 3. Attach the user data to the request object
    req.user = decoded;
    
    // 4. Move to the next function (the controller)
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token.' });
  }
};