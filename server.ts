import express from "express";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { 
  findNearbyHubs, 
  getDisasterZoneFacilities, 
  getRoadRoute, 
  extractMedicineDetails,
  detectPills,
  extractMedicineBack,
  processVoiceChat
} from "./serverAiService.ts";

// Support both ES Modules (dev) and CommonJS (prod bundle)
let currentFilename = "";
try {
  if (typeof __filename !== "undefined") {
    currentFilename = __filename;
  } else if (typeof import.meta !== "undefined" && import.meta?.url) {
    currentFilename = fileURLToPath(import.meta.url);
  }
} catch (e) {}

const __filename_safe = currentFilename;
const __dirname_safe = currentFilename ? path.dirname(currentFilename) : process.cwd();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: "50mb" })); // Increase limit for Base64 image transfers

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", env: process.env.NODE_ENV });
  });

  // Proxy Routes for Server-side AI Calls (Gemini / Google Maps)
  app.post("/api/ai/nearby-hubs", async (req: express.Request, res: express.Response) => {
    const { query, latitude, longitude } = req.body;
    try {
      const result = await findNearbyHubs(query, Number(latitude), Number(longitude));
      res.json(result);
    } catch (error: any) {
      console.error("[Server proxy] error in findNearbyHubs route:", error);
      res.status(500).json({ error: error.message || "Internal AI query failure" });
    }
  });

  app.post("/api/ai/disaster-facilities", async (req: express.Request, res: express.Response) => {
    const { zoneName } = req.body;
    try {
      const result = await getDisasterZoneFacilities(zoneName);
      res.json(result);
    } catch (error: any) {
      console.error("[Server proxy] error in getDisasterZoneFacilities route:", error);
      res.status(500).json({ error: error.message || "Internal disaster facilities lookup failure" });
    }
  });

  app.post("/api/ai/road-route", async (req: express.Request, res: express.Response) => {
    const { start, end } = req.body;
    try {
      const result = await getRoadRoute(start, end);
      res.json(result);
    } catch (error: any) {
      console.error("[Server proxy] error in getRoadRoute route:", error);
      res.status(500).json({ error: error.message || "Internal routing failure" });
    }
  });

  app.post("/api/ai/extract-medicine", async (req: express.Request, res: express.Response) => {
    const { image } = req.body;
    try {
      const result = await extractMedicineDetails(image);
      res.json(result);
    } catch (error: any) {
      console.error("[Server proxy] error in extractMedicineDetails route:", error);
      res.status(500).json({ error: error.message || "Internal medicine extraction failure" });
    }
  });

  app.post("/api/ai/detect-pills", async (req: express.Request, res: express.Response) => {
    const { image } = req.body;
    try {
      const result = await detectPills(image);
      res.json(result);
    } catch (error: any) {
      console.error("[Server proxy] error in detectPills route:", error);
      res.status(500).json({ error: error.message || "Internal pill detection failure" });
    }
  });

  app.post("/api/ai/extract-medicine-back", async (req: express.Request, res: express.Response) => {
    const { image } = req.body;
    try {
      const result = await extractMedicineBack(image);
      res.json(result);
    } catch (error: any) {
      console.error("[Server proxy] error in extractMedicineBack route:", error);
      res.status(500).json({ error: error.message || "Internal back medicine extraction failure" });
    }
  });

  app.post("/api/ai/voice-chat", async (req: express.Request, res: express.Response) => {
    const { prompt } = req.body;
    try {
      const result = await processVoiceChat(prompt || "Hello");
      res.json(result);
    } catch (error: any) {
      console.error("[Server proxy] error in voice-chat route:", error);
      res.status(500).json({ error: error.message || "Voice chat service error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production: serve static files from dist
    const distPath = path.join(process.cwd(), "dist");
    console.log(`Production mode: serving static files from ${distPath}`);
    
    // Serve static files
    app.use(express.static(distPath));
    
    // SPA fallback
    app.get("*all", (req, res) => {
      const indexHtml = path.join(distPath, "index.html");
      console.log(`Serving index.html from ${indexHtml}`);
      res.sendFile(indexHtml);
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
