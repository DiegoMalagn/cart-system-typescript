import express from "express";
import Stripe from "stripe";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import multer from "multer";
import crypto from "crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "./src/lib/r2Client";

// Required environment variables (set in Railway dashboard and /server/.env):
// R2_ENDPOINT      — https://<accountid>.r2.cloudflarestorage.com
// R2_ACCESS_KEY_ID — from Cloudflare R2 API token
// R2_SECRET_ACCESS_KEY — from Cloudflare R2 API token
// R2_BUCKET_NAME   — e.g. stamplabprints-designs
// R2_PUBLIC_URL    — public base URL e.g. https://pub-xxxx.r2.dev

dotenv.config();

console.log("Starting server...");

// ✅ Mongo connection with logging
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// ✅ Port handling
const PORT: number = (() => {
  const raw = process.env.PORT;
  if (!raw) return 4000;
  const parsed = parseInt(raw, 10);
  return Number.isNaN(parsed) ? 4000 : parsed;
})();

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

// ✅ Stripe init
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-03-25.dahlia",
});

// ✅ CLIENT URL
const CLIENT_URL = (process.env.CLIENT_URL || "http://localhost:5173")
  .trim()
  .replace(/\/$/, "");

// ✅ CORS
app.use(
  cors({
    origin: CLIENT_URL,
  })
);

/* =========================================================
    WEBHOOK (MUST COME BEFORE express.json())
========================================================= */
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = (req.headers["stripe-signature"] || "") as string;

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error("Missing STRIPE_WEBHOOK_SECRET env var");
      return res.status(500).json({ error: "Webhook secret is not configured" });
    }

  let event: any;

    try {
      // express.raw provides a Buffer
      const payload = req.body as Buffer;
      event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err: any) {
      console.error("❌ Webhook signature verification failed:", err?.message || err);
      return res.status(400).json({ error: "Invalid signature" });
    }

    if (event.type === "checkout.session.completed") {
  const session = event.data.object as any;

      console.log("✅ Payment confirmed:", session.id);

      try {
        const items = JSON.parse(session.metadata?.items || "[]");

        await Order.create({
          sessionId: session.id,
          amountTotal: session.amount_total,
          items,
        });

        console.log("✅ Order saved to DB");
      } catch (err) {
        console.error("❌ Error saving order:", err);
      }
    }

    res.sendStatus(200);
  }
);

/* =========================================================
    BODY PARSER (AFTER webhook)
========================================================= */
app.use(express.json());

/* =========================================================
    MONGOOSE MODEL
========================================================= */
const orderSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  items: { type: Array, default: [] },
  amountTotal: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);

/* =========================================================
    ROUTES
========================================================= */
app.get("/", (_req, res) => {
  res.send("Server is alive");
});

app.get("/healthz", (_req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

app.post("/api/upload-design", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "Upload failed: PNG file is required" });
    }

    if (file.mimetype !== "image/png") {
      return res.status(400).json({ error: "Upload failed: file must be image/png" });
    }

    if (file.size >= 20 * 1024 * 1024) {
      return res.status(400).json({ error: "Upload failed: file must be under 20MB" });
    }

    if (!process.env.R2_BUCKET_NAME || !process.env.R2_PUBLIC_URL || !process.env.R2_ENDPOINT) {
      return res.status(500).json({ error: "R2 storage is not configured" });
    }

    const key = `designs/${Date.now()}-${crypto.randomUUID()}.png`;

    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: "image/png",
        CacheControl: "public, max-age=31536000",
      })
    );

    return res.json({
      url: `${process.env.R2_PUBLIC_URL.replace(/\/$/, "")}/${key}`,
    });
  } catch (error: any) {
    console.error("Upload failed", error);
    return res.status(500).json({ error: error?.message || "Upload failed" });
  }
});

/* =========================================================
    CHECKOUT
========================================================= */
app.post("/checkout", async (req, res) => {
  console.log("request received.");
  const { items } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: items.map((item: any) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.size ? `${item.name} (Size: ${item.size})` : item.name,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      success_url: `${CLIENT_URL}/payment/success`,
      cancel_url: `${CLIENT_URL}/payment/failed`,
      metadata: {
        items: JSON.stringify(items),
      },
    });

    //  DO NOT SAVE ORDER HERE

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Checkout failed" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
