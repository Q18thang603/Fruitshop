import { 
  ShoppingBasket, 
  Star, 
  ArrowRight,
  Eye,
  Heart
} from "lucide-react";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
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
      className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100"
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
          <Button shape="circle" icon={<Heart size={16} />} className="shadow-lg border-none hover:text-red-500" />
        </Tooltip>
        <Tooltip title="Xem nhanh" placement="left">
          <Link to={`/product/${product.id}`}>
            <Button shape="circle" icon={<Eye size={16} />} className="shadow-lg border-none hover:text-primary-600" />
          </Link>
        </Tooltip>
      </div>

      <Link to={`/product/${product.id}`} className="block overflow-hidden relative aspect-square">
        <motion.img
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.6 }}
          src={getProductImage(product.image)}
          alt={product.name}
          loading="lazy"
          onError={(event) => setFallbackImage(event, product.imageFallback)}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay on Hover */}
        <div className={`absolute inset-0 bg-black/5 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
      </Link>

      <div className="p-6">
        <div className="mb-2">
          {product.swatches && (
            <div className="flex gap-1.5 mb-3">
              {product.swatches.map((color) => (
                <span
                  key={color}
                  className="w-3 h-3 rounded-full ring-1 ring-offset-2 ring-transparent group-hover:ring-slate-200 transition-all"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
          <Link to={`/product/${product.id}`}>
            <h3 className="text-lg font-bold text-slate-800 hover:text-primary-600 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Rate disabled defaultValue={product.rating || 0} className="text-[10px] text-yellow-400" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">(Đánh giá)</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {product.oldPrice && (
              <span className="text-xs text-slate-400 line-through font-medium mb-0.5">
                {(product.oldPrice || 0).toLocaleString()} đ
              </span>
            )}
            <span className="text-xl font-black text-primary-600 tracking-tight">
              {(product.price || 0).toLocaleString()} <span className="text-sm font-bold">đ</span>
            </span>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleAddCart}
            className="h-12 w-12 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary-100 transition-all"
          >
            <ShoppingBasket size={20} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
