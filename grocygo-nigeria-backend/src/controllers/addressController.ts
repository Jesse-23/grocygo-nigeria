import { Request, Response } from 'express';
import { query } from '../config/db';

// Get all addresses for the logged-in user
export const getAddresses = async (req: any, res: Response) => {
  const userId = req.user.id;

  try {
    const result = await query(
      'SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ message: 'Server error while fetching addresses' });
  }
};

// Add a new address
export const addAddress = async (req: any, res: Response) => {
  const { label, street_address, city, state, is_default } = req.body;
  const userId = req.user.id;

  try {
    // If this is set as default, unset other defaults for this user first
    if (is_default) {
      await query('UPDATE addresses SET is_default = false WHERE user_id = $1', [userId]);
    }

    const result = await query(
      `INSERT INTO addresses (user_id, label, street_address, city, state, is_default) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [userId, label, street_address, city, state, is_default || false]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({ message: 'Server error while adding address' });
  }
};