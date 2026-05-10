import { useContext } from "react";
import { ProductContext } from "../context/ProductContext";
import ProductCard from "../components/ProductCard";

export default function ProductList({
  search = "",
  category = "all",
}) {
  const { products, loading, error } = useContext(ProductContext);

  // REMOVE VIETNAMESE ACCENTS

  const normalizeText = (text) => {
    if (!text) return "";
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  // FILTER PRODUCTS

  const filteredProducts = (products || []).filter(
    (product) => {
      if (!product) return false;

      const productName = product.name || "";
      const productCategory = product.category || "";

      const matchSearch =
        normalizeText(productName)
          .includes(
            normalizeText(search || "")
          );

      const matchCategory =
        category === "all"
          ? true
          : productCategory.toLowerCase() === category.toLowerCase();

      return (
        matchSearch &&
        matchCategory
      );
    }
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border border-slate-50">
        <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin mb-4" />
        <span className="text-slate-400 font-black text-xs uppercase tracking-[0.3em]">Đang tải sản phẩm...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-8 rounded-[3rem] border border-red-100 text-center">
        <p className="text-red-600 font-bold mb-0">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={`product-${product.id}`}
              product={product}
            />
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 py-24 rounded-[3rem] border border-slate-100 text-center">
           <h2 className="text-2xl font-black text-slate-400 uppercase tracking-tighter">KHÔNG TÌM THẤY SẢN PHẨM PHÙ HỢP</h2>
           <p className="text-slate-400 text-sm mt-2">Vui lòng thử lại với từ khóa hoặc danh mục khác</p>
        </div>
      )}
    </div>
  );
}
