import {
  ShoppingBasket,
  Eye,
  Heart
} from "lucide-react";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { motion } from "framer-motion";
import { Button, Tooltip, Rate } from "antd";
import { CartContext } from "../context/CartContext";
import { getProductImage } from "../utils/imageUtils";
import { setFallbackImage } from "../utils/cloudinary";

export default function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col h-full"
    >
      {/* Sale Badge */}
      {product.sale && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg shadow-red-200">
            GIẢM {product.sale}
          </span>
        </div>
      )}

      {/* Quick Actions */}
      <div className={`absolute top-4 right-4 z-10 flex flex-col gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
        <Tooltip title="Yêu thích" placement="left">
          <Button shape="circle" icon={<Heart size={16} />} className="shadow-lg border-none hover:text-red-500 flex items-center justify-center animate-none" />
        </Tooltip>
        <Tooltip title="Xem nhanh" placement="left">
          <Link to={`/product/${product.id}`}>
            <Button shape="circle" icon={<Eye size={16} />} className="shadow-lg border-none hover:text-green-600 flex items-center justify-center animate-none" />
          </Link>
        </Tooltip>
      </div>

      {/* 1. Product Image */}
      <Link to={`/product/${product.id}`} className="block overflow-hidden relative aspect-square bg-slate-50/50 flex-shrink-0">
        <motion.img
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.6 }}
          src={getProductImage(product.image)}
          alt={product.name}
          loading="lazy"
          onError={(event) => setFallbackImage(event, product.imageFallback)}
          className="w-full h-full object-contain p-4"
        />
        <div className={`absolute inset-0 bg-black/5 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
      </Link>

      {/* Content wrapper */}
      <div className="p-6 flex flex-col flex-grow justify-between gap-4">
        <div className="space-y-2">
          {/* 2. Product Name */}
          <Link to={`/product/${product.id}`} className="block">
            <h3 className="text-sm font-extrabold text-slate-800 hover:text-green-600 transition-colors line-clamp-2 h-10 leading-snug uppercase">
              {product.name}
            </h3>
          </Link>

          {/* 3. Rating */}
          <div className="flex items-center gap-1.5">
            <Rate disabled defaultValue={product.rating || 5} className="text-[9px] text-yellow-400" />
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">(Đánh giá)</span>
          </div>
        </div>

        {/* 4. Price & Add To Cart Button */}
        <div className="space-y-4">
          <div className="flex flex-col min-h-[44px] justify-end">
            {product.oldPrice && (
              <span className="text-xs text-slate-400 line-through font-medium leading-none mb-1">
                {(product.oldPrice || 0).toLocaleString()} đ
              </span>
            )}
            <span className="text-lg font-black text-green-600 tracking-tight leading-none">
              {(product.price || 0).toLocaleString()} <span className="text-xs font-bold">đ</span>
            </span>
          </div>

          <Button
            type="primary"
            size="large"
            icon={<ShoppingBasket size={16} />}
            onClick={handleAddCart}
            className="w-full bg-green-600 hover:bg-green-700 border-none rounded-2xl flex items-center justify-center h-12 text-xs font-bold text-white uppercase tracking-wider transition-colors duration-300"
          >
            Thêm vào giỏ
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
