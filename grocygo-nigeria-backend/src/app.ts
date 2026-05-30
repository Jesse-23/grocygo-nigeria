import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { query } from './config/db';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import addressRoutes from './routes/addressRoutes';
import cartRoutes from './routes/cartRoutes';
import orderRoutes from './routes/orderRoutes';
import adminRoutes from './routes/adminRoutes';

dotenv.config();

const app: Application = express();

// Middleware 
app.use(cors());
app.use(express.json()); // Allows the server to read JSON sent from your frontend

// Routes

// 1. Health Check
app.get('/', (req: Request, res: Response) => {
  res.send('Grocygo Nigeria API is live! 🚀');
});

// 2. Database Connection Test
// Accessible at http://localhost:5000/test-db
app.get('/test-db', async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT NOW()');
    res.json({
      status: 'success',
      message: 'PostgreSQL is connected!',
      db_time: result.rows[0].now,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      status: 'error', 
      message: 'Database connection failed' 
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// --- Server Startup ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server is sprinting on port ${PORT}`);
  console.log(`🔗 Local: http://localhost:${PORT}`);
});