import HeroBanner from "../components/HeroBanner";
import ProductList from "./ProductList";
import { useContext, useMemo } from "react";
import { ProductContext } from "../context/ProductContext";
import { motion } from "framer-motion";
import {
  Leaf,
  Truck,
  RefreshCcw,
  ShoppingBasket,
  ArrowRight,
  ChevronRight,
  Headphones
} from "lucide-react";
import { Button } from "antd";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

export default function Home({ search, category, setCategory }) {
  const { products } = useContext(ProductContext);

  const serviceItems = [
    { icon: Truck, title: "Giao hàng nhanh", text: "Giao trong 2h nội thành.", color: "bg-green-50 text-green-600" },
    { icon: RefreshCcw, title: "Đổi trả dễ dàng", text: "Đổi trả trong 7 ngày.", color: "bg-green-50 text-green-600" },
    { icon: Leaf, title: "Sản phẩm chất lượng", text: "100% tươi ngon, rõ nguồn gốc.", color: "bg-green-50 text-green-600" },
    { icon: Headphones, title: "Tư vấn tận tâm", text: "Hỗ trợ 24/7, đặt hàng dễ dàng.", color: "bg-green-50 text-green-600" }
  ];

  // Featured Category Cards matching reference screenshot
  const marketItems = useMemo(() => [
    { 
      title: "Trái cây", 
      category: "fruit", 
      image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=300&q=80",
      sub: "Xem ngay"
    },
    { 
      title: "Rau củ", 
      category: "vegetable", 
      image: "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=300&q=80",
      sub: "Xem ngay"
    },
    { 
      title: "Sản phẩm hữu cơ", 
      category: "organic", 
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80",
      sub: "Xem ngay"
    },
    { 
      title: "Khuyến mãi", 
      category: "promo", 
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=300&q=80",
      sub: "Xem ngay"
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

  // Best sellers: take top 4 products
  const bestSellers = useMemo(() => {
    return (products || []).slice(0, 4);
  }, [products]);

  return (
    <div className="bg-slate-50 min-h-screen mt-[130px] md:mt-[160px]">
      {/* 1. Hero Banner */}
      <HeroBanner />

      {/* 2. Danh mục nổi bật */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight uppercase">Danh mục nổi bật</h2>
            <Link to="/products" className="text-slate-400 hover:text-green-600 font-bold text-xs uppercase tracking-wider flex items-center gap-1">
              Xem tất cả <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {marketItems.map((item, i) => (
              <Link
                key={i}
                to={`/category/${item.category}`}
                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4 group"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 shrink-0 flex items-center justify-center">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-800 group-hover:text-green-600 transition-colors block mb-1">{item.title}</h3>
                  <span className="text-xs text-slate-400 font-bold flex items-center gap-0.5">
                    {item.sub} <ChevronRight size={12} className="mt-0.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Sản phẩm bán chạyi */}
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight uppercase">Sản phẩm bán chạy</h2>
            <Link to="/products" className="text-slate-400 hover:text-green-600 font-bold text-xs uppercase tracking-wider flex items-center gap-1">
              Xem tất cả <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={`best-selling-${product.id}`} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Products (Tabs section) */}
      <section className="py-16" id="products">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-12">
            <span className="text-green-600 font-black text-xs uppercase tracking-[0.3em] mb-4 block">Sản phẩm chất lượng</span>
            <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tighter uppercase">Thực phẩm hữu cơ</h2>
            <div className="flex flex-wrap justify-center gap-3">
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

      {/* 5. Promotions */}
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

      {/* 6. Benefits / Policies Section */}
      <section className="py-12 bg-slate-100/40 border-t border-slate-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceItems.map((item, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm"
              >
                <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center shrink-0`}>
                  <item.icon size={22} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800 mb-0.5 uppercase tracking-tight">{item.title}</h3>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
