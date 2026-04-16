import { Button, Stack } from "react-bootstrap";
import { type CartItem as CartItemType, useShoppingCart } from "../context/ShoppingCartContext";
import storeItems from "../data/items.json";
import { formatCurrency } from "../utilities/formatCurrency";
import { customProductMap } from "../data/customProducts";

type CartItemProps = {
  item: CartItemType;
};

export function CartItem({ item }: CartItemProps) {
  const {
    removeFromCart,
    decreaseCartQuantity,
    increaseCartQuantity,
  } = useShoppingCart();

  const product = item.customization
    ? customProductMap[item.customization.productType as keyof typeof customProductMap]
    : storeItems.find((storeItem) => storeItem.id === item.id);
  if (!product) return null;

  const customizationSummary = [
    item.customization?.color ? `Color: ${item.customization.color}` : null,
    item.customization?.size ? `Size: ${item.customization.size}` : null,
    `Design: ${item.customization?.design.label ?? "Standard"}`,
    item.customization?.material ? `Material: ${item.customization.material}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Stack
      direction="horizontal"
      gap={3}
      className="d-flex align-items-start p-2 border rounded shadow-lg bg-light"
      style={{ flexWrap: "wrap" }} // allow wrapping
    >
      <img
        src={product.imageUrl}
        alt={product.name}
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
          {product.name} {item.size ? <span className="text-muted">({item.size})</span> : null}
        </div>
        <div className="text-muted small">{formatCurrency(product.price)}</div>
        {item.customization ? (
          <div className="d-flex align-items-center gap-2 mt-2">
            {item.customization.design.sourceType === "upload" ? (
              <img
                src={item.customization.design.imageUrl}
                alt={item.customization.design.label}
                className="rounded border"
                style={{ width: "40px", height: "40px", objectFit: "contain", backgroundColor: "#fff" }}
              />
            ) : null}
            <div className="text-muted small">{customizationSummary}</div>
          </div>
        ) : null}
      </div>

      <div className="d-flex align-items-center gap-2 flex-shrink-0">
        <Button
          variant="danger"
          size="sm"
          onClick={() => decreaseCartQuantity(item.id, item.size, item.customization)}
        >
          -
        </Button>
        <span className="fw-semibold">{item.quantity}</span>
        <Button
          variant="success"
          size="sm"
          onClick={() => increaseCartQuantity(item.id, item.size, item.customization)}
        >
          +
        </Button>
      </div>

      <div
        className="fw-semibold text-success ms-3 flex-shrink-0"
        style={{ minWidth: "70px", textAlign: "right" }}
      >
        {formatCurrency(product.price * item.quantity)}
      </div>

      <Button
        variant="danger"
        size="sm"
        onClick={() => removeFromCart(item.id, item.size, item.customization)}
        className="ms-2 fw-semibold flex-shrink-0"
      >
        &times;
      </Button>
    </Stack>
  );
}
