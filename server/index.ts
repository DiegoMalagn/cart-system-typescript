import express from "express";
import Stripe from "stripe";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import multer from "multer";
import crypto from "crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import nodemailer from "nodemailer";
import { r2 } from "./src/lib/r2Client";
import { Order } from "./src/models/Order";
import {
  buildCartQuote,
  buildStripeShippingOption,
  type CartItemCustomizationInput,
  type NormalizedQuoteItem,
  type QuoteRequest,
  type QuoteRequestItem,
} from "./src/lib/pricing";

// Required environment variables (set in Railway dashboard and /server/.env):
// R2_ENDPOINT      — https://<accountid>.r2.cloudflarestorage.com
// R2_ACCESS_KEY_ID — from Cloudflare R2 API token
// R2_SECRET_ACCESS_KEY — from Cloudflare R2 API token
// R2_BUCKET_NAME   — e.g. stamplabprints-designs
// R2_PUBLIC_URL    — public base URL e.g. https://pub-xxxx.r2.dev

dotenv.config();

console.log("Starting server...");

const REQUIRED_SMTP_ENV_VARS = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
] as const;

for (const envVar of REQUIRED_SMTP_ENV_VARS) {
  if (!process.env[envVar]?.trim()) {
    throw new Error(`Missing required SMTP environment variable: ${envVar}`);
  }
}

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

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
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== "image/png") {
      cb(new Error("PNG_ONLY"));
    } else {
      cb(null, true);
    }
  },
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-03-25.dahlia",
});

// Required environment variables (add to Railway and server/.env):
// SMTP_HOST — e.g. smtp-mail.outlook.com for Outlook
// SMTP_PORT — 587
// SMTP_USER — stamplabprints@outlook.com
// SMTP_PASS — your Outlook password or app password
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  requireTLS: true,
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 20000,
});

async function verifyTransport() {
  try {
    await transporter.verify();
    console.log("SMTP connection ready");
  } catch (error) {
    const smtpError = error as NodeJS.ErrnoException;
    console.error("SMTP VERIFY FAILED:", error);
    console.error("SMTP VERIFY FAILED message:", smtpError.message);
    console.error("SMTP VERIFY FAILED code:", smtpError.code);
  }
}

void verifyTransport();

const CLIENT_URL = (process.env.CLIENT_URL || "http://localhost:5173")
  .trim()
  .replace(/\/$/, "");

type CheckoutItemCustomization = {
  productType: string;
  color?: string;
  size?: string;
  genderFit?: string;
  material?: string;
  design: CartItemCustomizationInput["design"];
  transform: CartItemCustomizationInput["transform"];
};

type CheckoutItemPayload = {
  id: number;
  size?: string;
  quantity?: number;
  productType?: string;
  genderFit?: string;
  customization?: CheckoutItemCustomization;
};

function toOptionalString(value: unknown) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function toOptionalNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string" || !value.trim()) return undefined;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function toCurrencyAmount(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function serializeLineItemMetadata(item: NormalizedQuoteItem) {
  const customization = item.customization;
  return {
    productType: item.productType,
    size: item.size ?? "",
    genderFit: item.genderFit ?? "",
    color: item.color ?? "",
    material: item.material ?? "",
    designId: customization?.design.id ?? "",
    designLabel: customization?.design.label ?? "",
    designSourceType: customization?.design.sourceType ?? "",
    designImageUrl: customization?.design.imageUrl ?? "",
    transformX: customization ? String(customization.transform.x) : "",
    transformY: customization ? String(customization.transform.y) : "",
    transformScale: customization ? String(customization.transform.scale) : "",
    transformRotationDeg: customization
      ? String(customization.transform.rotationDeg)
      : "",
  };
}

function getExpandedProduct(product: unknown) {
  if (
    !product ||
    typeof product === "string" ||
    typeof product !== "object" ||
    ("deleted" in product && Boolean(product.deleted))
  ) {
    return null;
  }

  return product;
}

function normalizeOrderItem(lineItem: any) {
  const expandedProduct = getExpandedProduct(lineItem.price?.product) as
    | { name?: string; metadata?: Record<string, string> }
    | null;
  const metadata = expandedProduct?.metadata ?? {};
  const quantity = lineItem.quantity ?? 1;
  const unitPrice = lineItem.price?.unit_amount ?? Math.round((lineItem.amount_total ?? 0) / quantity);
  const lineTotal = lineItem.amount_total ?? unitPrice * quantity;
  const designId = toOptionalString(metadata.designId);
  const designLabel = toOptionalString(metadata.designLabel);
  const designSourceType = toOptionalString(metadata.designSourceType) as
    | "preset"
    | "upload"
    | undefined;
  const designImageUrl = toOptionalString(metadata.designImageUrl);

  return {
    productType:
      toOptionalString(metadata.productType) ??
      toOptionalString(expandedProduct?.name) ??
      "standard-product",
    quantity,
    unitPrice,
    lineTotal,
    size: toOptionalString(metadata.size),
    genderFit: toOptionalString(metadata.genderFit),
    color: toOptionalString(metadata.color),
    material: toOptionalString(metadata.material),
    customization:
      designId && designLabel && designSourceType && designImageUrl
        ? {
            design: {
              id: designId,
              label: designLabel,
              sourceType: designSourceType,
              imageUrl: designImageUrl,
            },
            transform: {
              x: toOptionalNumber(metadata.transformX) ?? 0,
              y: toOptionalNumber(metadata.transformY) ?? 0,
              scale: toOptionalNumber(metadata.transformScale) ?? 1,
              rotationDeg: toOptionalNumber(metadata.transformRotationDeg) ?? 0,
            },
          }
        : undefined,
    productionStatus: "queued",
  };
}

function buildOrderNumber(sessionId: string) {
  const suffix = sessionId.replace(/^cs_/, "").slice(-10).toUpperCase();
  return `SLP-${suffix}`;
}

async function persistCompletedCheckout(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["payment_intent"],
  });

  const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
    limit: 100,
    expand: ["data.price.product"],
  });

  const shippingDetails = (session as any).shipping_details;
  const customerDetails = session.customer_details;
  const shippingAddress = shippingDetails?.address ?? customerDetails?.address ?? null;

  const normalizedItems = lineItems.data.map(normalizeOrderItem);

  await Order.findOneAndUpdate(
    { stripeSessionId: session.id },
    {
      orderNumber: buildOrderNumber(session.id),
      stripeSessionId: session.id,
      stripePaymentIntentId:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id,
      paymentStatus: session.payment_status ?? "paid",
      fulfillmentStatus: "queued",
      customer: {
        fullName:
          toOptionalString(customerDetails?.name) ??
          toOptionalString(shippingDetails?.name),
        email: toOptionalString(customerDetails?.email),
        phone: toOptionalString(customerDetails?.phone),
      },
      shippingAddress: shippingAddress
        ? {
            recipientName:
              toOptionalString(shippingDetails?.name) ??
              toOptionalString(customerDetails?.name),
            line1: toOptionalString(shippingAddress.line1),
            line2: toOptionalString(shippingAddress.line2),
            city: toOptionalString(shippingAddress.city),
            state: toOptionalString(shippingAddress.state),
            postalCode: toOptionalString(shippingAddress.postal_code),
            country: toOptionalString(shippingAddress.country),
          }
        : undefined,
      pricing: {
        subtotal: toCurrencyAmount(session.amount_subtotal),
        shipping: toCurrencyAmount(session.total_details?.amount_shipping),
        tax: toCurrencyAmount(session.total_details?.amount_tax),
        total: toCurrencyAmount(session.amount_total),
        currency: toOptionalString(session.currency)?.toUpperCase() ?? "USD",
      },
      items: normalizedItems,
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
      runValidators: true,
    }
  );
}

app.use(
  cors({
    origin: CLIENT_URL,
  })
);

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
      const payload = req.body as Buffer;
      event = stripe.webhooks.constructEvent(
        payload,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err?.message || err);
      return res.status(400).json({ error: "Invalid signature" });
    }

    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      const checkoutSession = event.data.object as { id: string };

      try {
        await persistCompletedCheckout(checkoutSession.id);
        console.log("Order normalized and saved:", checkoutSession.id);
      } catch (err) {
        console.error("Failed to normalize Stripe checkout session:", {
          sessionId: checkoutSession.id,
          error: err,
        });
      }
    }

    return res.sendStatus(200);
  }
);

app.use((req, res, next) => {
  if (req.path === "/api/upload-design") return next();
  express.json()(req, res, next);
});

app.get("/", (_req, res) => {
  res.send("Server is alive");
});

app.get("/healthz", (_req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

app.post("/api/cart/quote", (req, res) => {
  try {
    const quoteRequest = req.body as QuoteRequest;
    const quote = buildCartQuote({
      items: quoteRequest.items ?? [],
      estimateAddress: quoteRequest.estimateAddress,
    });

    return res.json(quote);
  } catch (error: any) {
    console.error("Quote generation failed:", error);
    return res.status(400).json({
      error: error?.message || "Unable to generate cart quote",
    });
  }
});

app.post("/api/upload-design", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file received" });
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

app.use(
  "/api/upload-design",
  (err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    if (err?.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File too large — maximum size is 20MB" });
    }
    if (err?.message === "PNG_ONLY") {
      return res.status(400).json({ error: "Only PNG files are accepted" });
    }
    return res.status(500).json({ error: "Upload failed" });
  }
);

app.get("/api/design-image", async (req, res) => {
  const url = req.query.url as string;

  if (!url || !url.startsWith(process.env.R2_PUBLIC_URL!)) {
    return res.status(400).json({ error: "Invalid image URL" });
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(502).json({ error: "Could not fetch image" });
    }

    const buffer = await response.arrayBuffer();
    res.set("Content-Type", "image/png");
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Cache-Control", "public, max-age=31536000");
    return res.send(Buffer.from(buffer));
  } catch {
    return res.status(500).json({ error: "Proxy failed" });
  }
});

app.post("/checkout", async (req, res) => {
  const { items } = req.body as { items?: CheckoutItemPayload[] };

  if (!items?.length) {
    return res.status(400).json({ error: "No checkout items provided" });
  }

  try {
    const quote = buildCartQuote({
      items: items as QuoteRequestItem[],
    });

    // Stripe Tax must be enabled in the Stripe Dashboard for automatic_tax to work.
    // Each line item is sent as tax-exclusive so Checkout can calculate the final tax.
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      billing_address_collection: "required",
      customer_creation: "always",
      phone_number_collection: {
        enabled: true,
      },
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
      automatic_tax: {
        enabled: true,
      },
      shipping_options: [buildStripeShippingOption(quote)],
      line_items: quote.items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.size ? `${item.displayName} (Size: ${item.size})` : item.displayName,
            metadata: serializeLineItemMetadata(item),
          },
          unit_amount: item.unitPrice,
          tax_behavior: "exclusive",
        },
        quantity: item.quantity,
      })),
      success_url: `${CLIENT_URL}/payment/success`,
      cancel_url: `${CLIENT_URL}/payment/failed`,
      metadata: {
        cartItemCount: String(quote.items.length),
        quoteSubtotal: String(quote.subtotal),
        quoteShipping: String(quote.shipping),
      },
    });

    return res.json({ url: session.url });
  } catch (err) {
    console.error("Checkout session creation failed:", err);
    const message =
      err instanceof Error &&
      err.message.toLowerCase().includes("automatic tax")
        ? "Stripe Checkout could not start because automatic tax is not fully configured."
        : "Checkout failed";
    return res.status(500).json({ error: message });
  }
});

app.post("/api/contact", async (req, res) => {
  try {
    console.log("Contact request received");

    const { name, email, subject, message } = req.body as {
      name: string;
      email: string;
      subject: string;
      message: string;
    };

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    await transporter.verify();
    console.log("SMTP verify passed for contact request");
    console.log("Sending contact email");

    const sendResult = await Promise.race([
      transporter.sendMail({
      from: `"Stamp Lab Prints" <${process.env.SMTP_USER}>`,
      to: "stamplabprints@outlook.com",
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #884c42;">New Contact Form Submission</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; font-weight: bold; width: 100px;">Name:</td>
              <td style="padding: 8px;">${name}</td>
            </tr>
            <tr style="background: #fdfaf0;">
              <td style="padding: 8px; font-weight: bold;">Email:</td>
              <td style="padding: 8px;">
                <a href="mailto:${email}">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Subject:</td>
              <td style="padding: 8px;">${subject}</td>
            </tr>
            <tr style="background: #fdfaf0;">
              <td style="padding: 8px; font-weight: bold; vertical-align: top;">
                Message:
              </td>
              <td style="padding: 8px; white-space: pre-wrap;">${message}</td>
            </tr>
          </table>
          <p style="color: #888; font-size: 12px; margin-top: 24px;">
            Sent from stamplabprints.com contact form
          </p>
        </div>
      `,
      }),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Contact email timed out")), 20000);
      }),
    ]);

    console.log(
      "Email sent:",
      typeof sendResult === "object" && sendResult && "messageId" in sendResult
        ? sendResult.messageId
        : "unknown"
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    const emailError = error as NodeJS.ErrnoException;
    console.error("EMAIL ERROR:", error);
    console.error("EMAIL ERROR message:", emailError.message);
    console.error("EMAIL ERROR code:", emailError.code);
    return res.status(500).json({ error: "Email failed to send" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
