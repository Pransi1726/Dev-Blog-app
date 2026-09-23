import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import postRoutes from './routes/postRoutes.js';
import './db.js'; // initializes db.json on first run

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

// CLIENT_URL can be a single origin or a comma-separated list, so the
// same deployment works for local dev AND production without editing
// this value back and forth, e.g.:
// CLIENT_URL=http://localhost:5173,https://your-blog.vercel.app
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const allowedOrigins = CLIENT_URL.split(',').map((s) => s.trim());

app.use(
  cors({
    origin(origin, callback) {
      // Allow tools with no origin header (curl, Render health checks, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.warn(`Blocked CORS request from origin: ${origin}`);
      return callback(new Error('Not allowed by CORS'));
    },
  })
);
app.use(express.json());

// Simple request logger — helpful while debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use('/api/posts', postRoutes);

app.get('/', (req, res) => {
  res.send('Blog API is running (file-based storage — see backend/db.json).');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
  console.log('Data is stored locally in backend/db.json — no external database needed.');
});

