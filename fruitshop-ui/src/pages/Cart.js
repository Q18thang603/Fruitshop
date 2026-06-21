import { useContext } from "react";
import { Link } from "react-router-dom";
import { 
  Trash2, 
  Minus, 
  Plus, 
  ArrowLeft, 
  ShoppingBag,
  Truck,
  ShieldCheck,
  CreditCard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Divider, Empty, Card } from "antd";
import { CartContext } from "../context/CartContext";
import { getProductImage } from "../utils/imageUtils";
import { setFallbackImage } from "../utils/cloudinary";

export default function Cart() {
  const {
    cartItems,
    increaseQty,
    decreaseQty,
    removeItem,
    totalPrice
  } = useContext(CartContext);

  return (
    <div className="bg-slate-50 min-h-screen mt-[100px] md:mt-[130px] py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-primary-600 font-black text-xs uppercase tracking-[0.3em] mb-2 block">Cửa hàng của bạn</span>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">GIỎ HÀNG</h1>
          </div>
          <Link to="/products">
            <Button type="link" className="text-slate-400 hover:text-primary-600 font-bold flex items-center gap-2 p-0 h-auto">
              <ArrowLeft size={16} /> TIẾP TỤC MUA SẮM
            </Button>
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[3rem] p-12 md:p-24 text-center shadow-2xl shadow-slate-200/50"
          >
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div className="space-y-4">
                  <p className="text-2xl font-black text-slate-800 tracking-tight">GIỎ HÀNG ĐANG TRỐNG</p>
                  <p className="text-slate-400 font-medium max-w-md mx-auto italic">
                    "Hãy lấp đầy giỏ hàng của bạn bằng những sản phẩm hữu cơ tươi ngon và đầy dinh dưỡng nhất."
                  </p>
                </div>
              }
            >
              <Link to="/products">
                <Button type="primary" size="large" className="h-14 px-10 rounded-2xl font-black tracking-widest mt-6 shadow-xl shadow-primary-200">
                  KHÁM PHÁ CỬA HÀNG
                </Button>
              </Link>
            </Empty>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-6">
              <AnimatePresence mode="popLayout">
                {cartItems.map((item, idx) => (
                  <motion.div
                    key={item.cartItemId || item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 shadow-xl shadow-slate-100 hover:shadow-2xl transition-shadow border border-slate-50 relative group"
                  >
                    <div className="w-full md:w-32 aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0 relative">
                       <img
                        src={getProductImage(item.image)}
                        alt={item.name}
                        loading="lazy"
                        className="w-full h-full object-contain p-2 transition-transform group-hover:scale-110 duration-500"
                        onError={(event) => setFallbackImage(event, item.imageFallback)}
                      />
                      {item.sale && <span className="absolute top-2 left-2 bg-red-500 text-[8px] font-black text-white px-2 py-0.5 rounded-full uppercase">Sale</span>}
                    </div>

                    <div className="flex-1 text-center md:text-left">
                      <Link to={`/product/${item.id}`}>
                        <h3 className="text-xl font-black text-slate-800 hover:text-primary-600 transition-colors uppercase tracking-tight mb-2">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-sm font-bold text-slate-400 tracking-widest uppercase">Đơn giá: {item.price.toLocaleString()} đ</p>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                      <div className="flex items-center bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                        <button 
                          onClick={() => decreaseQty(item.id, item.cartItemId)}
                          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-md transition-all text-slate-600"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-12 text-center font-black text-slate-800">{item.quantity}</span>
                        <button 
                          onClick={() => increaseQty(item.id, item.cartItemId)}
                          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-md transition-all text-slate-600"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id, item.cartItemId)}
                        className="flex items-center gap-2 text-[10px] font-black text-red-400 hover:text-red-600 uppercase tracking-widest transition-colors"
                      >
                        <Trash2 size={12} /> XÓA SẢN PHẨM
                      </button>
                    </div>

                    <div className="text-right min-w-[120px]">
                      <span className="text-xl font-black text-primary-600 tracking-tighter">
                        {(item.price * item.quantity).toLocaleString()} đ
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Trust Badges Bar */}
              <div className="bg-slate-900 rounded-[2rem] p-8 flex flex-wrap justify-center gap-8 md:gap-16">
                 {[
                   { icon: ShieldCheck, text: "Thanh toán an toàn" },
                   { icon: Truck, text: "Giao hàng tận nơi" },
                   { icon: CreditCard, text: "Hỗ trợ trả góp 0%" }
                 ].map((badge, i) => (
                   <div key={i} className="flex items-center gap-3 text-white">
                      <badge.icon className="text-primary-500" size={20} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{badge.text}</span>
                   </div>
                 ))}
              </div>
            </div>

            {/* Cart Summary */}
            <aside className="lg:col-span-4 sticky top-[150px]">
              <Card className="rounded-[3rem] border-none shadow-2xl shadow-slate-200/50 p-6 md:p-8 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-400 via-primary-600 to-primary-800" />
                <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tighter uppercase">TỔNG ĐƠN HÀNG</h2>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Tạm tính</span>
                    <span className="text-lg font-black text-slate-800">{totalPrice.toLocaleString()} đ</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Phí vận chuyển</span>
                    <span className="text-sm font-black text-primary-600 uppercase tracking-widest">Miễn phí</span>
                  </div>
                  
                  <Divider className="my-0" />
                  
                  <div className="flex justify-between items-end py-4">
                    <span className="text-slate-900 font-black uppercase tracking-widest text-sm">Thanh toán</span>
                    <div className="flex flex-col items-end">
                       <span className="text-3xl font-black text-primary-600 tracking-tighter leading-none">
                        {totalPrice.toLocaleString()} đ
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">(Đã bao gồm thuế)</span>
                    </div>
                  </div>

                  <Link to="/checkout" className="block">
                    <Button 
                      type="primary" 
                      size="large" 
                      className="w-full h-16 rounded-[1.25rem] font-black tracking-[0.2em] shadow-xl shadow-primary-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      THANH TOÁN NGAY
                    </Button>
                  </Link>
                  
                  <div className="pt-6">
                    <p className="text-[10px] text-slate-400 text-center font-medium italic leading-relaxed">
                      "Bằng cách tiến hành thanh toán, bạn đồng ý với các điều khoản và chính sách bảo mật của GreenGo."
                    </p>
                  </div>
                </div>
              </Card>
              
              <div className="mt-8 p-6 bg-primary-50 rounded-[2rem] border border-primary-100 flex items-center gap-4 group cursor-pointer hover:bg-primary-100 transition-all">
                 <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary-600 shadow-sm">
                    <ShoppingBag size={20} />
                 </div>
                 <div>
                    <h4 className="text-xs font-black text-primary-700 uppercase tracking-widest">Ưu đãi hôm nay</h4>
                    <p className="text-[10px] text-primary-600 font-bold">Nhập mã FRESH20 giảm ngay 20k</p>
                 </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
