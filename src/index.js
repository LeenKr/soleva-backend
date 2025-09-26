import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import contactRouter from "./routes/contact.js";   // <-- import your router

const app = express();
app.set("trust proxy", 1);

/* security & parsing */
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "1mb" }));

/* CORS */
const allowlist = [
  "http://localhost:5173",
  "https://soleva-alpha.vercel.app",
];
app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true);                // Postman/cURL
      if (allowlist.includes(origin)) return cb(null, true);
      if (origin.endsWith(".vercel.app")) return cb(null, true); // Vercel previews
      return cb(new Error("CORS blocked"));
    },
    credentials: false, // no cookies used
  })
);

/* rate limit */
app.use("/api/", rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
}));

/* health */
app.get("/api/health", (_req, res) => res.json({ ok: true, ts: Date.now() }));

/* CONTACT ROUTER — the ONLY contact handler */
app.use("/api/contact", contactRouter);   // <-- use your router here

/* errors */
app.use((err, _req, res, _next) => {
  console.error("Server error:", err?.message || err);
  res.status(500).json({ error: err?.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("API on", PORT));
