import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export function PaymentFailed() {
  return (
    <Container className="text-center mt-5">
      <h1>Payment Failed</h1>
      <p className="lead">Unfortunately, your payment could not be processed.</p>
      <Link to="/">
        <Button variant="secondary">Back to store</Button>
      </Link>
    </Container>
  );
}

export default PaymentFailed;
