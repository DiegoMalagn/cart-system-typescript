import { Offcanvas, Stack, Button } from "react-bootstrap";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { CartItem } from "./CartItem";

type ShoppingCartProps = {
  isOpen: boolean;
};

export function ShoppingCart({ isOpen }: ShoppingCartProps) {
  const { closeCart, cartItems } = useShoppingCart();

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
      </Offcanvas.Body>
    </Offcanvas>
  );
}