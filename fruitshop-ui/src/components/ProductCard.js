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

export default function ProductCard({ product, layout = "vertical" }) {
  const { addToCart } = useContext(CartContext);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  if (layout === "horizontal") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -4 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative bg-white rounded-3xl p-4 flex items-center gap-4 border border-slate-100 hover:shadow-xl transition-all duration-300 min-h-[150px] w-full"
      >
        {/* Left: Product Image Box (Never cropped, centered) */}
        <Link to={`/product/${product.id}`} className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-slate-50 rounded-2xl flex items-center justify-center overflow-hidden relative p-2">
          <motion.img
            animate={{ scale: isHovered ? 1.08 : 1 }}
            transition={{ duration: 0.5 }}
            src={getProductImage(product.image)}
            alt={product.name}
            loading="lazy"
            onError={(event) => setFallbackImage(event, product.imageFallback)}
            className="w-full h-full object-contain"
          />
          {product.sale && (
            <div className="absolute top-1.5 left-1.5 z-10">
              <span className="bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm">
                {product.sale}
              </span>
            </div>
          )}
        </Link>

        {/* Right: Info and Actions */}
        <div className="flex-1 flex flex-col justify-between text-left h-full min-w-0">
          <div>
            <Link to={`/product/${product.id}`}>
              <h3 className="text-sm sm:text-base font-black text-slate-800 hover:text-primary-650 transition-colors line-clamp-1 mb-1 leading-tight">
                {product.name}
              </h3>
            </Link>

            {/* Stars Rating */}
            <div className="flex items-center gap-1 mb-2">
              <Rate disabled defaultValue={product.rating || 5} className="text-[10px] text-yellow-400" />
              <span className="text-[9px] font-bold text-slate-400">({product.ratingCount || 120})</span>
            </div>

            {/* Price */}
            <div className="flex flex-col">
              {product.oldPrice && (
                <span className="text-[10px] text-slate-400 line-through font-semibold leading-none mb-0.5">
                  {(product.oldPrice || 0).toLocaleString()} đ
                </span>
              )}
              <span className="text-sm sm:text-base font-black text-primary-600 tracking-tight leading-none">
                {(product.price || 0).toLocaleString()} <span className="text-[10px] font-bold text-slate-500">đ/kg</span>
              </span>
            </div>
          </div>

          {/* Add to Cart button */}
          <div className="mt-3">
            <button
              onClick={handleAddCart}
              className="w-full h-9 bg-primary-600 hover:bg-primary-700 text-white text-xs font-black rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
            >
              <ShoppingBasket size={14} />
              Thêm vào giỏ
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Default Vertical Layout
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

<<<<<<< HEAD
      {/* 1. Product Image */}
      <Link to={`/product/${product.id}`} className="block overflow-hidden relative aspect-square bg-slate-50/50 flex-shrink-0">
=======
      {/* Product Image Area (object-contain with padding to ensure it is never cropped) */}
      <Link to={`/product/${product.id}`} className="block overflow-hidden relative aspect-square bg-slate-50 p-4">
>>>>>>> 387baad (update homepage and product UI)
        <motion.img
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.6 }}
          src={getProductImage(product.image)}
          alt={product.name}
          loading="lazy"
          onError={(event) => setFallbackImage(event, product.imageFallback)}
<<<<<<< HEAD
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
=======
          className="w-full h-full object-contain"
        />
        {/* Overlay on Hover */}
        <div className={`absolute inset-0 bg-black/5 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
      </Link>

      {/* Info Content Area */}
      <div className="p-6 flex flex-col justify-between flex-grow">
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
>>>>>>> 387baad (update homepage and product UI)
              {product.name}
            </h3>
          </Link>

          {/* 3. Rating */}
          <div className="flex items-center gap-1.5">
            <Rate disabled defaultValue={product.rating || 5} className="text-[9px] text-yellow-400" />
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">(Đánh giá)</span>
          </div>
        </div>

<<<<<<< HEAD
        {/* 4. Price & Add To Cart Button */}
        <div className="space-y-4">
          <div className="flex flex-col min-h-[44px] justify-end">
=======
        <div className="flex items-center gap-2 mb-4">
          <Rate disabled defaultValue={product.rating || 5} className="text-[10px] text-yellow-400" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">(Đánh giá)</span>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col text-left">
>>>>>>> 387baad (update homepage and product UI)
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
