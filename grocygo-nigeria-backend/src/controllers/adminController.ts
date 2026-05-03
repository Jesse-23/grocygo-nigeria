import { Request, Response } from 'express';
import { query } from '../config/db';

/**
 * 1. Get Dashboard Stats
 * Fetches overview metrics for the admin cards.
 */
export const getAdminStats = async (req: any, res: Response) => {
  try {
    const totalOrders = await query('SELECT COUNT(*) FROM orders');
    const revenue = await query('SELECT SUM(total_amount) FROM orders');
    const activeDeliveries = await query("SELECT COUNT(*) FROM orders WHERE status != 'Delivered' AND status != 'Cancelled'");
    const productCount = await query('SELECT COUNT(*) FROM products');

    res.json({
      totalOrders: parseInt(totalOrders.rows[0].count),
      totalRevenue: parseFloat(revenue.rows[0].sum || 0),
      activeDeliveries: parseInt(activeDeliveries.rows[0].count),
      totalProducts: parseInt(productCount.rows[0].count)
    });
  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ message: "Error fetching admin stats" });
  }
};

/**
 * 2. Update Order Status
 * Updates the status of a specific order (e.g., Shipped, Delivered).
 */
export const updateOrderStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const result = await query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ 
      message: `Order #${id} marked as ${status}`,
      order: result.rows[0] 
    });
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
};

/**
 * 3. Get Recent Orders
 * Fetches all orders for the Admin Dashboard table with user details.
 */
export const getRecentOrders = async (req: Request, res: Response) => {
  try {
    const orders = await query(`
      SELECT 
        o.id, 
        o.total_amount, 
        o.status, 
        o.created_at, 
        o.delivery_address,
        u.name AS full_name, -- Changed from full_name to name
        u.email 
      FROM orders o 
      LEFT JOIN users u ON o.user_id = u.id 
      ORDER BY o.created_at DESC 
      LIMIT 50
    `);
    
    console.log(`Admin Data Fetch: Found ${orders.rows.length} orders.`);
    res.json(orders.rows);
  } catch (error) {
    console.error("Detailed Fetch Error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};