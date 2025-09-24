import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import contactRouter from './routes/contact.js';

const app = express();

// security
app.use(helmet());
app.use(express.json());

// CORS
const allowed = (process.env.ALLOWED_ORIGINS || '').split(',');
app.use(cors({
  origin(origin, cb) {
    if (!origin || allowed.includes(origin)) return cb(null, true);
    cb(new Error('CORS not allowed: ' + origin));
  }
}));

// rate limit
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }));

// routes
app.use('/api/contact', contactRouter);

// health
app.get('/api/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
