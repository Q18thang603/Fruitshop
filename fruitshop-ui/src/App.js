import { Routes, Route, useLocation, Navigate, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useState, useMemo } from "react";
import { Button } from "antd";

import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";
import CategoryPage from "./pages/CategoryPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Payment from "./pages/Payment";
import Success from "./pages/Success";
import About from "./pages/About";
import Contact from "./pages/Contact";
import LoginPage from "./pages/LoginPage";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProducts from "./pages/AdminProducts";
import AdminDashboard from "./pages/AdminDashboard";
import AIChatbox from "./components/AIChatbox";

function App() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const location = useLocation();
  const isAdminRoute = useMemo(() => location.pathname.startsWith("/admin"), [location.pathname]);

  return (
    <>
      {!isAdminRoute && <Navbar search={search} setSearch={setSearch} />}

      <Routes>
        <Route
          path="/"
          element={<Home search={search} category={category} setCategory={setCategory} />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/products" element={<ProductList search={search} category={category} />} />
        <Route path="/product/:id" element={<ProductDetail />} />

        {/* Protected Routes */}
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
        <Route path="/success" element={<ProtectedRoute><Success /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/products" element={<ProtectedRoute requireAdmin><AdminProducts /></ProtectedRoute>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />

        {/* Catch-all route */}
        <Route path="*" element={
          <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center mt-[130px]">
            <h2 className="text-4xl font-black text-slate-800 mb-4">404 - TRANG KHÔNG TỒN TẠI</h2>
            <Link to="/">
              <Button type="primary" size="large" className="rounded-xl h-12 px-8">Quay lại trang chủ</Button>
            </Link>
          </div>
        } />
      </Routes>

      {!isAdminRoute && <Footer />}

      <AIChatbox />

      <ToastContainer position="top-right" autoClose={2500} />
    </>
  );
}

export default App;

