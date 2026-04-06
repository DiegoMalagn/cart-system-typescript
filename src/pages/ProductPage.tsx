import { useParams } from "react-router-dom";
import { useState } from "react";
import items from "../data/items.json";
import { useShoppingCart } from "../context/ShoppingCartContext";

export function ProductPage() {
  const { id } = useParams();
  const product = items.find((item) => item.id === Number(id));

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { increaseCartQuantity, getItemQuantity } = useShoppingCart();

  if (!product) return <h2>Product not found</h2>;

  const quantity = selectedSize ? getItemQuantity(product.id, selectedSize) : 0;

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
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`size-btn ${selectedSize === size ? "selected" : ""}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button
            className="add-to-cart"
            disabled={!selectedSize}
            onClick={() => {
              if (!selectedSize) return;
              increaseCartQuantity(product.id, selectedSize);
            }}
          >
            {selectedSize ? "Add to Cart" : "Select a size"}
            {quantity > 0 && (
              <span className="added-badge">{quantity}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}