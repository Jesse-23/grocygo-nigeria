import { Response } from 'express';
import { query } from '../config/db';

export const getCart = async (req: any, res: Response) => {
  const userId = req.user.id;
  try {
    const result = await query(
      `SELECT c.id, c.quantity, p.id as product_id, p.name, p.price, p.image_url 
       FROM cart_items c 
       JOIN products p ON c.product_id = p.id 
       WHERE c.user_id = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart" });
  }
};

export const addToCart = async (req: any, res: Response) => {
  const { productId, quantity = 1 } = req.body;
  const userId = req.user.id;

  try {
    // UPSERT: If exists, increment quantity. If not, insert new.
    await query(
      `INSERT INTO cart_items (user_id, product_id, quantity) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (user_id, product_id) 
       DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity`,
      [userId, productId, quantity]
    );
    res.json({ message: "Item added to cart" });
  } catch (error) {
    res.status(500).json({ message: "Error adding to cart" });
  }
};

export const removeFromCart = async (req: any, res: Response) => {
  const { productId } = req.params;
  const userId = req.user.id;
  try {
    await query('DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2', [userId, productId]);
    res.json({ message: "Item removed" });
  } catch (error) {
    res.status(500).json({ message: "Error removing item" });
  }
};