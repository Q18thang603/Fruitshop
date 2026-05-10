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
  Quote, 
  ArrowRight,
  TrendingUp,
  Award,
  Zap
} from "lucide-react";
import { Button, Card, Statistic, Rate } from "antd";

export default function Home({ search, category, setCategory }) {

  const serviceItems = [
    { icon: Leaf, title: "100% Hữu Cơ", text: "Tốt cho sức khỏe & môi trường.", color: "bg-green-50 text-green-600" },
    { icon: ShoppingBasket, title: "Tiêu Dùng Xanh", text: "Sản phẩm địa phương tươi mới.", color: "bg-orange-50 text-orange-600" },
    { icon: Truck, title: "Giao Hàng Nhanh", text: "Miễn phí cho đơn hàng từ 500k.", color: "bg-blue-50 text-blue-600" },
    { icon: RefreshCcw, title: "Đổi Trả Dễ Dàng", text: "Cam kết chất lượng tuyệt đối.", color: "bg-purple-50 text-purple-600" }
  ];

  const marketItems = useMemo(() => [
    { title: "Trái Cây", category: "fruit", color: "from-orange-400 to-red-500" },
    { title: "Thịt Sạch", category: "meat", color: "from-red-500 to-rose-700" },
    { title: "Rau Củ", category: "vegetable", color: "from-green-400 to-emerald-600" },
    { title: "Trứng & Bơ", category: "organic", color: "from-yellow-400 to-amber-600" },
    { title: "Sữa Hữu Cơ", category: "dairy", color: "from-blue-400 to-indigo-600" }
  ], []);

  const promoItems = [
    { id: "promo-1", label: "Ưu đãi 50%", title: "Rau củ mùa vụ", image: "https://images.unsplash.com/photo-1566384842284-82da24302914?auto=format&fit=crop&w=400&q=80" },
    { id: "promo-2", label: "Mua 1 Tặng 1", title: "Nước ép nguyên chất", image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=400&q=80" },
    { id: "promo-3", label: "Flash Sale", title: "Hạt dinh dưỡng", image: "https://images.unsplash.com/photo-1511233072906-18c2ca0a95e0?auto=format&fit=crop&w=400&q=80" }
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <HeroBanner />

      {/* Services Section */}
      <div className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceItems.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 flex flex-col items-center text-center group"
            >
              <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <item.icon size={32} />
              </div>
              <h3 className="text-lg font-black text-slate-800 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Categories / Markets */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-primary-600 font-black text-xs uppercase tracking-[0.3em] mb-3 block">Danh mục phổ biến</span>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">KHÁM PHÁ CỬA HÀNG</h2>
            </div>
            <Button type="link" className="text-primary-600 font-black flex items-center gap-2 p-0">
              XEM TẤT CẢ <ArrowRight size={16} />
            </Button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            {marketItems.map((item, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCategory(item.category)}
                className={`relative h-48 rounded-[2rem] overflow-hidden group shadow-lg`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-90 group-hover:opacity-100 transition-opacity`} />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 p-4">
                  <h3 className="text-xl font-black mb-1">{item.title}</h3>
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Sản phẩm hữu cơ</span>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Flash Sale / Promo Panels */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {promoItems.map((promo, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="relative h-[300px] rounded-[3rem] overflow-hidden group shadow-2xl"
              >
                <img src={promo.image} alt={promo.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                <div className="absolute inset-0 p-10 flex flex-col justify-end text-white">
                  <span className="text-xs font-black bg-primary-600 px-3 py-1 rounded-full w-fit mb-4">{promo.label}</span>
                  <h3 className="text-3xl font-black mb-6 leading-tight">{promo.title}</h3>
                  <Button ghost className="w-fit h-12 px-8 rounded-xl border-white text-white font-bold hover:bg-white hover:text-primary-600 border-2">
                    MUA NGAY
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Products Section */}
      <section className="py-24 bg-white rounded-[4rem] shadow-inner shadow-slate-100" id="products">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-primary-600 font-black text-xs uppercase tracking-[0.3em] mb-4 block">Sản phẩm chất lượng</span>
            <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tighter">THỰC PHẨM HỮU CƠ</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {['all', 'fruit', 'vegetable', 'meat', 'organic', 'dairy'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-8 py-3 rounded-2xl font-black text-sm transition-all duration-300 ${category === cat ? 'bg-primary-600 text-white shadow-xl shadow-primary-200 scale-105' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                >
                  {cat === 'all' ? 'TẤT CẢ' : cat === 'fruit' ? 'TRÁI CÂY' : cat === 'vegetable' ? 'RAU CỦ' : cat === 'meat' ? 'THỊT' : cat === 'organic' ? 'TRỨNG & BƠ' : 'SỮA'}
                </button>
              ))}
            </div>
          </div>

          <ProductList search={search} category={category} />
        </div>
      </section>

      {/* Testimonials & Stats */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-primary-600 font-black text-xs uppercase tracking-[0.3em] mb-4 block">Đánh giá thực tế</span>
              <h2 className="text-5xl font-black text-slate-900 mb-8 leading-tight tracking-tighter">KHÁCH HÀNG TIN TƯỞNG CHÚNG TÔI</h2>
              
              <div className="space-y-8">
                {[
                  { name: "Nguyễn Thị Lan", text: "Tôi rất thích rau củ và trái cây của cửa hàng vì sản phẩm tươi, giao nhanh và đóng gói sạch sẽ." },
                  { name: "Trần Văn Hải", text: "Gia đình tôi chuyển sang dùng thực phẩm hữu cơ thường xuyên hơn nhờ chất lượng ổn định." },
                  { name: "Lê Minh Anh", text: "Hình ảnh sản phẩm rõ ràng, đặt hàng đơn giản và tư vấn rất dễ hiểu." }
                ].map((t, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="flex gap-6 p-8 bg-white rounded-[2rem] shadow-lg shadow-slate-100"
                  >
                    <div className="text-primary-600 opacity-20">
                      <Quote size={48} />
                    </div>
                    <div>
                      <p className="text-slate-600 font-medium italic mb-4 leading-relaxed">"{t.text}"</p>
                      <div className="flex items-center justify-between">
                        <span className="font-black text-slate-900">{t.name}</span>
                        <Rate disabled defaultValue={5} className="text-xs text-yellow-400" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {[
                { label: "Khách hàng", value: 15000, suffix: "+", icon: TrendingUp },
                { label: "Sản phẩm sạch", value: 250, suffix: "+", icon: ShoppingBasket },
                { label: "Nông trại đạt chuẩn", value: 45, suffix: "", icon: Award },
                { label: "Đơn hàng/tháng", value: 1200, suffix: "+", icon: Zap }
              ].map((stat, i) => (
                <Card key={i} className="rounded-[2.5rem] border-none shadow-xl shadow-slate-100 overflow-hidden group">
                  <div className="flex flex-col items-center text-center py-6">
                    <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <stat.icon size={24} />
                    </div>
                    <Statistic value={stat.value} suffix={stat.suffix} valueStyle={{ fontWeight: 900, color: '#1e293b' }} />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">{stat.label}</span>
                  </div>
                </Card>
              ))}
              
              <div className="col-span-2 relative h-64 rounded-[3rem] overflow-hidden mt-8 shadow-2xl">
                 <img 
                    src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=800&q=80" 
                    className="absolute inset-0 w-full h-full object-cover"
                    alt="Farm"
                 />
                 <div className="absolute inset-0 bg-primary-600/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-white p-8 text-center">
                    <h3 className="text-2xl font-black mb-2 uppercase tracking-tighter">Tham gia cộng đồng sống xanh</h3>
                    <p className="text-sm opacity-90 font-medium mb-6">Nhận thông báo về sản phẩm mới và ưu đãi độc quyền.</p>
                    <div className="flex w-full max-w-sm gap-2">
                       <input className="flex-1 bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl px-4 py-2 placeholder:text-white/70" placeholder="Email của bạn..." />
                       <Button ghost className="h-11 rounded-xl border-white text-white font-bold">GỬI</Button>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
