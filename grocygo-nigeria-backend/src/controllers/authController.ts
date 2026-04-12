import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { query } from '../config/db';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, role',
      [name, email, hashedPassword]
    );

    const user = newUser.rows[0];
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ message: 'User registered successfully', token, user });
  } catch (error) {
    console.error("Reg error:", error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    res.json({ 
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        phone: user.phone // Added phone to login response
      } 
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const googleAuth = async (req: Request, res: Response) => {
  const { tokenId } = req.body;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) return res.status(400).json({ message: 'Google auth failed' });

    const { email, name } = payload;

    let result = await query('SELECT * FROM users WHERE email = $1', [email]);
    let user = result.rows[0];

    if (!user) {
      const newUser = await query(
        'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, role',
        [name, email, 'google-auth-user']
      );
      user = newUser.rows[0];
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    res.json({ 
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        phone: user.phone 
      } 
    });
  } catch (error) {
    console.error("Google Auth error:", error);
    res.status(500).json({ message: 'Google authentication failed' });
  }
};

/**
 * GET /api/auth/me
 */
export const getProfile = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    const result = await query(
      'SELECT id, name, email, role, phone, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("GetProfile error:", error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

/**
 * PUT /api/auth/update-profile
 * Updates user name and phone number
 */
export const updateProfile = async (req: any, res: Response) => {
  const { name, phone } = req.body;
  const userId = req.user.id;

  try {
    const result = await query(
      'UPDATE users SET name = $1, phone = $2 WHERE id = $3 RETURNING id, name, email, role, phone',
      [name, phone, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      message: 'Profile updated successfully', 
      user: result.rows[0] 
    });
  } catch (error) {
    console.error("UpdateProfile error:", error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
};