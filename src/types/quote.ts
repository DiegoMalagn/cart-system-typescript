import type { CartItemCustomization } from "../context/ShoppingCartContext";

export type QuoteRequestItem = {
  id: number;
  size?: string;
  quantity: number;
  productType?: string;
  genderFit?: string;
  customization?: CartItemCustomization;
};

export type CartQuoteRequest = {
  items: QuoteRequestItem[];
  estimateAddress?: {
    country?: string;
    state?: string;
    postalCode?: string;
  };
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
  customization?: CartItemCustomization;
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
