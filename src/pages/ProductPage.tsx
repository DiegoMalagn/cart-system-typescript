import { useState } from "react";
import { useParams } from "react-router-dom";
import items from "../data/items.json";
import { useShoppingCart } from "../context/ShoppingCartContext";

export function ProductPage() {
  const { id } = useParams();
  const product = items.find((item) => item.id === Number(id));
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { increaseCartQuantity } = useShoppingCart();

  if (!product) return <h2>Product not found</h2>;

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
        
        {/* Product image */}
        <img
          src={product.imageUrl}
          alt={product.name}
          style={{ width: "100%", borderRadius: "16px" }}
        />

        {/* Product info */}
        <div>
          <h1>{product.name}</h1>
          <h3>${product.price}</h3>
          <p style={{ marginTop: "20px" }}>{product.description}</p>

          {/* Size selection */}
          <div style={{ marginTop: "20px" }}>
            <h4>Sizes</h4>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`size-btn ${selectedSize === size ? "selected" : ""}`}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: selectedSize === size ? "2px solid #0d6efd" : "1px solid #ccc",
                    background: selectedSize === size ? "#0d6efd" : "white",
                    color: selectedSize === size ? "white" : "black",
                    cursor: "pointer",
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart button */}
          <button
            className="add-to-cart"
            disabled={!selectedSize}
            onClick={() => {
              if (!selectedSize) return;
              increaseCartQuantity(product.id, selectedSize);
            }}
            style={{
              marginTop: "20px",
              padding: "10px 16px",
              fontWeight: "bold",
              cursor: selectedSize ? "pointer" : "not-allowed",
              backgroundColor: selectedSize ? "#198754" : "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "6px",
            }}
          >
            {selectedSize ? "Add to Cart" : "Select a size"}
          </button>
        </div>
      </div>
    </div>
  );
}