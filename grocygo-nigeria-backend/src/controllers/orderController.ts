import { Response } from 'express';
import { query } from '../config/db';

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

    // 2. Map through cart items and save them to order_items
    const itemPromises = cartItems.map((item: any) => {
      return query(
        `INSERT INTO order_items (order_id, product_id, quantity, price_at_time_of_purchase) 
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.product.id, item.quantity, item.product.price]
      );
    });

    await Promise.all(itemPromises);

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