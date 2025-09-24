import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";

const app = express();
app.set("trust proxy", 1);

/* --- security & parsing --- */
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "1mb" }));

/* --- CORS: allow local + your Vercel site(s) --- */
const allowlist = [
  "http://localhost:5173",
  "https://soleva-alpha.vercel.app",   // <-- no trailing slash
  // "https://your-custom-domain.com"   // <-- add later if you connect a domain
];
app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true); // Postman/cURL
      if (allowlist.includes(origin)) return cb(null, true);
      if (origin.endsWith(".vercel.app")) return cb(null, true); // allow preview deploys
      return cb(new Error("CORS blocked"));
    },
    credentials: true,
  })
);

/* --- basic rate limit --- */
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,             // 60 requests per minute
  standardHeaders: true, // send RateLimit-* headers
  legacyHeaders: false,  // disable X-RateLimit-* headers
});
app.use("/api/", apiLimiter);

/* --- health check --- */
app.get("/api/health", (req, res) => res.json({ ok: true, ts: Date.now() }));

/* --- contact route (placeholder) --- */
app.post("/api/contact", (req, res) => {
  const { name, email, message, phone, projectType, budget } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  // TODO: add Nodemailer here
  return res.json({ ok: true });
});

/* --- error handler --- */
app.use((err, req, res, next) => {
  console.error("Server error:", err?.message);
  res.status(500).json({ error: err?.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("API on", PORT));
