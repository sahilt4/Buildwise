import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Routes
import sitesRouter from './routes/sites.js';
import materialsRouter from './routes/materials.js';
import leftoversRouter from './routes/leftovers.js';
import marketplaceRouter from './routes/marketplace.js';
import workersRouter from './routes/workers.js';
import tasksRouter from './routes/tasks.js';
import attendanceRouter from './routes/attendance.js';
import activitiesRouter from './routes/activities.js';
import authRouter from './routes/auth.js';
import { runSeed } from './seed.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/buildwise';

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json());

// Request logger for API visibility
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Root & Health check
app.get('/api/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.json({
    status: 'ok',
    service: 'Buildwise Construction Management API',
    database: isDbConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Seed / Re-populate Database endpoint (for demo / initial Atlas setup)
app.post('/api/seed', async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    if (!isDbConnected) {
      return res.status(503).json({
        error: 'Database Not Connected',
        message: 'Cannot seed database because MongoDB Atlas is disconnected. Please check your MONGODB_URI in backend/.env'
      });
    }
    const additive = Boolean(req.body && req.body.additive);
    const result = await runSeed(additive);
    res.json(result);
  } catch (err) {
    console.error('API Seed Error:', err);
    res.status(500).json({
      error: 'Seeding Failed',
      message: err.message
    });
  }
});

// API Routes
app.use('/api/sites', sitesRouter);
app.use('/api/materials', materialsRouter);
app.use('/api/leftovers', leftoversRouter);
app.use('/api/marketplace', marketplaceRouter);
app.use('/api/workers', workersRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/activities', activitiesRouter);
app.use('/api/auth', authRouter);

// Serve static frontend build in production or when dist exists
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// For any non-API route, serve Vite index.html (SPA client routing)
// Compatible with Express 5 path-to-regexp v8
app.use((req, res, next) => {
  if (req.method !== 'GET' || req.url.startsWith('/api')) {
    return next();
  }
  const indexHtml = path.join(distPath, 'index.html');
  res.sendFile(indexHtml, (err) => {
    if (err) {
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head><title>Buildwise API Server</title></head>
          <body style="font-family:sans-serif;padding:2rem;text-align:center;">
            <h2>🚀 Buildwise Backend API is Running</h2>
            <p>API endpoints are active at <code>/api</code> (e.g. <a href="/api/health">/api/health</a>).</p>
            <p>If you intended to deploy the frontend here, ensure <code>npm run build</code> was executed during build step.</p>
          </body>
        </html>
      `);
    }
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred'
  });
});

// Connect to MongoDB Atlas and Start Server
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas / Database successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Buildwise Backend running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.log('⚠️ Running Express server in offline database mode to allow configuration...');
    app.listen(PORT, () => {
      console.log(`🚀 Buildwise Backend running on http://localhost:${PORT} (Waiting for valid MONGODB_URI)`);
    });
  });

export default app;
