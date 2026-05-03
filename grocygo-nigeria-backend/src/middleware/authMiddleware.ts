import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

/**
 * 1. verifyToken
 * Purpose: Checks if the user is logged in by validating their JWT.
 */
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
    
    // 4. Move to the next function (either verifyAdmin or the controller)
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

/**
 * 2. verifyAdmin
 * Purpose: Restricts access to users with the 'admin' role.
 * Note: Must be used AFTER verifyToken in the route chain.
 */
export const verifyAdmin = (req: any, res: Response, next: NextFunction) => {
  // verifyToken has already attached the user to the request object
  if (req.user && req.user.role === 'admin') {
    next(); // Access granted
  } else {
    // 403 Forbidden: We know who you are, but you aren't allowed here.
    return res.status(403).json({ 
      message: 'Access denied. Admin privileges required.' 
    });
  }
};