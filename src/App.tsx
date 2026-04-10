import { Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Navbar } from "./components/Navbar";
import { ShoppingCartProvider } from "./context/ShoppingCartContext";
import Footer from "./components/Footer";
import { ProductPage } from "./pages/ProductPage";
import { PaymentSuccess } from "./pages/Success";
import { PaymentFailed } from "./pages/Failed";

function App() {
  return (
    <ShoppingCartProvider>
    <Navbar/>
      <Container className="mb-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/failed" element={<PaymentFailed />} />
        </Routes>
      </Container>
      <Footer/>
    </ShoppingCartProvider>
  );
}

export default App;
