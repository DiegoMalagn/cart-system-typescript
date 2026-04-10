import express from "express";
import Stripe from "stripe";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

console.log("Starting server...");

const app = express();
app.use(cors());
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string,{
  apiVersion: "2026-03-25.dahlia",
});

app.get("/", (req, res) => {
  res.send("Server is alive");
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
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: "Checkout failed" });
  }
});

app.listen(4000, () => console.log("Server running on port 4000"));