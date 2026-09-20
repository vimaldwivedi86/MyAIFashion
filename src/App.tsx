import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CartDrawer from './components/layout/CartDrawer';
import HomePage from './pages/HomePage';
import StudioPage from './pages/StudioPage';
import ShopPage from './pages/ShopPage';
import FabricsPage from './pages/FabricsPage';
import AboutPage from './pages/AboutPage';
import PrivacyRightsPage from './pages/PrivacyRightsPage';
import LoginPage from './pages/LoginPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import AccountPage from './pages/AccountPage';
import RequireAuth from './components/RequireAuth';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <CartDrawer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/studio" element={<RequireAuth><StudioPage /></RequireAuth>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/fabrics" element={<FabricsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy-rights" element={<PrivacyRightsPage />} />
        <Route path="/checkout" element={<RequireAuth><CheckoutPage /></RequireAuth>} />
        <Route path="/order-confirmation/:orderId" element={<RequireAuth><OrderConfirmationPage /></RequireAuth>} />
        <Route path="/account" element={<RequireAuth><AccountPage /></RequireAuth>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
