import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

export type ProductCardProduct = {
  id?: number;
  name: string;
  price?: number;
  imageUrl: string;
  tagline?: string;
  href?: string;
  ctaLabel?: string;
};

export function ProductCard({ product }: { product: ProductCardProduct }) {
  const href = product.href ?? (product.id ? `/product/${product.id}` : "#");
  const ctaLabel = product.ctaLabel ?? (product.id ? "View Product" : "Customize");

  return (
    <Card className="h-100 shadow-sm border-0 product-card">
      <div className="image-container">
        <Card.Img
          variant="top"
          src={product.imageUrl}
          alt={product.name}
          height="240"
          style={{ objectFit: "cover", width: "100%" }}
          className="product-image"
        />
      </div>

      <Card.Body className="d-flex flex-column">
        <Card.Title className="fs-5">{product.name}</Card.Title>

        {product.tagline ? (
          <Card.Text className="text-secondary small">{product.tagline}</Card.Text>
        ) : null}

        {typeof product.price === "number" ? (
          <Card.Text className="fw-semibold mb-3">${product.price}</Card.Text>
        ) : null}

        <Link to={href} className="btn btn-dark mt-auto">
          {ctaLabel}
        </Link>
      </Card.Body>
    </Card>
  );
}
