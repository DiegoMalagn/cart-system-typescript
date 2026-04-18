import type { CartItem } from "../context/ShoppingCartContext";
import type { CartQuoteRequest, QuoteRequestItem } from "../types/quote";

export function serializeCartItemForQuote(item: CartItem): QuoteRequestItem {
  return {
    id: item.id,
    size: item.size,
    quantity: item.quantity,
    productType: item.customization?.productType,
    genderFit: item.customization?.genderFit,
    customization: item.customization,
  };
}

export function buildCartQuoteRequest(cartItems: CartItem[]): CartQuoteRequest {
  return {
    items: cartItems.map(serializeCartItemForQuote),
  };
}
