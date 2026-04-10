import express from "express";
import Stripe from "stripe";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

console.log("Starting server...");

// Use a numeric port for app.listen. Railway provides PORT as a string, so
// parse it and fallback to 4000 when missing or invalid.
const PORT: number = (() => {
  const raw = process.env.PORT;
  if (!raw) return 4000;
  const parsed = parseInt(raw, 10);
  return Number.isNaN(parsed) ? 4000 : parsed;
})();

const app = express();
// Read client URL from environment and normalize (no trailing slash)
const CLIENT_URL = (process.env.CLIENT_URL || "http://localhost:5173").trim().replace(/\/$/, "");

app.use(
  cors({
    origin: CLIENT_URL,
  })
);
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string,{
  apiVersion: "2026-03-25.dahlia",
});

app.get("/", (req, res) => {
  res.send("Server is alive");
});

// Simple health check endpoint for Railway / uptime/readiness checks
app.get("/healthz", (_req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

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
            name: `${item.name} (Size: ${item.size})`,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
  success_url: `${CLIENT_URL}/success`,
  cancel_url: CLIENT_URL,
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: "Checkout failed" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});