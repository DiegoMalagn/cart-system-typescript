import { Container, Button } from "react-bootstrap";

const CLIENT_URL =
  (import.meta.env.VITE_CLIENT_URL as string) ||
  window.location.origin;

export function PaymentSuccess() {
  return (
    <Container className="text-center mt-5">
      <h1>Payment Successful</h1>
      <p className="lead">Thank you! Your payment was processed successfully.</p>

      <a href={CLIENT_URL}>
        <Button variant="primary">Back to store</Button>
      </a>
    </Container>
  );
}

export default PaymentSuccess;