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

// Middleware - The Ultimate CORS Debugger & Fix
app.use(cors({
  origin: function (origin, callback) {
    // This logs the exact URL your device is sending to the server
    console.log("🚪 Incoming Origin Knocking:", origin); 
    
    // This dynamically allows whoever is knocking to come in
    // It safely bypasses the strict credentials rule by reflecting their exact name back
    callback(null, origin || true); 
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

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