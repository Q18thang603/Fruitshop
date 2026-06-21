import { motion } from "framer-motion";
import { 
  Leaf, 
  Sprout, 
  Store, 
  Truck, 
  ArrowRight,
  ShieldCheck,
  Users,
  Award
} from "lucide-react";
import { Button, Divider } from "antd";
import { Link } from "react-router-dom";

export default function About() {
  const values = [
    {
      icon: Leaf,
      title: "Thực phẩm sạch",
      text: "Nguồn hàng được chọn lọc kỹ càng với tiêu chí tươi ngon, rõ nguồn gốc và an toàn cho sức khỏe.",
      color: "bg-green-50 text-green-600"
    },
    {
      icon: Sprout,
      title: "Tươi mới mỗi ngày",
      text: "Sản phẩm được nhập mới liên tục và bảo quản đúng tiêu chuẩn để giữ hương vị tự nhiên.",
      color: "bg-orange-50 text-orange-600"
    },
    {
      icon: Truck,
      title: "Giao hàng nhanh",
      text: "Đóng gói cẩn thận và giao tận nơi giúp khách hàng mua sắm thuận tiện hơn.",
      color: "bg-blue-50 text-blue-600"
    }
  ];

  return (
    <div className="bg-white min-h-screen mt-[100px] md:mt-[130px]">
      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] flex items-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=80" 
            alt="Organic Farm" 
            className="w-full h-full object-cover opacity-40" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/60 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-2xl"
          >
            <span className="bg-primary-600/20 text-primary-400 text-xs font-black px-4 py-1.5 rounded-full border border-primary-500/30 mb-6 inline-block uppercase tracking-widest">
              Câu chuyện thương hiệu
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tighter">
              SỨC KHỎE TỪ <br />
              <span className="text-primary-500 text-gradient bg-clip-text">THIÊN NHIÊN</span>
            </h1>
            <p className="text-lg text-slate-300 mb-10 leading-relaxed font-medium">
              GreenGo cung cấp trái cây, rau củ và thực phẩm hữu cơ chất lượng cao với trải nghiệm mua sắm hiện đại, nhanh chóng và tiện lợi cho mọi gia đình.
            </p>
            <Link to="/products">
              <Button type="primary" size="large" className="h-14 px-10 rounded-2xl font-black tracking-widest flex items-center gap-2 group shadow-2xl shadow-primary-500/20">
                KHÁM PHÁ CỬA HÀNG
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-primary-600 font-black text-xs uppercase tracking-[0.3em] mb-4 block">Giá trị cốt lõi</span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tighter">CAM KẾT CHẤT LƯỢNG</h2>
          <p className="text-slate-500 font-medium italic">"Chúng tôi tin rằng thực phẩm sạch là nền tảng cho một cuộc sống hạnh phúc."</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-slate-50 p-10 rounded-[3rem] text-center border border-slate-100 hover:bg-white hover:shadow-2xl transition-all duration-500 group"
            >
              <div className={`w-20 h-20 mx-auto ${item.color} rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                <item.icon size={36} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-4 tracking-tight uppercase">{item.title}</h3>
              <p className="text-slate-500 leading-relaxed font-medium">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square rounded-[4rem] overflow-hidden border-8 border-white/5"
            >
              <img 
                src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1000&q=80" 
                alt="Farmer" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-primary-600/20 backdrop-blur-[2px]" />
            </motion.div>

            <div className="space-y-8">
              <span className="text-primary-500 font-black text-xs uppercase tracking-[0.3em]">Sứ mệnh của chúng tôi</span>
              <h2 className="text-5xl font-black tracking-tighter leading-tight">MANG THỰC PHẨM HỮU CƠ ĐẾN GẦN HƠN</h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Chúng tôi xây dựng Fruitshop với mong muốn giúp mọi gia đình dễ dàng tiếp cận thực phẩm sạch, minh bạch và chất lượng cao. Website tập trung vào trải nghiệm đơn giản, hiện đại và thuận tiện để khách hàng có thể tìm kiếm, đặt hàng và theo dõi đơn hàng dễ dàng.
              </p>
              
              <div className="grid grid-cols-2 gap-8 pt-6">
                <div className="space-y-2">
                  <div className="text-primary-500 font-black text-3xl">15k+</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Khách hàng tin dùng</div>
                </div>
                <div className="space-y-2">
                  <div className="text-primary-500 font-black text-3xl">100%</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nguồn gốc hữu cơ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Decoration */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-600/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
      </section>

      {/* Partners Section */}
      <section className="py-24 container mx-auto px-4 text-center">
        <Divider className="border-slate-100" />
        <div className="flex flex-wrap justify-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-700 mt-12">
          <ShieldCheck size={60} />
          <Users size={60} />
          <Store size={60} />
          <Award size={60} />
          <Leaf size={60} />
        </div>
      </section>
    </div>
  );
}