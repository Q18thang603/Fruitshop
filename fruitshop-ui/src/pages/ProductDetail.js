import { Link, useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { 
  ChevronRight, 
  Heart, 
  Share2,
  ShieldCheck,
  Truck,
  RotateCcw,
  Minus,
  Plus,
  ShoppingBag
} from "lucide-react";
import { 
  FaFacebookF, 
  FaTwitter, 
  FaLinkedinIn 
} from "react-icons/fa6";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Breadcrumb, Button, InputNumber, Rate, Tag, Divider, Spin } from "antd";
import { CartContext } from "../context/CartContext";
import api from "../api/axios";
import { getProductImage } from "../utils/imageUtils";
import { setFallbackImage } from "../utils/cloudinary";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/${id}`);
        if (response.data.success) {
          setProduct(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Không thể tải thông tin sản phẩm");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white mt-[130px]">
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white mt-[130px] p-4 text-center">
        <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tighter">KHÔNG TÌM THẤY SẢN PHẨM</h2>
        <Link to="/products">
          <Button type="primary" size="large" className="rounded-xl h-12 px-8">Quay lại cửa hàng</Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="bg-white min-h-screen mt-[100px] md:mt-[130px]">
      {/* Breadcrumb Section */}
      <div className="bg-slate-50 py-6">
        <div className="container mx-auto px-4">
          <Breadcrumb 
            separator={<ChevronRight size={12} className="text-slate-300" />}
            items={[
              { title: <Link to="/">Trang chủ</Link> },
              { title: <Link to="/products">Cửa hàng</Link> },
              { title: <Link to={`/category/${product.category || 'all'}`}>{product.categoryLabel || 'Sản phẩm'}</Link> },
              { title: <span className="font-bold text-primary-600">{product.name}</span> }
            ]}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Gallery Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-slate-50 group border border-slate-100">
               <motion.img
                key={id}
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                src={getProductImage(product.image)}
                alt={product.name}
                loading="lazy"
                onError={(event) => setFallbackImage(event, product.imageFallback)}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {product.sale && (
                <div className="absolute top-8 left-8">
                  <span className="bg-red-500 text-white text-xs font-black px-4 py-2 rounded-full shadow-xl shadow-red-200 uppercase tracking-widest">
                    GIẢM {product.sale}
                  </span>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${i === 1 ? 'border-primary-500 scale-95 shadow-lg' : 'border-transparent hover:border-primary-200 opacity-60 hover:opacity-100'}`}>
                  <img src={getProductImage(product.image)} className="w-full h-full object-cover" loading="lazy" alt="" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="mb-6 flex items-center gap-3">
              <Tag color="success" className="rounded-full border-none px-4 py-1 font-black text-[10px] uppercase tracking-widest bg-primary-100 text-primary-700">CÒN HÀNG</Tag>
              <div className="flex items-center gap-2">
                 <Rate disabled defaultValue={4.5} className="text-xs text-yellow-400" />
                 <span className="text-xs font-black text-slate-400 uppercase tracking-widest">(24 Đánh giá)</span>
              </div>
            </div>

            <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter leading-tight uppercase">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-8">
              {product.oldPrice && (
                <span className="text-2xl text-slate-300 line-through font-bold">
                  {(product.oldPrice || 0).toLocaleString()} đ
                </span>
              )}
              <span className="text-4xl font-black text-primary-600 tracking-tighter">
                {(product.price || 0).toLocaleString()} đ
              </span>
            </div>

            <p className="text-slate-500 text-lg leading-relaxed mb-10 font-medium italic">
              "{product.description || "Sản phẩm hữu cơ đạt chuẩn quốc tế, mang lại giá trị dinh dưỡng cao nhất cho sức khỏe gia đình bạn. Được thu hoạch thủ công và bảo quản nghiêm ngặt."}"
            </p>

            <Divider className="my-0 border-slate-100" />

            {/* Purchase Controls */}
            <div className="py-10 space-y-8">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center bg-slate-50 p-2 rounded-2xl border border-slate-100">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-md transition-all text-slate-600"
                  >
                    <Minus size={18} />
                  </button>
                  <InputNumber
                    min={1}
                    value={quantity}
                    onChange={setQuantity}
                    bordered={false}
                    className="w-16 font-black text-center text-lg"
                    controls={false}
                  />
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-md transition-all text-slate-600"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                <Button 
                  type="primary" 
                  size="large" 
                  className="h-[64px] px-10 rounded-2xl font-black text-sm tracking-widest flex items-center gap-3 flex-1 min-w-[240px] shadow-2xl shadow-primary-200"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag size={20} />
                  THÊM VÀO GIỎ HÀNG
                </Button>
                
                <Button 
                  shape="circle" 
                  className="w-14 h-14 flex items-center justify-center rounded-2xl hover:text-red-500 border-slate-100 hover:border-red-100"
                >
                  <Heart size={20} />
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 border-t border-slate-50 pt-10">
                {[
                  { icon: ShieldCheck, text: "Cam kết 100% hữu cơ" },
                  { icon: Truck, text: "Giao hàng trong 24h" },
                  { icon: RotateCcw, text: "Đổi trả tận nơi" }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center text-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-primary-600">
                      <item.icon size={20} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <Divider className="my-0 border-slate-100" />

            {/* Meta Info */}
            <div className="py-8 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] w-24">Mã SKU:</span>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-widest">{product.sku || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] w-24">Danh mục:</span>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-widest">{product.categoryLabel}, {product.groupLabel}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] w-24">Chia sẻ:</span>
                <div className="flex items-center gap-3">
                  {[FaFacebookF, FaTwitter, FaLinkedinIn, Share2].map((Icon, i) => (
                    <button key={i} className="text-slate-400 hover:text-primary-600 transition-colors">
                      <Icon size={16} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Detailed Tabs Section */}
        <div className="mt-32">
          <div className="flex justify-center border-b border-slate-100 gap-12 mb-12">
            {['description', 'reviews', 'shipping'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-xs font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === tab ? 'text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {tab === 'description' ? 'Mô tả chi tiết' : tab === 'reviews' ? 'Đánh giá khách hàng' : 'Giao hàng & đổi trả'}
                {activeTab === tab && (
                  <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-primary-600 rounded-full" />
                )}
              </button>
            ))}
          </div>

          <div className="max-w-4xl mx-auto min-h-[200px]">
             <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-slate-600 leading-relaxed font-medium"
                >
                  {activeTab === 'description' ? (
                    <div className="space-y-6 text-center lg:text-left">
                       <p className="text-lg italic text-slate-400 leading-relaxed">
                          Sản phẩm được canh tác theo phương pháp hữu cơ bền vững, không sử dụng phân bón hóa học hay thuốc trừ sâu độc hại. 
                          Mỗi sản phẩm là tinh hoa của đất trời, mang đến hương vị thuần khiết nhất cho bữa ăn của gia đình bạn.
                       </p>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                          <div className="bg-slate-50 p-8 rounded-3xl">
                             <h4 className="text-slate-900 font-black mb-4 uppercase tracking-widest text-sm">Nguồn gốc xuất xứ</h4>
                             <p className="text-sm">Trang trại hữu cơ Organic Farm - Đà Lạt, Lâm Đồng. Đạt chuẩn chứng nhận hữu cơ quốc tế (USDA, EU Organic).</p>
                          </div>
                          <div className="bg-slate-50 p-8 rounded-3xl">
                             <h4 className="text-slate-900 font-black mb-4 uppercase tracking-widest text-sm">Bảo quản & Sử dụng</h4>
                             <p className="text-sm">Bảo quản trong ngăn mát tủ lạnh (4-8 độ C). Sử dụng tốt nhất trong vòng 3-5 ngày sau khi thu hoạch.</p>
                          </div>
                       </div>
                    </div>
                  ) : activeTab === 'reviews' ? (
                    <div className="text-center py-12">
                       <Rate disabled defaultValue={5} className="text-2xl text-yellow-400 mb-4" />
                       <p className="text-lg font-black text-slate-800 mb-2 uppercase tracking-tighter">Sản phẩm tuyệt vời!</p>
                       <p className="text-slate-400">Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên trải nghiệm!</p>
                       <Button type="primary" className="mt-6 rounded-xl font-bold">VIẾT ĐÁNH GIÁ</Button>
                    </div>
                  ) : (
                    <div className="bg-primary-50 p-12 rounded-[3rem] border border-primary-100">
                       <h3 className="text-2xl font-black text-primary-700 mb-6 uppercase tracking-tighter">CHÍNH SÁCH GIAO HÀNG</h3>
                       <p className="mb-4">Chúng tôi cung cấp dịch vụ giao hàng siêu tốc trong vòng 2h đối với khu vực nội thành. Các đơn hàng ngoại thành sẽ được giao trong vòng 24h.</p>
                       <p className="font-bold text-primary-800 underline decoration-primary-200">Miễn phí giao hàng cho đơn hàng trên 500.000đ.</p>
                    </div>
                  )}
                </motion.div>
             </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
