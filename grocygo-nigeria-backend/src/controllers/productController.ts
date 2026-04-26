import { Request, Response } from "express";
import { query } from "../config/db";

// Get products with Search and Category filtering
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { q, category } = req.query;

    // Base query
    let queryText = "SELECT * FROM products WHERE 1=1";
    const params: any[] = [];

    // 1. Filter by Category
    if (category && category !== "all" && category !== "") {
      params.push(category);
      queryText += ` AND category = $${params.length}`;
    }

    // 2. Filter by Search Query
    if (q) {
      params.push(`%${q}%`);
      queryText += ` AND (name ILIKE $${params.length} OR description ILIKE $${params.length})`;
    }

    // 3. Add Ordering
    queryText += " ORDER BY id DESC"; // Using ID for consistent ordering

    const result = await query(queryText, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Search/Filter Error:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
};

// Add a new product (for the Admin dashboard)
export const createProduct = async (req: Request, res: Response) => {
  const { name, description, price, image_url, stock_quantity, category } =
    req.body;
  try {
    const result = await query(
      "INSERT INTO products (name, description, price, image_url, stock_quantity, category) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        name,
        description || "",
        price,
        image_url || "/images/placeholder.png",
        stock_quantity || 0,
        category,
      ],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ message: "Error creating product" });
  }
};

// Delete a product (NEW)
export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ message: "Failed to delete product" });
  }
};
