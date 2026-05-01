import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { customProducts } from "../data/customProducts";
import imgTshirt from "../assets/stock/slpTshirtExample.png";
import imgHoodie from "../assets/stock/slpHoodieExample.png";
import imgSweatshirt from "../assets/stock/slpSweatshirtExample.png";
import imgGlassCup from "../assets/stock/slpCupSipping.png";
import imgTumbler from "../assets/stock/slpTumblerExample.png";
import imgHat from "../assets/stock/slpHatpink.png";
import imgApron from "../assets/stock/slpApronOutside.png";
import imgTotebag from "../assets/stock/womanToteBag.png";
import heroHome from "../assets/store/heroHome.png";

const hasTumblerProduct = customProducts.some(
  (product) => String(product.slug) === "tumbler"
);

const accordionCardConfig: Record<
  string,
  {
    backgroundImage: string;
    backgroundPosition?: string;
  }
> = {
  tshirt: {
    backgroundImage: `url(${imgTshirt})`,
    backgroundPosition: "center center",
  },
  hoodie: {
    backgroundImage: `url(${imgHoodie})`,
    backgroundPosition: "center center",
  },
  sweater: {
    backgroundImage: `url(${imgSweatshirt})`,
    backgroundPosition: "center center",
  },
  glasscup: {
    // TODO: add tumbler as a separate product slug when ready
    backgroundImage: `url(${hasTumblerProduct ? imgGlassCup : imgTumbler})`,
    backgroundPosition: "center center",
  },
  hat: {
    backgroundImage: `url(${imgHat})`,
    backgroundPosition: "center center",
  },
  apron: {
    backgroundImage: `url(${imgApron})`,
    backgroundPosition: "center center",
  },
  totebag: {
    backgroundImage: `url(${imgTotebag})`,
    backgroundPosition: "center center",
  },
};

export function Home() {
  const navigate = useNavigate();
  const [expandedSlug, setExpandedSlug] = useState<string | null>(customProducts[0]?.slug ?? null);

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
        <div
          className="hero-section"
          style={{
            backgroundImage: `url(${heroHome})`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(20, 10, 8, 0.05) 0%, rgba(20, 10, 8, 0.15) 40%, rgba(136, 76, 66, 0.55) 70%, rgba(136, 76, 66, 0.85) 100%)",
              zIndex: 1,
            }}
          />

          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "2.5rem 2rem",
              zIndex: 2,
              textAlign: "center",
            }}
          >
            <h1
              className="mb-3 text-white fw-bold"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
            >
              Your design. Your style. Stamped.
            </h1>
            <p
              className="mb-0"
              style={{ color: "var(--slp-sand)", fontSize: "clamp(1rem, 2vw, 1.25rem)" }}
            >
              Custom DTF transfers on shirts, hoodies, hats, and more.
            </p>
          </div>
        </div>
      </div>

      <section className="my-5" id="products">
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
            const cardConfig = accordionCardConfig[product.slug];

            return (
              <button
                key={product.slug}
                type="button"
                className={`accordion-card ${isExpanded ? "expanded" : expandedSlug ? "collapsed" : ""}`}
                style={{
                  backgroundImage: cardConfig?.backgroundImage,
                  backgroundPosition: cardConfig?.backgroundPosition ?? "center center",
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
