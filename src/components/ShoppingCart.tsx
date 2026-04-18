import { Offcanvas, Stack, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { CartItem } from "./CartItem";

type ShoppingCartProps = {
  isOpen: boolean;
};

export function ShoppingCart({ isOpen }: ShoppingCartProps) {
  const { closeCart, cartItems } = useShoppingCart();
  const navigate = useNavigate();

  function handleReviewOrder() {
    closeCart();
    navigate("/checkout/review");
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
            key={`${item.id}-${item.size}-${item.customization ? JSON.stringify(item.customization) : "base-item"}`}
            item={item}
          />
        ))}
      </Stack>

      {cartItems.length > 0 && (
        <>
          <div className="mt-4 small text-secondary">
            Review size, fit, and design details before checkout.
          </div>
          <Button
            className="mt-2 w-100"
            size="lg"
            onClick={handleReviewOrder}
          >
            Review Order
          </Button>
        </>
      )}
    </Offcanvas.Body>
    </Offcanvas>
  );


}
