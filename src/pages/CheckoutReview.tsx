import { useEffect, useMemo, useState } from "react";
import { Alert, Button, Card, Col, Row, Spinner, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { CartItem } from "../components/CartItem";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { buildCartQuoteRequest } from "../utilities/cartPayload";
import { formatCurrency } from "../utilities/formatCurrency";
import type { CartQuoteResponse } from "../types/quote";
import storeItems from "../data/items.json";

const SIZE_PRICES: Record<string, number> = {
  S: 17.0,
  M: 17.0,
  L: 17.0,
  XL: 17.0,
  XXL: 20.0,
  XXXL: 22.0,
};

function formatCents(amount: number) {
  return formatCurrency(amount / 100);
}

function getApiUrl(path: string) {
  const apiBase = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "");
  return apiBase ? `${apiBase}${path}` : path;
}

export function CheckoutReview() {
  const { cartItems, decreaseCartQuantity, increaseCartQuantity, removeFromCart } = useShoppingCart();
  const [quote, setQuote] = useState<CartQuoteResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resolvedItems = useMemo(
    () =>
      cartItems.map((item) => {
        const sourceProduct = storeItems.find((product) => product.id === item.id);
        let price: number;

        if (item.customization?.productType) {
          price = item.customization.size
            ? (SIZE_PRICES[item.customization.size] ?? 17.0)
            : 17.0;
        } else if (sourceProduct) {
          price = sourceProduct.price;
        } else {
          price = item.price ?? 17.0;
        }

        return { ...item, price };
      }),
    [cartItems]
  );

  const quoteRequest = useMemo(() => buildCartQuoteRequest(resolvedItems), [resolvedItems]);

  useEffect(() => {
    if (cartItems.length === 0) {
      setQuote(null);
      setErrorMessage(null);
      return;
    }

    let cancelled = false;

    async function fetchQuote() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await fetch(getApiUrl("/api/cart/quote"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(quoteRequest),
        });

        const data = (await response.json().catch(() => ({}))) as
          | CartQuoteResponse
          | { error?: string };

        if (!response.ok) {
          throw new Error(
            "error" in data && data.error ? data.error : "Unable to load cart quote"
          );
        }

        if (!cancelled) {
          setQuote(data as CartQuoteResponse);
        }
      } catch (error) {
        if (!cancelled) {
          setQuote(null);
          setErrorMessage(
            error instanceof Error ? error.message : "Unable to load cart quote"
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void fetchQuote();

    return () => {
      cancelled = true;
    };
  }, [cartItems.length, quoteRequest]);

  async function handleProceedToStripe() {
    if (cartItems.length === 0) return;

    setIsRedirecting(true);
    setErrorMessage(null);

    try {
      const response = await fetch(getApiUrl("/checkout"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quoteRequest),
      });

      const data = (await response.json().catch(() => ({}))) as {
        url?: string;
        error?: string;
      };

      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Unable to start Stripe Checkout");
      }

      window.location.href = data.url;
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to start Stripe Checkout"
      );
      setIsRedirecting(false);
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="py-4">
        <Card className="shadow-sm">
          <Card.Body className="text-center py-5">
            <h1 className="h3 fw-bold mb-3" style={{ color: "var(--slp-clay)" }}>
              Your cart is empty
            </h1>
            <p className="text-secondary mb-4">
              Add a product or customize something before heading to checkout.
            </p>
            <Link to="/" className="btn btn-brand">
              Continue Shopping
            </Link>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="mb-4">
        <span className="eyebrow" style={{ color: "var(--slp-clay)" }}>
          Review Order
        </span>
        <h1 className="fw-bold mb-2" style={{ color: "var(--slp-clay)" }}>
          Check your items before payment
        </h1>
        <div style={{ width: "48px", height: "2px", backgroundColor: "var(--slp-sand)" }} />
        <p className="text-secondary mt-3 mb-0">
          This page uses server-side pricing. Tax and final shipping address are confirmed in Stripe Checkout.
        </p>
      </div>

      <Row className="g-4 align-items-start">
        <Col lg={8}>
          <Stack gap={3}>
            {cartItems.map((item) => (
              <Card key={`${item.id}-${item.size}-${item.customization ? JSON.stringify(item.customization) : "base-item"}`} className="shadow-sm">
                <Card.Body>
                  <CartItem item={item} />
                  <div className="d-flex gap-2 mt-3 flex-wrap">
                    <Button
                      size="sm"
                      variant="outline-dark"
                      onClick={() => decreaseCartQuantity(item.id, item.size, item.customization)}
                    >
                      Decrease
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-dark"
                      onClick={() => increaseCartQuantity(item.id, item.size, item.customization)}
                    >
                      Increase
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => removeFromCart(item.id, item.size, item.customization)}
                    >
                      Remove
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </Stack>
        </Col>

        <Col lg={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <h2 className="h5 fw-bold mb-3" style={{ color: "var(--slp-clay)" }}>
                Order Summary
              </h2>

              {isLoading ? (
                <div className="d-flex align-items-center gap-2 text-secondary">
                  <Spinner size="sm" animation="border" />
                  Updating quote...
                </div>
              ) : null}

              {errorMessage ? (
                <Alert variant="danger" className="py-2">
                  {errorMessage}
                </Alert>
              ) : null}

              {quote ? (
                <>
                  <Stack gap={2} className="small mb-3">
                    {quote.items.map((item, index) => (
                      <div key={`${item.productType}-${index}`} className="d-flex justify-content-between gap-3">
                        <div>
                          <div className="fw-semibold">{item.displayName}</div>
                          <div className="text-secondary">
                            {item.quantity} × {formatCents(item.unitPrice)}
                            {item.size ? ` · ${item.size}` : ""}
                            {item.genderFit ? ` · ${item.genderFit}` : ""}
                            {item.color ? ` · ${item.color}` : ""}
                            {item.material ? ` · ${item.material}` : ""}
                          </div>
                          {item.customization ? (
                            <div className="text-secondary">
                              Design: {item.customization.design.label} ({item.customization.design.sourceType})
                            </div>
                          ) : null}
                        </div>
                        <div className="fw-semibold">{formatCents(item.lineTotal)}</div>
                      </div>
                    ))}
                  </Stack>

                  <div className="border-top pt-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotal</span>
                      <span>{formatCents(quote.subtotal)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Estimated shipping</span>
                      <span>{formatCents(quote.shipping)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Tax</span>
                      <span>
                        {quote.estimatedTax === null
                          ? "Calculated at checkout"
                          : formatCents(quote.estimatedTax)}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between fw-bold fs-5 pt-2 border-top mt-2">
                      <span>
                        {quote.estimatedTax === null ? "Estimated total before tax" : "Estimated total"}
                      </span>
                      <span>{formatCents(quote.estimatedTotal)}</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    {quote.freeShippingEligible ? (
                      <Alert variant="success" className="py-2 mb-2">
                        You qualify for free shipping.
                      </Alert>
                    ) : (
                      <Alert variant="info" className="py-2 mb-2">
                        Add {formatCents(quote.amountUntilFreeShipping)} more for free shipping.
                      </Alert>
                    )}

                    {quote.appliedDiscounts.map((discount) => (
                      <div key={discount} className="small text-success mb-1">
                        Discount applied: {discount}
                      </div>
                    ))}

                    {quote.notes.map((note) => (
                      <div key={note} className="small text-secondary mb-1">
                        {note}
                      </div>
                    ))}
                  </div>
                </>
              ) : null}

              <Button
                className="btn-brand w-100 mt-4"
                onClick={handleProceedToStripe}
                disabled={!quote || isLoading || isRedirecting}
              >
                {isRedirecting ? (
                  <>
                    <Spinner size="sm" animation="border" className="me-2" />
                    Redirecting...
                  </>
                ) : (
                  "Continue to Stripe Checkout"
                )}
              </Button>

              <p className="small text-secondary mt-3 mb-0">
                Stripe Checkout collects the final shipping address, applies Stripe Tax, and shows the final amount before payment.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
