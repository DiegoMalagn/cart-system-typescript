import { Col, Row } from "react-bootstrap";
import storeItems from "../data/items.json";
import { ProductCard } from "../components/ProductCard";
import { StoreItem } from "../components/StoreItem";
import { customProducts } from "../data/customProducts";
import logo from "../assets/logo.png";

export function Home() {
  return (
    <>
      <section
        className="mb-5 text-center"
        style={{ backgroundColor: "var(--slp-clay)", padding: "4rem 1rem" }}
      >
        <img src={logo} alt="Stamp Lab Prints" style={{ height: "90px", width: "auto" }} />
        <h1 className="fw-bold text-white mt-4 mb-3" style={{ fontSize: "2rem" }}>
          Your design. Your style. Stamped.
        </h1>
        <p className="mb-4" style={{ color: "var(--slp-sand)", fontSize: "1.1rem" }}>
          Custom DTF transfers on shirts, hoodies, hats, and more.
        </p>
        <a href="#products" className="btn slp-shop-now-btn px-4 py-2 fw-semibold">
          Shop Now
        </a>
      </section>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0 fw-bold">Add Items to Cart</h1>
      </div>
      <section className="mb-5" id="products">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="mb-1 fw-bold">Customize a Stampable Product</h2>
            <p className="text-secondary mb-0">
              Choose a base product and build a quick mockup before ordering.
            </p>
          </div>
        </div>

        <Row className="g-3">
          {customProducts.map((product) => (
            <Col key={product.slug} xs={6} md={4} lg={3}>
              <ProductCard
                product={{
                  name: product.name,
                  imageUrl: product.imageUrl,
                  tagline: product.tagline,
                  href: `/customize/${product.slug}`,
                  ctaLabel: "Customize",
                }}
              />
            </Col>
          ))}
        </Row>
      </section>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 fw-bold">Shop Ready-to-Buy Items</h2>
      </div>
      <Row md={2} xs={1} lg={3} className="g-3 text-white">
        {storeItems.map(item => (
            <Col key={item.id}>< StoreItem {...item}/></Col>
        ))}
      </Row>{" "}
    </>
  );
}
