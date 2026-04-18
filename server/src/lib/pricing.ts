export type CartItemCustomizationInput = {
  productType: string;
  color?: string;
  size?: string;
  genderFit?: string;
  material?: string;
  design: {
    id: string;
    label: string;
    sourceType: "preset" | "upload";
    imageUrl: string;
  };
  transform: {
    x: number;
    y: number;
    scale: number;
    rotationDeg: number;
  };
};

export type QuoteRequestItem = {
  id: number;
  size?: string;
  quantity?: number;
  productType?: string;
  genderFit?: string;
  customization?: CartItemCustomizationInput;
};

export type QuoteEstimateAddress = {
  country?: string;
  state?: string;
  postalCode?: string;
};

export type QuoteRequest = {
  items: QuoteRequestItem[];
  estimateAddress?: QuoteEstimateAddress;
};

export type NormalizedQuoteItem = {
  id: number;
  productType: string;
  displayName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  size?: string;
  genderFit?: string;
  color?: string;
  material?: string;
  imageUrl?: string;
  customization?: CartItemCustomizationInput;
};

export type PricingSummary = {
  subtotal: number;
  shipping: number;
  estimatedTax: number | null;
  estimatedTotal: number;
  currency: "USD";
  taxStatus: "estimated" | "calculated_at_checkout";
};

export type CartQuoteResponse = PricingSummary & {
  items: NormalizedQuoteItem[];
  freeShippingEligible: boolean;
  amountUntilFreeShipping: number;
  appliedDiscounts: string[];
  notes: string[];
};

type StandardCatalogItem = {
  id: number;
  productType: string;
  displayName: string;
  unitPrice: number;
  imageUrl: string;
  sizes: string[];
};

const STANDARD_CATALOG: Record<number, StandardCatalogItem> = {
  1: {
    id: 1,
    productType: "classic-black-tee",
    displayName: "Classic Black Tee",
    unitPrice: 2500,
    imageUrl: "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=500",
    sizes: ["S", "M", "L", "XL"],
  },
  2: {
    id: 2,
    productType: "oversized-street-tee",
    displayName: "Oversized Street Tee",
    unitPrice: 3500,
    imageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500",
    sizes: ["M", "L", "XL"],
  },
  4: {
    id: 4,
    productType: "graphic-print-tee",
    displayName: "Graphic Print Tee",
    unitPrice: 3200,
    imageUrl: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500",
    sizes: ["S", "M", "L", "XL"],
  },
};

const CUSTOM_PRODUCT_DISPLAY: Record<string, { displayName: string; imageUrl: string }> = {
  tshirt: {
    displayName: "T-shirt",
    imageUrl: "https://placehold.co/800x800/f8f5ef/1d1d1d?text=Stampable+T-shirt",
  },
  hoodie: {
    displayName: "Hoodie",
    imageUrl: "https://placehold.co/800x800/ebe7df/1d1d1d?text=Stampable+Hoodie",
  },
  sweater: {
    displayName: "Sweater",
    imageUrl: "https://placehold.co/800x800/e9efe8/1d1d1d?text=Stampable+Sweater",
  },
  glasscup: {
    displayName: "Glass cup",
    imageUrl: "https://placehold.co/800x800/f1f4f6/1d1d1d?text=Stampable+Glass+Cup",
  },
  hat: {
    displayName: "Hat",
    imageUrl: "https://placehold.co/800x800/f5efe6/1d1d1d?text=Stampable+Hat",
  },
  apron: {
    displayName: "Apron",
    imageUrl: "https://placehold.co/800x800/f0ebe3/1d1d1d?text=Stampable+Apron",
  },
  totebag: {
    displayName: "Tote bag",
    imageUrl: "https://placehold.co/800x800/eee9de/1d1d1d?text=Stampable+Tote+Bag",
  },
};

const APPAREL_PRICING: Record<string, { default: number; XXL: number; XXXL: number }> = {
  tshirt: { default: 1700, XXL: 2000, XXXL: 2200 },
  sweater: { default: 2500, XXL: 3000, XXXL: 3500 },
  hoodie: { default: 2800, XXL: 3400, XXXL: 4000 },
};

const FIXED_PRODUCT_PRICING: Record<string, number> = {
  totebag: 1500,
  apron: 1800,
  glasscup: 1800,
  hat: 2500,
};

const FREE_SHIPPING_THRESHOLD = 7500;
const FLAT_SHIPPING_RATE = 800;

function getCustomUnitPrice(productType: string, size?: string) {
  if (productType in APPAREL_PRICING) {
    const table = APPAREL_PRICING[productType];
    if (size === "XXL") return table.XXL;
    if (size === "XXXL") return table.XXXL;
    return table.default;
  }

  return FIXED_PRODUCT_PRICING[productType];
}

function normalizePositiveQuantity(quantity?: number) {
  if (!quantity || quantity < 1) return 1;
  return Math.floor(quantity);
}

function buildShippingSummary(subtotal: number) {
  const freeShippingEligible = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = freeShippingEligible ? 0 : FLAT_SHIPPING_RATE;

  return {
    shipping,
    freeShippingEligible,
    amountUntilFreeShipping: freeShippingEligible
      ? 0
      : Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0),
  };
}

function normalizeStandardItem(item: QuoteRequestItem): NormalizedQuoteItem {
  const product = STANDARD_CATALOG[item.id];

  if (!product) {
    throw new Error(`Unsupported standard product id: ${item.id}`);
  }

  const quantity = normalizePositiveQuantity(item.quantity);
  const size = item.size;

  if (size && !product.sizes.includes(size)) {
    throw new Error(`Invalid size "${size}" for ${product.displayName}`);
  }

  return {
    id: item.id,
    productType: product.productType,
    displayName: product.displayName,
    quantity,
    unitPrice: product.unitPrice,
    lineTotal: product.unitPrice * quantity,
    size,
    imageUrl: product.imageUrl,
  };
}

function normalizeCustomItem(item: QuoteRequestItem): NormalizedQuoteItem {
  const customization = item.customization;
  const productType = customization?.productType ?? item.productType;

  if (!productType) {
    throw new Error("Missing productType for customizable item");
  }

  const product = CUSTOM_PRODUCT_DISPLAY[productType];

  if (!product) {
    throw new Error(`Unsupported customizable product type: ${productType}`);
  }

  const quantity = normalizePositiveQuantity(item.quantity);
  const size = customization?.size ?? item.size;
  const unitPrice = getCustomUnitPrice(productType, size);

  if (!unitPrice) {
    throw new Error(`Missing pricing rule for product type: ${productType}`);
  }

  return {
    id: item.id,
    productType,
    displayName: product.displayName,
    quantity,
    unitPrice,
    lineTotal: unitPrice * quantity,
    size,
    genderFit: customization?.genderFit ?? item.genderFit,
    color: customization?.color,
    material: customization?.material,
    imageUrl: product.imageUrl,
    customization,
  };
}

export function normalizeQuoteItems(items: QuoteRequestItem[]) {
  if (!items.length) {
    throw new Error("Cart is empty");
  }

  return items.map((item) =>
    item.customization?.productType || item.productType
      ? normalizeCustomItem(item)
      : normalizeStandardItem(item)
  );
}

export function buildCartQuote(input: QuoteRequest): CartQuoteResponse {
  const normalizedItems = normalizeQuoteItems(input.items);
  const subtotal = normalizedItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const shippingSummary = buildShippingSummary(subtotal);
  const notes = [
    "Tax is calculated in Stripe Checkout after the shipping address is entered.",
  ];

  if (input.estimateAddress?.country || input.estimateAddress?.state || input.estimateAddress?.postalCode) {
    notes.push("Address-based tax estimates are not final until Stripe Checkout.");
  }

  return {
    items: normalizedItems,
    subtotal,
    shipping: shippingSummary.shipping,
    estimatedTax: null,
    estimatedTotal: subtotal + shippingSummary.shipping,
    currency: "USD",
    taxStatus: "calculated_at_checkout",
    freeShippingEligible: shippingSummary.freeShippingEligible,
    amountUntilFreeShipping: shippingSummary.amountUntilFreeShipping,
    appliedDiscounts: [],
    notes,
  };
}

export function buildStripeShippingOption(quote: CartQuoteResponse) {
  return quote.shipping === 0
      ? {
        shipping_rate_data: {
          type: "fixed_amount" as const,
          fixed_amount: { amount: 0, currency: "usd" },
          display_name: "Free shipping",
        },
      }
    : {
        shipping_rate_data: {
          type: "fixed_amount" as const,
          fixed_amount: { amount: quote.shipping, currency: "usd" },
          display_name: "Standard shipping",
        },
      };
}
