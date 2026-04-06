import { Link } from "react-router-dom";

type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/product/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div className="product-card">

        <div className="image-container">
          <img src={product.imageUrl} alt={product.name} />
        </div>

        <h3>{product.name}</h3>
        <p>${product.price}</p>

      </div>
    </Link>
  );
}