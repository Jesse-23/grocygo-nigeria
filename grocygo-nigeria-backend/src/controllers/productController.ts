import { Request, Response } from 'express';
import { query } from '../config/db';

// Get all products (for the Shop page)
export const getProducts = async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
};

// Add a new product (for the Admin dashboard)
export const createProduct = async (req: Request, res: Response) => {
  const { name, description, price, image_url, stock_quantity, category } = req.body;
  try {
    const result = await query(
      'INSERT INTO products (name, description, price, image_url, stock_quantity, category) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, description, price, image_url, stock_quantity, category]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product' });
  }
};