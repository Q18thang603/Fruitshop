import { Link } from "react-router-dom";
import {
  ShoppingCart,
  User,
  Heart,
  Menu,
  ChevronDown,
  Phone,
  Search,
  Percent,
  X,
  LogOut,
  LayoutDashboard
} from "lucide-react";
import { useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge, Dropdown, Input, Button } from "antd";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { ProductContext } from "../context/ProductContext";
import { setFallbackImage } from "../utils/cloudinary";

export default function Navbar({ search, setSearch }) {
  const { cartItems, totalQuantity } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  const { products } = useContext(ProductContext);

  const [isScrolled, setIsScrolled] = useState(false);
  const [showDepartments, setShowDepartments] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const departments = [
    { name: "Rau củ", path: "/category/vegetable" },
    { name: "Trái cây & hạt", path: "/category/fruit" },
    { name: "Thịt hữu cơ", path: "/category/meat" },
    { name: "Bơ & Trứng", path: "/category/organic" },
    { name: "Sữa & kem", path: "/category/dairy" },
    { name: "Thực phẩm sạch", path: "/products" },
  ];

  const filteredProducts = products
    .filter((product) => product.name.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 5);

  const userMenuItems = [
    {
      key: 'profile',
      label: <Link to="/profile">Thông tin cá nhân</Link>,
      icon: <User className="w-4 h-4" />
    },
    user?.role === "ROLE_ADMIN" && {
      key: 'admin',
      label: <Link to="/admin/dashboard">Quản trị viên</Link>,
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: <span onClick={logout}>Đăng xuất</span>,
      icon: <LogOut className="w-4 h-4" />,
      danger: true
    },
  ].filter(Boolean);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm py-2' : 'bg-white py-4'}`}>
      <div className="container mx-auto px-4">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-8 mb-4">
          {/* Logo */}
          <Link to="/" className="flex flex-col">
            <span className="text-2xl font-black text-primary-600 tracking-tighter leading-none">THE MQC</span>
            <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] leading-none mt-1 uppercase">Fresh & Natural</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl relative">
            <Input
              placeholder="Tìm kiếm trái cây hữu cơ..."
              prefix={<Search className="text-slate-400 w-4 h-4" />}
              className="rounded-full border-slate-200 hover:border-primary-400 focus:border-primary-500 py-2.5 px-6"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <AnimatePresence>
              {search && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
                >
                  {filteredProducts.length > 0 ? (
                    <div className="p-2">
                      {filteredProducts.map((p) => (
                        <Link
                          key={p.id}
                          to={`/product/${p.id}`}
                          onClick={() => setSearch("")}
                          className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors"
                        >
                          <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-lg" onError={(e) => setFallbackImage(e, p.imageFallback)} />
                          <div>
                            <h4 className="text-sm font-semibold text-slate-800">{p.name}</h4>
                            <p className="text-xs text-primary-600 font-bold">{p.price.toLocaleString()} đ</p>
                          </div>
                        </Link>
                      ))}
                      <Link to="/products" className="block text-center py-2 text-xs text-slate-400 hover:text-primary-600 transition-colors border-t border-slate-50 mt-1">
                        Xem tất cả sản phẩm
                      </Link>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-400">Không tìm thấy sản phẩm nào</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2 md:gap-6">
            <div className="hidden lg:flex items-center gap-3 text-slate-400 border-r border-slate-200 pr-6">
              <div className="p-2.5 bg-slate-50 rounded-full">
                <Phone className="w-5 h-5 text-primary-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 leading-none">Hỗ trợ 24/7</span>
                <span className="text-sm font-black text-slate-800">0999 999 999</span>
              </div>
            </div>

            <div className="flex items-center gap-1 md:gap-4">
              {user ? (
                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
                  <Button type="text" className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-50 hover:bg-slate-100 p-0 border-none">
                    <User className="w-5 h-5 text-slate-600" />
                  </Button>
                </Dropdown>
              ) : (
                <Link to="/login" className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-50 hover:bg-slate-100 transition-colors">
                  <User className="w-5 h-5 text-slate-600" />
                </Link>
              )}

              <Badge count={0} size="small" offset={[-4, 4]}>
                <button className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-50 hover:bg-slate-100 transition-colors">
                  <Heart className="w-5 h-5 text-slate-600" />
                </button>
              </Badge>

              <Link to="/cart">
                <Badge count={totalQuantity} size="small" offset={[-4, 4]} color="#3eb63a">
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary-50 hover:bg-primary-100 transition-colors group">
                    <ShoppingCart className="w-5 h-5 text-primary-600 group-hover:scale-110 transition-transform" />
                  </div>
                </Badge>
              </Link>

              <button className="md:hidden h-10 w-10 flex items-center justify-center rounded-full bg-slate-50" onClick={() => setMobileMenuOpen(true)}>
                <Menu className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <div className="hidden md:flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="relative">
            <button
              onMouseEnter={() => setShowDepartments(true)}
              onMouseLeave={() => setShowDepartments(false)}
              className="flex items-center gap-3 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-t-2xl font-bold transition-all"
            >
              <Menu className="w-5 h-5" />
              <span>DANH MỤC SẢN PHẨM</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showDepartments ? 'rotate-180' : ''}`} />

              <AnimatePresence>
                {showDepartments && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 w-64 bg-white shadow-2xl border-x border-b border-slate-100 overflow-hidden rounded-b-2xl"
                  >
                    {departments.map((dept, i) => (
                      <Link
                        key={i}
                        to={dept.path}
                        className="flex items-center justify-between px-6 py-3.5 text-slate-600 hover:bg-primary-50 hover:text-primary-600 transition-all font-medium border-b border-slate-50 last:border-none"
                      >
                        {dept.name}
                        <ChevronDown className="-rotate-90 w-3 h-3 opacity-30" />
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>

          <nav className="flex items-center gap-8">
            {['/', '/about', '/products', '/news', '/contact'].map((path, i) => (
              <Link
                key={i}
                to={path}
                className="text-sm font-bold text-slate-600 hover:text-primary-600 transition-colors uppercase tracking-widest py-2 relative group"
              >
                {path === '/' ? 'Trang chủ' : path.slice(1) === 'about' ? 'Giới thiệu' : path.slice(1) === 'products' ? 'Sản phẩm' : path.slice(1) === 'news' ? 'Tin tức' : 'Liên hệ'}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <Link to="/products" className="flex items-center gap-2 text-primary-600 font-black text-sm bg-primary-50 px-4 py-2 rounded-full hover:bg-primary-100 transition-all animate-pulse">
            <Percent className="w-4 h-4" />
            KHUYẾN MÃI HÔM NAY
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white z-[60] p-6 flex flex-col md:hidden"
          >
            <div className="flex items-center justify-between mb-8">
              <Link to="/" className="text-2xl font-black text-primary-600" onClick={() => setMobileMenuOpen(false)}>THE MQC</Link>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-slate-100 rounded-full">
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            <div className="mb-8">
              <Input
                placeholder="Tìm kiếm..."
                prefix={<Search className="w-4 h-4" />}
                className="rounded-xl py-3"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <nav className="flex flex-col gap-6 overflow-y-auto">
              {['/', '/about', '/products', '/news', '/contact'].map((path, i) => (
                <Link
                  key={i}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2"
                >
                  {path === '/' ? 'Trang chủ' : path.slice(1) === 'about' ? 'Giới thiệu' : path.slice(1) === 'products' ? 'Sản phẩm' : path.slice(1) === 'news' ? 'Tin tức' : 'Liên hệ'}
                </Link>
              ))}

              <div className="mt-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Danh mục</h4>
                <div className="grid grid-cols-2 gap-3">
                  {departments.map((dept, i) => (
                    <Link key={i} to={dept.path} onClick={() => setMobileMenuOpen(false)} className="bg-slate-50 p-3 rounded-xl text-sm font-semibold text-slate-600">
                      {dept.name}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>

            <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-center gap-4">
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-slate-400">GỌI NGAY</span>
                <span className="text-lg font-black text-slate-800">0999 999 999</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
