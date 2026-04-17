import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BsBoxSeam, BsPatchCheckFill, BsSliders } from "react-icons/bs";

export function About() {
  return (
    <>
      <div
        style={{
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)",
          position: "relative",
          minHeight: "420px",
          backgroundImage:
            "url(https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1600&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(20, 10, 8, 0.35) 0%, rgba(136, 76, 66, 0.72) 100%)",
          }}
        />

        <div className="text-center px-3" style={{ position: "relative", zIndex: 2 }}>
          <span className="eyebrow" style={{ color: "var(--slp-sand)" }}>
            OUR STORY
          </span>
          <h1
            style={{
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              textAlign: "center",
              maxWidth: "700px",
              margin: "0.5rem auto",
            }}
          >
            Where Every Print Tells a Story
          </h1>
          <div
            style={{
              width: "56px",
              height: "3px",
              background: "var(--slp-peach)",
              margin: "1rem auto 0",
            }}
          />
        </div>
      </div>

      <Container>
        <section style={{ padding: "5rem 0" }}>
          <Row className="align-items-center g-5">
            <Col md={6}>
              <div style={{ position: "relative", height: "380px" }}>
                <img
                  src="https://images.unsplash.com/photo-1562157873-818bc0726f68?w=700&q=80"
                  alt="DTF printing process"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "78%",
                    height: "300px",
                    objectFit: "cover",
                    borderRadius: "16px",
                    boxShadow: "0 8px 32px rgba(136,76,66,0.18)",
                  }}
                />
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80"
                  alt="Custom printed shirt close up"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: "62%",
                    height: "240px",
                    objectFit: "cover",
                    borderRadius: "16px",
                    border: "4px solid var(--slp-cream)",
                    boxShadow: "0 8px 32px rgba(136,76,66,0.22)",
                  }}
                />
              </div>
            </Col>

            <Col md={6}>
              <span className="eyebrow" style={{ color: "var(--slp-clay)" }}>
                WHO WE ARE
              </span>
              <h2
                style={{
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: "var(--slp-clay)",
                  marginBottom: "1rem",
                }}
              >
                We&apos;re Stamp Lab Prints
              </h2>
              <p style={{ color: "#444", lineHeight: 1.8, fontSize: "1.05rem" }}>
                We&apos;re Stamp Lab Prints — a small, passionate print shop obsessed
                with bringing bold ideas to life through the art of DTF transfer
                printing. It started with a simple belief: your style should be
                yours. Not off a rack, not picked from a dropdown, but genuinely,
                unmistakably you. We built Stamp Lab Prints from the ground up to
                give creators, small businesses, and everyday people a way to put
                their mark on the things they wear and carry every day.
              </p>
              <Link to="/" className="btn btn-brand mt-3">
                Shop Now
              </Link>
            </Col>
          </Row>
        </section>
      </Container>

      <section style={{ background: "var(--slp-cream)", padding: "5rem 0" }}>
        <Container>
          <div className="text-center mb-5">
            <span className="eyebrow" style={{ color: "var(--slp-clay)" }}>
              WHAT WE DO
            </span>
            <h2
              style={{
                fontSize: "1.8rem",
                fontWeight: 700,
                color: "var(--slp-clay)",
              }}
            >
              DTF Printing Done Right
            </h2>
            <div
              style={{
                width: "48px",
                height: "3px",
                background: "var(--slp-peach)",
                margin: "0.75rem auto 3rem",
              }}
            />
          </div>

          <Row className="g-4">
            <Col md={4}>
              <div className="about-feature-card">
                <BsPatchCheckFill size="2rem" color="var(--slp-peach)" />
                <h3
                  style={{
                    fontWeight: 700,
                    color: "var(--slp-clay)",
                    margin: "1rem 0 0.5rem",
                    fontSize: "1.2rem",
                  }}
                >
                  Vibrant &amp; Durable
                </h3>
                <p style={{ color: "#666", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: 0 }}>
                  Full-color DTF transfers that stay bold wash after wash.
                  Crisp edges, soft feel, no cracking.
                </p>
              </div>
            </Col>
            <Col md={4}>
              <div className="about-feature-card">
                <BsSliders size="2rem" color="var(--slp-peach)" />
                <h3
                  style={{
                    fontWeight: 700,
                    color: "var(--slp-clay)",
                    margin: "1rem 0 0.5rem",
                    fontSize: "1.2rem",
                  }}
                >
                  Fully Custom
                </h3>
                <p style={{ color: "#666", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: 0 }}>
                  Upload your own design or choose from our stamp collection.
                  Every order is made exactly to your spec.
                </p>
              </div>
            </Col>
            <Col md={4}>
              <div className="about-feature-card">
                <BsBoxSeam size="2rem" color="var(--slp-peach)" />
                <h3
                  style={{
                    fontWeight: 700,
                    color: "var(--slp-clay)",
                    margin: "1rem 0 0.5rem",
                    fontSize: "1.2rem",
                  }}
                >
                  No Minimums
                </h3>
                <p style={{ color: "#666", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: 0 }}>
                  Order one piece or one hundred. We treat every single item
                  with the same care and attention.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Container>
        <section style={{ padding: "5rem 0" }}>
          <Row className="align-items-center g-5">
            <Col md={6}>
              <span className="eyebrow" style={{ color: "var(--slp-clay)" }}>
                OUR PROMISE
              </span>
              <h2
                style={{
                  fontSize: "1.8rem",
                  fontWeight: 700,
                  color: "var(--slp-clay)",
                }}
              >
                Quality Over Quantity
              </h2>
              <p style={{ color: "#444", lineHeight: 1.8 }}>
                Every order gets our full attention. We check every transfer,
                every placement, every finished product before it leaves our hands.
                Using Direct-to-Film transfer printing, we produce vibrant, durable
                designs with crisp edges and a soft feel — no minimums, no
                compromises, no faded prints after three washes.
              </p>
              <p style={{ color: "#666", lineHeight: 1.8, marginTop: "1rem" }}>
                Whether you have a fully realized design or just a rough idea,
                we&apos;re here to help you make something worth wearing.
              </p>
              <Link to="/contact" className="btn btn-brand mt-3">
                Contact Us
              </Link>
            </Col>

            <Col md={6}>
              <img
                src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=700&q=80"
                alt="Quality printed apparel"
                style={{
                  width: "100%",
                  height: "360px",
                  objectFit: "cover",
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(136,76,66,0.15)",
                }}
              />
            </Col>
          </Row>
        </section>
      </Container>

      <div
        style={{
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)",
          position: "relative",
          background: "var(--slp-clay)",
          padding: "4rem 1rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "560px", margin: "0 auto" }}>
          <h2
            style={{
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
            }}
          >
            Put Your Mark On It.
          </h2>
          <p style={{ color: "var(--slp-sand)", fontSize: "1.05rem", margin: "0.75rem 0 1.75rem" }}>
            Custom DTF transfers on everything you wear and carry.
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              to="/"
              className="btn"
              style={{
                background: "#ffffff",
                color: "var(--slp-clay)",
                borderRadius: "999px",
                padding: "0.65rem 1.8rem",
                fontWeight: 600,
                border: "none",
              }}
            >
              Start Customizing
            </Link>
            <Link
              to="/contact"
              className="btn"
              style={{
                background: "transparent",
                color: "#ffffff",
                border: "2px solid #ffffff",
                borderRadius: "999px",
                padding: "0.65rem 1.8rem",
                fontWeight: 600,
              }}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
