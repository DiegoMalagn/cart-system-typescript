import { Container, Button } from "react-bootstrap";

export function PaymentFailed() {
  const returnToStore = () => {
      window.location.href = import.meta.env.VITE_CLIENT_URL;
  };

  return (
    <Container className="text-center mt-5">
      <h1>Payment Failed</h1>
      <p className="lead">Unfortunately, your payment could not be processed.</p>

      <Button variant="secondary" onClick={returnToStore}>
        Back to store
      </Button>
    </Container>
  );
}

export default PaymentFailed;