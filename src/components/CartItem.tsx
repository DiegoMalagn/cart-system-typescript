import { Button, Stack } from "react-bootstrap";
import { useShoppingCart } from "../context/ShoppingCartContext";
import storeItems from "../data/items.json";
import { formatCurrency } from "../utilities/formatCurrency";

type CartItemProps = {
  id: number;
  size: string;
  quantity: number;
};

export function CartItem({ id, size, quantity }: CartItemProps) {
  const {
    removeFromCart,
    decreaseCartQuantity,
    increaseCartQuantity,
  } = useShoppingCart();

  const item = storeItems.find((i) => i.id === id);
  if (!item) return null;

  return (
    <Stack
      direction="horizontal"
      gap={3}
      className="d-flex align-items-start p-2 border rounded shadow-lg bg-light"
      style={{ flexWrap: "wrap" }} // allow wrapping
    >
      <img
        src={item.imageUrl}
        alt={item.name}
        className="rounded"
        style={{ width: "100px", height: "75px", objectFit: "cover", flexShrink: 0 }}
      />

      <div
        className="me-auto"
        style={{
          flex: 1,
          minWidth: "0",
        }}
      >
        <div className="fw-semibold">
          {item.name} <span className="text-muted">({size})</span>
        </div>
        <div className="text-muted small">{formatCurrency(item.price)}</div>
      </div>

      <div className="d-flex align-items-center gap-2 flex-shrink-0">
        <Button
          variant="danger"
          size="sm"
          onClick={() => decreaseCartQuantity(id, size)}
        >
          -
        </Button>
        <span className="fw-semibold">{quantity}</span>
        <Button
          variant="success"
          size="sm"
          onClick={() => increaseCartQuantity(id, size)}
        >
          +
        </Button>
      </div>

      <div
        className="fw-semibold text-success ms-3 flex-shrink-0"
        style={{ minWidth: "70px", textAlign: "right" }}
      >
        {formatCurrency(item.price * quantity)}
      </div>

      <Button
        variant="danger"
        size="sm"
        onClick={() => removeFromCart(id, size)}
        className="ms-2 fw-semibold flex-shrink-0"
      >
        &times;
      </Button>
    </Stack>
  );
}