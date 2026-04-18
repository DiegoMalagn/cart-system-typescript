import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import storeItems from "../data/items.json";
import { StoreItem } from "../components/StoreItem";
import { customProducts } from "../data/customProducts";
import logo from "../assets/logo.png";
import imgTshirt from "../assets/stock/tshirtlogo.png";
import imgHoodie from "../assets/stock/hoodielogo.png";
import imgSweatshirt from "../assets/stock/sweatshirtlogo.png";
import imgGlassCup from "../assets/stock/frostedglasscuplogo.png";
import imgHat from "../assets/stock/caplogo.png";
import imgApron from "../assets/stock/apronlogo.png";
import imgTotebag from "../assets/stock/linenbagwithlogo.png";

const slides = [
  {
    url: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=1600&q=80",
    alt: "Person wearing a custom t-shirt",
    position: "center 30%",
  },
  {
    url: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=1600&q=80",
    alt: "Model in hoodie",
    position: "center center",
  },
  {
    url: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=1600&q=80",
    alt: "Streetwear apparel close up",
    position: "center 20%",
  },
  {
    url: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1600&q=80",
    alt: "Custom printed apparel flat lay",
    position: "center center",
  },
  {
    url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80",
    alt: "Person in branded streetwear",
    position: "center 25%",
  },
];

const accordionImages: Record<string, string> = {
  tshirt: imgTshirt,
  hoodie: imgHoodie,
  sweater: imgSweatshirt,
  glasscup: imgGlassCup,
  hat: imgHat,
  apron: imgApron,
  totebag: imgTotebag,
};

export function Home() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(customProducts[0]?.slug ?? null);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, []);

  const handleAccordionClick = (slug: string) => {
    if (expandedSlug === slug) {
      navigate(`/customize/${slug}`);
      return;
    }

    setExpandedSlug(slug);
  };

  return (
    <>
      <div
        style={{
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)",
          position: "relative",
        }}
      >
        <section className="hero-section">
          {slides.map((slide, index) => (
            <div
              key={slide.url}
              aria-hidden={index !== currentSlide}
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${slide.url})`,
                backgroundSize: "cover",
                backgroundPosition: slide.position,
                opacity: index === currentSlide ? 1 : 0,
                transition: "opacity 1s ease",
              }}
            />
          ))}

          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(20, 10, 8, 0.18) 0%, rgba(136, 76, 66, 0.38) 60%, rgba(136, 76, 66, 0.72) 100%)",
              zIndex: 1,
            }}
          />

          <div
            className="text-center px-3"
            style={{
              position: "relative",
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={logo}
              alt="Stamp Lab Prints"
              style={{
                height: "80px",
                width: "auto",
                filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))",
              }}
            />
            <h1
              className="mt-4 mb-3 text-white fw-bold"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
            >
              Your design. Your style. Stamped.
            </h1>
            <p
              className="mb-4"
              style={{ color: "var(--slp-sand)", fontSize: "clamp(1rem, 2vw, 1.25rem)" }}
            >
              Custom DTF transfers on shirts, hoodies, hats, and more.
            </p>
            <a
              href="#products"
              className="btn px-4 py-3 fw-semibold"
              style={{
                background: "var(--slp-peach)",
                color: "#fff",
                padding: "0.75rem 2.5rem",
                borderRadius: "999px",
                border: "none",
                transition: "background 0.2s ease",
              }}
            >
              Shop Now
            </a>
          </div>

          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: "24px",
              transform: "translateX(-50%)",
              zIndex: 2,
              display: "flex",
              gap: "0.6rem",
            }}
          >
            {slides.map((slide, index) => (
              <button
                key={slide.alt}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => setCurrentSlide(index)}
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "999px",
                  border: "none",
                  backgroundColor:
                    index === currentSlide ? "var(--slp-peach)" : "rgba(255,255,255,0.5)",
                }}
              />
            ))}
          </div>
        </section>
      </div>

      <section className="my-5" id="products">
        <div className="text-center mb-4">
          <h2 className="mb-0 fw-bold" style={{ color: "var(--slp-clay)" }}>
            Ready to Buy
          </h2>
          <div
            style={{
              width: "48px",
              height: "2px",
              margin: "8px auto 24px",
              backgroundColor: "var(--slp-sand)",
            }}
          />
        </div>

        <Row md={2} xs={1} lg={3} className="g-3">
          {storeItems.map((item) => (
            <Col key={item.id}>
              <StoreItem {...item} />
            </Col>
          ))}
        </Row>
      </section>

      <section className="my-5">
        <div className="text-center mb-4">
          <h2 className="mb-0 fw-bold" style={{ color: "var(--slp-clay)" }}>
            Make It Yours
          </h2>
          <div
            style={{
              width: "48px",
              height: "2px",
              margin: "8px auto 24px",
              backgroundColor: "var(--slp-sand)",
            }}
          />
        </div>

        <div className="accordion-card-row">
          {customProducts.map((product) => {
            const isExpanded = expandedSlug === product.slug;

            return (
              <button
                key={product.slug}
                type="button"
                className={`accordion-card ${isExpanded ? "expanded" : expandedSlug ? "collapsed" : ""}`}
                style={{
                  backgroundImage: `url(${accordionImages[product.slug]})`,
                  textAlign: "left",
                  border: "none",
                  padding: 0,
                }}
                onMouseEnter={() => setExpandedSlug(product.slug)}
                onMouseLeave={() => setExpandedSlug(null)}
                onClick={() => handleAccordionClick(product.slug)}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to bottom, rgba(20,10,8,0.05) 0%, rgba(20,10,8,0.75) 100%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: "auto 0 0 0",
                    padding: "1rem",
                    zIndex: 1,
                  }}
                >
                  <div
                    className="accordion-card-label"
                    style={{
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "1rem",
                      transform: isExpanded ? "rotate(0deg)" : "rotate(-90deg)",
                      transformOrigin: isExpanded ? "left bottom" : "left bottom",
                      whiteSpace: "nowrap",
                      marginBottom: isExpanded ? "0.75rem" : 0,
                    }}
                  >
                    {product.name}
                  </div>
                  <button
                    type="button"
                    className="accordion-card-cta"
                    onClick={(event) => {
                      event.stopPropagation();
                      navigate(`/customize/${product.slug}`);
                    }}
                    style={{
                      background: "var(--slp-peach)",
                      color: "#fff",
                      borderRadius: "999px",
                      padding: "0.4rem 1.2rem",
                      fontSize: "0.85rem",
                      border: "none",
                    }}
                  >
                    Customize →
                  </button>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </>
  );
}
