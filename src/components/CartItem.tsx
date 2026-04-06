import { Button, Stack } from "react-bootstrap";
import { useShoppingCart } from "../context/ShoppingCartContext";
import storeItems from "../data/items.json";
import { formatCurrency } from "../utilities/formatCurrency";

type CartItemProps = {
  id: number;
  quantity: number;
  size: string;
};

export function CartItem({ id, size, quantity }: CartItemProps) {
  const { removeFromCart } = useShoppingCart();
  const item = storeItems.find((i) => i.id === id);
  if (!item) return null;

  return (
    <Stack direction="horizontal" gap={3} className="d-flex align-items-center p-2 border rounded shadow-lg bg-light">
      <img src={item.imageUrl} alt={item.name} className="rounded" style={{ width: "100px", height: "75px", objectFit: "cover" }} />
      <div className="me-auto">
        <div className="fw-semibold">{item.name} ({size}) {quantity > 1 && <span className="text-primary">x{quantity}</span>}</div>
        <div className="text-muted small">{formatCurrency(item.price)}</div>
      </div>
      <div className="fw-semibold text-success">{formatCurrency(item.price * quantity)}</div>
      <Button variant="danger" size="sm" onClick={() => removeFromCart(item.id, size)} className="ms-2 fw-semibold">&times;</Button>
    </Stack>
  );
}
