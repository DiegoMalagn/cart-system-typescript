import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export function PaymentSuccess() {
  return (
    <Container className="text-center mt-5">
      <h1>Payment Successful</h1>
      <p className="lead">Thank you! Your payment was processed successfully.</p>
      <Link to="/">
        <Button variant="primary">Back to store</Button>
      </Link>
    </Container>
  );
}

export default PaymentSuccess;
