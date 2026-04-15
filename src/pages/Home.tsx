import { Col, Row } from "react-bootstrap";
import storeItems from "../data/items.json";
import { ProductCard } from "../components/ProductCard";
import { StoreItem } from "../components/StoreItem";
import { customProducts } from "../data/customProducts";

export function Home() {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0 fw-bold">Add Items to Cart</h1>
      </div>
      <section className="mb-5">
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
