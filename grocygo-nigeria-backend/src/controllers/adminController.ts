import { Response } from 'express';
import { query } from '../config/db';

export const getAdminStats = async (req: any, res: Response) => {
  try {
    // Get total orders count
    const totalOrders = await query('SELECT COUNT(*) FROM orders');
    
    // Get total revenue
    const revenue = await query('SELECT SUM(total_amount) FROM orders');
    
    // Get active deliveries (status not 'Delivered')
    const activeDeliveries = await query("SELECT COUNT(*) FROM orders WHERE status != 'Delivered'");
    
    // Get product count
    const productCount = await query('SELECT COUNT(*) FROM products');

    res.json({
      totalOrders: parseInt(totalOrders.rows[0].count),
      totalRevenue: parseFloat(revenue.rows[0].sum || 0),
      activeDeliveries: parseInt(activeDeliveries.rows[0].count),
      totalProducts: parseInt(productCount.rows[0].count)
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching admin stats" });
  }
};