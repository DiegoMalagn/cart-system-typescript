import { Offcanvas, Stack, Button } from "react-bootstrap";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { CartItem } from "./CartItem";
import items from "../data/items.json";

type ShoppingCartProps = {
  isOpen: boolean;
};

export function ShoppingCart({ isOpen }: ShoppingCartProps) {
  const { closeCart, cartItems } = useShoppingCart();

    async function handleCheckout() {
  console.log("Checkout clicked");
  // Read API base URL from Vite env. Fallback to localhost for dev.
  const API_URL = (import.meta.env.VITE_API_URL as string) || "http://localhost:4000";

  const res = await fetch(`${API_URL.replace(/\/$/, "")}/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: cartItems.map(item => {
          const product = items.find(i => i.id === item.id);

          return {
            id: item.id,
            name: product?.name,
            price: product?.price,
            size: item.size,
            quantity: item.quantity,
          };
        }),
      }),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    }
  }

  return (
    <Offcanvas
      show={isOpen}
      onHide={closeCart}
      placement="end"
      style={{ width: "500px", maxWidth: "90%" }} // make it larger
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Shopping Cart</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
      <Stack gap={3}>
        {cartItems.length === 0 && <div>Your cart is empty</div>}
        {cartItems.map((item) => (
          <CartItem
            key={`${item.id}-${item.size}`}
            id={item.id}
            size={item.size}
            quantity={item.quantity}
          />
        ))}
      </Stack>

      {cartItems.length > 0 && (
        <Button
          className="mt-4 w-100"
          size="lg"
          onClick={handleCheckout}
        >
          Proceed to Checkout
        </Button>
      )}
    </Offcanvas.Body>
    </Offcanvas>
  );


}