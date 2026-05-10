import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Input, Breadcrumb } from "antd";
import { Search, ChevronRight, Filter } from "lucide-react";
import ProductList from "./ProductList";

export default function CategoryPage() {
    const { slug } = useParams();
    const category = slug;
    const [search, setSearch] = useState("");

    const categoryNames = {
        fruit: "Trái cây & hạt",
        vegetable: "Rau củ",
        organic: "Bơ & Trứng",
        meat: "Thịt hữu cơ",
        dairy: "Sữa & Kem",
    };

    return (
        <div className="bg-slate-50 min-h-screen mt-[100px] md:mt-[130px]">
            {/* Header / Breadcrumb */}
            <div className="bg-white border-b border-slate-100 py-8">
                <div className="container mx-auto px-4">
                    <Breadcrumb 
                        separator={<ChevronRight size={12} className="text-slate-300" />}
                        className="mb-6"
                        items={[
                            { title: <Link to="/">Trang chủ</Link> },
                            { title: <Link to="/products">Cửa hàng</Link> },
                            { title: <span className="font-bold text-primary-600 uppercase tracking-widest text-[10px]">{categoryNames[category]}</span> }
                        ]}
                    />
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                            <span className="text-primary-600 font-black text-xs uppercase tracking-[0.3em] mb-2 block">Khám phá danh mục</span>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase">{categoryNames[category]}</h1>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <Input 
                                size="large"
                                placeholder="Tìm trong danh mục..." 
                                prefix={<Search size={18} className="text-slate-300 mr-2" />}
                                className="w-full md:w-72 h-14 rounded-2xl bg-slate-50 border-none"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button className="h-14 w-14 flex items-center justify-center bg-slate-900 text-white rounded-2xl hover:bg-primary-600 transition-colors shadow-lg shadow-slate-200">
                                <Filter size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <ProductList
                        search={search}
                        category={category}
                    />
                </motion.div>
            </div>
        </div>
    );
}

