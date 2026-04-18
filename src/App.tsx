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
import { ProductCustomizer } from "./pages/ProductCustomizer";
import { Contact } from "./pages/Contact";
import { CheckoutReview } from "./pages/CheckoutReview";

function App() {
  return (
    <ShoppingCartProvider>
    <Navbar/>
      <Container className="mb-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/customize/tshirt" element={<ProductCustomizer productType="tshirt" />} />
          <Route path="/customize/hoodie" element={<ProductCustomizer productType="hoodie" />} />
          <Route path="/customize/sweater" element={<ProductCustomizer productType="sweater" />} />
          <Route path="/customize/glasscup" element={<ProductCustomizer productType="glasscup" />} />
          <Route path="/customize/hat" element={<ProductCustomizer productType="hat" />} />
          <Route path="/customize/apron" element={<ProductCustomizer productType="apron" />} />
          <Route path="/customize/totebag" element={<ProductCustomizer productType="totebag" />} />
          <Route path="/checkout/review" element={<CheckoutReview />} />
          <Route path="/cart" element={<CheckoutReview />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/failed" element={<PaymentFailed />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Container>
      <Footer/>
    </ShoppingCartProvider>
  );
}

export default App;
