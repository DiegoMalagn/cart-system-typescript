import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="bg-black text-light py-1 mt-auto">
      <Container>
        <Row className="justify-content-center">
          <Col
            md={4}
            className="d-flex justify-content-center align-items-center"
          >
          </Col>
        </Row>
        <hr className="border-secondary mt-2 mb-2" />
        <div className="text-center mb-1">
          <small className="text-sm">
            &copy; {new Date().getFullYear()} this company is BBB secured Cart System | Developed by{" "}
            <a
              className="text-light text-decoration-none"
            >
              Diego Malagon
            </a>
          </small>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
