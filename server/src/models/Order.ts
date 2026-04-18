import mongoose, { Schema, type InferSchemaType, type HydratedDocument } from "mongoose";

const orderItemCustomizationSchema = new Schema(
  {
    design: {
      id: { type: String, required: true },
      label: { type: String, required: true },
      sourceType: {
        type: String,
        enum: ["preset", "upload"],
        required: true,
      },
      imageUrl: { type: String, required: true },
    },
    transform: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
      scale: { type: Number, required: true },
      rotationDeg: { type: Number, required: true, default: 0 },
    },
  },
  { _id: false }
);

const orderItemSchema = new Schema(
  {
    productType: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    lineTotal: { type: Number, required: true, min: 0 },
    size: { type: String, default: undefined },
    genderFit: { type: String, default: undefined },
    color: { type: String, default: undefined },
    material: { type: String, default: undefined },
    customization: {
      type: orderItemCustomizationSchema,
      default: undefined,
    },
    productionStatus: {
      type: String,
      required: true,
      default: "queued",
    },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, index: true },
    stripeSessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    stripePaymentIntentId: { type: String, default: undefined },
    paymentStatus: { type: String, required: true },
    fulfillmentStatus: {
      type: String,
      required: true,
      default: "queued",
    },
    customer: {
      fullName: { type: String, default: undefined },
      email: { type: String, default: undefined },
      phone: { type: String, default: undefined },
    },
    shippingAddress: {
      recipientName: { type: String, default: undefined },
      line1: { type: String, default: undefined },
      line2: { type: String, default: undefined },
      city: { type: String, default: undefined },
      state: { type: String, default: undefined },
      postalCode: { type: String, default: undefined },
      country: { type: String, default: undefined },
    },
    pricing: {
      subtotal: { type: Number, required: true, default: 0 },
      shipping: { type: Number, required: true, default: 0 },
      tax: { type: Number, required: true, default: 0 },
      total: { type: Number, required: true, default: 0 },
      currency: { type: String, required: true, default: "usd" },
    },
    items: {
      type: [orderItemSchema],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export type OrderItemCustomization = InferSchemaType<typeof orderItemCustomizationSchema>;
export type OrderItem = InferSchemaType<typeof orderItemSchema>;
export type OrderDocument = HydratedDocument<InferSchemaType<typeof orderSchema>>;

export const Order =
  mongoose.models.Order || mongoose.model("Order", orderSchema);
