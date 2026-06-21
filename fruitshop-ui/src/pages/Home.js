import HeroBanner from "../components/HeroBanner";
import ProductList from "./ProductList";
import ProductCard from "../components/ProductCard";
import { useContext, useMemo } from "react";
import { ProductContext } from "../context/ProductContext";
import { Link } from "react-router-dom";
import {
  Leaf,
  Truck,
  RefreshCcw,
  ShoppingBasket,
  ArrowRight,
  Headphones,
  Sparkles,
  Percent
} from "lucide-react";
import { Button } from "antd";

export default function Home({ search, category, setCategory }) {
  const { products, loading } = useContext(ProductContext);

  const serviceItems = [
    { icon: Truck, title: "Giao hàng nhanh", text: "Giao trong 2h nội thành.", color: "bg-green-50 text-green-600" },
    { icon: RefreshCcw, title: "Đổi trả dễ dàng", text: "Đổi trả trong 7 ngày.", color: "bg-green-50 text-green-600" },
    { icon: Leaf, title: "Sản phẩm chất lượng", text: "100% tươi ngon, rõ nguồn gốc.", color: "bg-green-50 text-green-600" },
    { icon: Headphones, title: "Tư vấn tận tâm", text: "Hỗ trợ 24/7, đặt hàng dễ dàng.", color: "bg-green-50 text-green-600" }
  ];

  const categories = useMemo(() => [
    {
      title: "Trái cây",
      category: "fruit",
      path: "/category/fruit",
      desc: "Xem ngay",
      image: "https://images.unsplash.com/photo-1610832958506-ee563361c1e9?auto=format&fit=crop&w=300&q=80",
      icon: Leaf,
      color: "bg-emerald-50 text-emerald-600"
    },
    {
      title: "Rau củ",
      category: "vegetable",
      path: "/category/vegetable",
      desc: "Xem ngay",
      image: "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=300&q=80",
      icon: ShoppingBasket,
      color: "bg-green-50 text-green-600"
    },
    {
      title: "Sản phẩm hữu cơ",
      category: "organic",
      path: "/category/organic",
      desc: "Xem ngay",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80",
      icon: Sparkles,
      color: "bg-teal-50 text-teal-600"
    },
    {
      title: "Khuyến mãi",
      category: "all",
      path: "/products",
      desc: "Xem ngay",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=300&q=80",
      icon: Percent,
      color: "bg-rose-50 text-rose-600"
    }
  ], []);

  const promoItems = [
    { id: "promo-1", label: "Ưu đãi 50%", title: "Rau củ mùa vụ", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80", path: "/category/vegetable" },
    { id: "promo-2", label: "Mua 1 Tặng 1", title: "Trái cây tươi sạch", image: "https://images.unsplash.com/photo-1519996521430-02b798c1d881?auto=format&fit=crop&w=600&q=80", path: "/category/fruit" },
    { id: "promo-3", label: "Flash Sale", title: "Sản phẩm hữu cơ", image: "https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=600&q=80", path: "/category/organic" }
  ];

  const handlePromoImageError = (e) => {
    e.target.src = "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80";
  };

  const bestSellers = useMemo(() => {
    return (products || []).slice(0, 4);
  }, [products]);

  return (
    <div className="bg-slate-50 min-h-screen pb-16 mt-[130px] md:mt-[160px]">
      <HeroBanner />

      {/* 1. DANH MỤC NỔI BẬT */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight uppercase">
              Danh mục nổi bật
            </h2>
            <Link to="/products" className="text-green-600 font-bold hover:text-green-700 flex items-center gap-1.5 transition-colors text-sm uppercase tracking-wider">
              Xem tất cả <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((item, i) => (
              <Link
                key={i}
                to={item.path}
                className="group relative bg-white rounded-3xl p-6 flex items-center justify-between border border-slate-100/50 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden min-h-[140px]"
              >
                {/* Product/Category image aligned left */}
                <div className="w-24 h-24 flex items-center justify-center overflow-hidden rounded-2xl relative z-10 bg-slate-50">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Text and Icon on the right */}
                <div className="flex-1 pl-4 flex flex-col justify-center items-start text-left relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-1.5 rounded-full ${item.color}`}>
                      <item.icon size={14} />
                    </div>
                    <span className="text-sm font-black text-slate-800 group-hover:text-green-600 transition-colors uppercase tracking-tight">
                      {item.title}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                    {item.desc} <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>

                {/* Subtle decorative background glow */}
                <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-green-50 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2. SẢN PHẨM BÁN CHẠY */}
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight uppercase">
              Sản phẩm bán chạy
            </h2>
            <Link to="/products" className="text-green-600 font-bold hover:text-green-700 flex items-center gap-1.5 transition-colors text-sm uppercase tracking-wider">
              Xem tất cả <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestSellers.map((product) => (
                <ProductCard
                  key={`bestseller-${product.id}`}
                  product={product}
                  layout="horizontal"
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. THỰC PHẨM HỮU CƠ */}
      <section className="py-16" id="products">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-green-600 font-bold text-xs uppercase tracking-[0.2em] mb-3 block">
              Sản phẩm chất lượng
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight uppercase">
              Thực phẩm hữu cơ
            </h2>
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {['all', 'fruit', 'vegetable', 'organic'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-6 py-2.5 rounded-full font-black text-xs uppercase transition-all duration-300 ${category === cat ? 'bg-green-600 text-white shadow-lg shadow-green-200' : 'bg-white border border-slate-200 text-slate-400 hover:bg-slate-50'}`}
                >
                  {cat === 'all' ? 'TẤT CẢ' : cat === 'fruit' ? 'TRÁI CÂY' : cat === 'vegetable' ? 'RAU CỦ' : 'TRỨNG & BƠ'}
                </button>
              ))}
            </div>
          </div>

          <ProductList search={search} category={category} />
        </div>
      </section>

      {/* 4. CHƯƠNG TRÌNH KHUYẾN MÃI */}
      <section className="py-16 bg-white border-t border-slate-100" id="promotions">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-green-600 font-black text-xs uppercase tracking-[0.3em] mb-3 block">Ưu đãi cực lớn</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Chương trình khuyến mãi</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {promoItems.map((promo, i) => (
              <div
                key={i}
                className="relative h-[300px] rounded-3xl overflow-hidden shadow-lg group transition-all duration-300 hover:shadow-xl hover:scale-[1.05] flex flex-col justify-end"
              >
                <img 
                  src={promo.image} 
                  alt={promo.title} 
                  onError={handlePromoImageError}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                  <span className="text-[10px] font-black bg-green-600 px-3 py-1 rounded-full w-fit mb-4 uppercase text-white">{promo.label}</span>
                  <h3 className="text-2xl font-black mb-6 leading-tight text-white">{promo.title}</h3>
                  <Link to={promo.path}>
                    <Button ghost className="w-fit h-11 px-6 rounded-xl border-white text-white font-bold hover:bg-white hover:text-green-600 border-2">
                      MUA NGAY
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. DỊCH VỤ / LỢI ÍCH KHÁCH HÀNG */}
      <section className="py-8 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {serviceItems.map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm hover:bg-slate-50 transition-colors">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                  <item.icon size={22} />
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">{item.title}</h4>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
