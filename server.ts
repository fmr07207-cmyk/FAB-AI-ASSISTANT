import express from "express";
import { createServer as createViteServer } from "vite";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Security Middleware
  app.use(helmet({
    contentSecurityPolicy: false, // Disabled for development/vite
  }));
  app.use(cors());
  app.use(express.json());

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later."
  });
  app.use("/api/", limiter);

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "FAB Backend is running securely." });
  });

  // Mock endpoints for Vulnerability Scanner & Encryption Tools
  app.post("/api/scan", (req, res) => {
    const { target } = req.body;
    res.json({ status: "success", report: `Simulated scan completed for ${target}. No critical vulnerabilities found.` });
  });

  app.post("/api/encrypt", (req, res) => {
    const { text } = req.body;
    // Simple mock encryption (base64)
    const encrypted = Buffer.from(text).toString('base64');
    res.json({ status: "success", encrypted });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
