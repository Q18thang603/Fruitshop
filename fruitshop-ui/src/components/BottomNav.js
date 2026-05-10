import { useNavigate } from "react-router-dom";

export default function BottomNav() {
  const navigate = useNavigate();

  return (
    <div className="nav">
      <div onClick={() => navigate("/")}>🏠</div>
      <div onClick={() => navigate("/products")}>🛍️</div>
      <div onClick={() => navigate("/cart")}>🛒</div>
      <div onClick={() => navigate("/profile")}>👤</div>
    </div>
  );
}