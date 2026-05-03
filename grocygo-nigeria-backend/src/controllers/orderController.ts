import { Response } from 'express';
import { query } from '../config/db';

/**
 * 1. Place Order
 * Handles order creation, stock deduction, and cart clearing.
 */
export const placeOrder = async (req: any, res: Response) => {
  const userId = req.user.id;
  const { totalAmount, deliveryAddress, cartItems } = req.body;

  try {
    // 1. Create the Order record
    const orderResult = await query(
      `INSERT INTO orders (user_id, total_amount, delivery_address) 
       VALUES ($1, $2, $3) RETURNING id`,
      [userId, totalAmount, deliveryAddress]
    );

    const orderId = orderResult.rows[0].id;

    // 2. Process items: Save to order_items AND Update Product Stock
    const orderPromises = cartItems.flatMap((item: any) => [
      // Promise A: Insert into order_items
      query(
        `INSERT INTO order_items (order_id, product_id, quantity, price_at_time_of_purchase) 
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.product.id, item.quantity, item.product.price]
      ),
      // Promise B: Subtract quantity from Products table
      query(
        `UPDATE products 
         SET stock_quantity = stock_quantity - $1 
         WHERE id = $2`,
        [item.quantity, item.product.id]
      )
    ]);

    await Promise.all(orderPromises);

    // 3. Clear the user's cart now that the order is placed
    await query(`DELETE FROM cart_items WHERE user_id = $1`, [userId]);

    res.status(201).json({ 
      message: "Order placed successfully", 
      orderId 
    });
  } catch (error) {
    console.error("Checkout Error:", error);
    res.status(500).json({ message: "Failed to place order" });
  }
};

/**
 * 2. Get My Orders
 * Fetches all orders belonging to the logged-in user.
 */
export const getMyOrders = async (req: any, res: Response) => {
  const userId = req.user.id; // Extracted from verifyToken middleware

  try {
    const result = await query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Fetch My Orders Error:", error);
    res.status(500).json({ message: "Failed to fetch your orders" });
  }
};