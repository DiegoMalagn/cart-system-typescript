import { Container, Row, Col } from "react-bootstrap";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="mt-auto" style={{ backgroundColor: "var(--slp-clay)", color: "white", padding: "2rem 1rem" }}>
      <Container>
        <Row className="justify-content-center">
          <Col
            md={4}
            className="d-flex justify-content-center align-items-center"
          >
            <div className="d-flex justify-content-center align-items-center" style={{ gap: "1.5rem" }}>
              <a
                href="https://www.instagram.com/stamplabprints/"
                target="_blank"
                rel="noopener noreferrer"
                className="slp-social-link"
                aria-label="Instagram"
                style={{ fontSize: "1.6rem" }}
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.facebook.com/stamplabprints1"
                target="_blank"
                rel="noopener noreferrer"
                className="slp-social-link"
                aria-label="Facebook"
                style={{ fontSize: "1.6rem" }}
              >
                <FaFacebook />
              </a>
              <a
                href="https://www.tiktok.com/@stamplabprints"
                target="_blank"
                rel="noopener noreferrer"
                className="slp-social-link"
                aria-label="TikTok"
                style={{ fontSize: "1.6rem" }}
              >
                <FaTiktok />
              </a>
            </div>
          </Col>
        </Row>
        <div className="text-center mt-3">
          <small className="text-sm" style={{ color: "var(--slp-sand)" }}>
            © 2025 Stamp Lab Prints. All rights reserved.
          </small>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
