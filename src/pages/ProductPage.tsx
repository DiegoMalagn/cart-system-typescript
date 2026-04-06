import { useParams } from "react-router-dom";
import items from "../data/items.json";

export function ProductPage() {
  const { id } = useParams();

  const product = items.find((item) => item.id === Number(id));

  if (!product) return <h2>Product not found</h2>;

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
        
        <img
          src={product.imageUrl}
          alt={product.name}
          style={{ width: "100%", borderRadius: "16px" }}
        />

        <div>
          <h1>{product.name}</h1>
          <h3>${product.price}</h3>

          <p style={{ marginTop: "20px" }}>{product.description}</p>

          <div style={{ marginTop: "20px" }}>
            <h4>Sizes</h4>

            <div style={{ display: "flex", gap: "10px" }}>
              {product.sizes.map((size) => (
                <button key={size} className="size-btn">
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button className="add-to-cart">
            Add to Cart
          </button>
        </div>

      </div>
    </div>
  );
}