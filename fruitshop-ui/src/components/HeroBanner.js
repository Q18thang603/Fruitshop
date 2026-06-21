import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "antd";

const bannerImg = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=80";

export default function HeroBanner() {
  return (
    <section className="relative h-[600px] md:h-[700px] flex items-center overflow-hidden bg-slate-900 mt-[100px] md:mt-[130px]">
      {/* Background Image with Parallax-like effect */}
      <motion.div 
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.6 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0"
      >
        <img src={bannerImg} alt="Hero Banner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/60 to-transparent" />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-2 mb-6"
          >
            <span className="bg-primary-600/20 text-primary-400 text-xs font-black px-4 py-1.5 rounded-full border border-primary-500/30 flex items-center gap-2">
              <Sparkles size={14} />
              ORGANIC 100% NATURAL
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tighter"
          >
            SỨC KHỎE TỪ <br />
            <span className="text-primary-500">THIÊN NHIÊN</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-lg"
          >
            Khám phá bộ sưu tập trái cây hữu cơ tươi ngon nhất, được tuyển chọn kỹ lưỡng từ các trang trại đạt chuẩn quốc tế.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="flex flex-wrap gap-4"
          >
            <Button 
              type="primary" 
              size="large" 
              className="h-14 px-8 rounded-2xl flex items-center gap-2 group"
              onClick={() => {
                const el = document.getElementById("products");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              KHÁM PHÁ NGAY
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              ghost 
              size="large" 
              className="h-14 px-8 rounded-2xl border-2 border-white/20 text-white hover:border-white hover:text-white"
              onClick={() => {
                const el = document.getElementById("promotions");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              XEM KHUYẾN MÃI
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Floating Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.3, type: "spring" }}
        className="absolute bottom-20 right-10 md:right-20 hidden lg:flex flex-col items-center justify-center w-32 h-32 bg-white rounded-full shadow-2xl glass-card border-none"
      >
        <span className="text-[10px] font-black text-slate-400">GIẢM ĐẾN</span>
        <strong className="text-3xl font-black text-primary-600 leading-none">25%</strong>
        <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Hôm nay</span>
      </motion.div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-600/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
    </section>
  );
}
