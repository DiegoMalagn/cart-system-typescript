import { useState } from "react";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { formatCurrency } from "../utilities/formatCurrency";

type StoreItemProps = {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  sizes: string[];
};

export function StoreItem({
  id,
  name,
  description,
  price,
  imageUrl,
  sizes,
}: StoreItemProps) {
  const { getItemQuantity, increaseCartQuantity, decreaseCartQuantity, removeFromCart } =
    useShoppingCart();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const quantity = selectedSize ? getItemQuantity(id, selectedSize) : 0;

  return (
    <Card className="h-100 shadow-sm border-0 product-card">
      {/* Product image linking to product page */}
      <Link to={`/product/${id}`} style={{ textDecoration: "none", color: "inherit" }}>
        <div className="image-container">
          <Card.Img
            variant="top"
            src={imageUrl}
            height="200px"
            style={{ objectFit: "cover", width: "100%" }}
            className="product-image"
          />
        </div>
      </Link>

      <Card.Body className="d-flex flex-column">
        <Card.Title className="d-flex justify-content-between align-items-baseline mb-2">
          <span className="fs-5">{name}</span>
          <span className="ms-2 text-primary" style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
            {formatCurrency(price)}
          </span>
        </Card.Title>

        <Card.Subtitle className="mb-2 text-secondary" style={{ fontSize: "0.8rem", fontStyle: "italic" }}>
          {description}
        </Card.Subtitle>

        {/* Size selection */}
        <div className="mb-2">
          {sizes.map((size) => (
            <Button
              key={size}
              variant={selectedSize === size ? "primary" : "outline-primary"}
              size="sm"
              className="me-1 mb-1"
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </Button>
          ))}
        </div>

        <div className="mt-auto">
          {/* Add to cart / quantity controls */}
          {!selectedSize ? (
            <Button className="w-100 shadow" variant="secondary" disabled>
              Select a size
            </Button>
          ) : quantity === 0 ? (
            <Button className="w-100 shadow" variant="success" onClick={() => increaseCartQuantity(id, selectedSize)}>
              + Add to Cart
            </Button>
          ) : (
            <div className="d-flex align-items-center flex-column" style={{ gap: "0.5rem" }}>
              <div className="d-flex align-items-center justify-content-center" style={{ gap: "0.5rem" }}>
                <Button variant="danger" onClick={() => decreaseCartQuantity(id, selectedSize)}>
                  -
                </Button>
                <span>{quantity} in Cart</span>
                <Button variant="success" onClick={() => increaseCartQuantity(id, selectedSize)}>
                  +
                </Button>
              </div>
              <Button className="w-100 shadow" variant="danger" onClick={() => removeFromCart(id, selectedSize)}>
                Remove
              </Button>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}