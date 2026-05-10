import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Package, 
  LogOut, 
  Clock, 
  MapPin, 
  CreditCard,
  Settings,
  ChevronRight,
  ShoppingBag
} from "lucide-react";
import { Tag, Button, Card, Divider, Empty, Spin } from "antd";

const STATUS_CONFIG = {
    PENDING: { label: "Chờ xác nhận", color: "orange", bg: "bg-orange-50", text: "text-orange-600" },
    PROCESSING: { label: "Đang xử lý", color: "blue", bg: "bg-blue-50", text: "text-blue-600" },
    COMPLETED: { label: "Hoàn thành", color: "success", bg: "bg-green-50", text: "text-green-600" },
    CANCELLED: { label: "Đã hủy", color: "error", bg: "bg-red-50", text: "text-red-600" }
};

export default function Profile() {
    const { user, logout } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("orders");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get("/orders/my-orders");
            if (res.data.success) {
                setOrders(res.data.data);
            }
        } catch (e) {
            console.error("Failed to fetch orders", e);
        } finally {
            setLoading(false);
        }
    };

    const sidebarItems = [
        { key: "orders", icon: Package, label: "Đơn hàng của tôi" },
        { key: "info", icon: User, label: "Thông tin tài khoản" },
        { key: "settings", icon: Settings, label: "Cài đặt" },
    ];

    return (
        <div className="bg-slate-50 min-h-screen mt-[100px] md:mt-[130px] py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Sidebar */}
                    <aside className="lg:col-span-3 sticky top-[150px]">
                        <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/50 overflow-hidden p-6">
                            <div className="flex flex-col items-center text-center mb-8">
                                <div className="w-24 h-24 bg-primary-50 rounded-[2rem] flex items-center justify-center text-primary-600 mb-4 border-4 border-white shadow-lg">
                                    <User size={40} />
                                </div>
                                <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase leading-none mb-1">{user?.username}</h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    {user?.role === "ROLE_ADMIN" ? "Quản trị viên" : "Khách hàng thân thiết"}
                                </p>
                            </div>

                            <nav className="space-y-2">
                                {sidebarItems.map((item) => (
                                    <button
                                        key={item.key}
                                        onClick={() => setActiveTab(item.key)}
                                        className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all font-bold text-sm ${activeTab === item.key ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon size={18} />
                                            <span>{item.label}</span>
                                        </div>
                                        <ChevronRight size={14} className={activeTab === item.key ? 'opacity-100' : 'opacity-0'} />
                                    </button>
                                ))}
                                <Divider className="my-4" />
                                <button 
                                    onClick={logout}
                                    className="w-full flex items-center gap-3 p-4 rounded-2xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-all font-bold text-sm"
                                >
                                    <LogOut size={18} />
                                    <span>Đăng xuất</span>
                                </button>
                            </nav>
                        </Card>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-9">
                        <AnimatePresence mode="wait">
                            {activeTab === "orders" ? (
                                <motion.div
                                    key="orders"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Lịch sử đơn hàng</h3>
                                        <Tag color="blue" className="rounded-full px-4 py-1 font-bold">{orders.length} Đơn hàng</Tag>
                                    </div>

                                    {loading ? (
                                        <div className="flex justify-center py-20"><Spin size="large" /></div>
                                    ) : orders.length === 0 ? (
                                        <Card className="rounded-[3rem] p-12 text-center border-none shadow-xl shadow-slate-200/50">
                                            <Empty 
                                                description={<span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Bạn chưa có đơn hàng nào</span>}
                                            >
                                                <Link to="/products">
                                                    <Button type="primary" size="large" className="h-12 px-8 rounded-xl font-bold mt-4">Mua sắm ngay</Button>
                                                </Link>
                                            </Empty>
                                        </Card>
                                    ) : (
                                        <div className="grid grid-cols-1 gap-6">
                                            {orders.map((order) => {
                                                const status = STATUS_CONFIG[order.status] || { label: order.status, color: "default", bg: "bg-slate-50", text: "text-slate-500" };
                                                return (
                                                    <motion.div
                                                        key={order.id}
                                                        whileHover={{ y: -4 }}
                                                        className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-100 border border-slate-50 overflow-hidden relative group"
                                                    >
                                                        <div className={`absolute top-0 right-0 px-8 py-2 rounded-bl-3xl ${status.bg} ${status.text} text-[10px] font-black uppercase tracking-[0.2em]`}>
                                                            {status.label}
                                                        </div>
                                                        
                                                        <div className="flex flex-col md:flex-row justify-between gap-8">
                                                            <div className="space-y-4 flex-1">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                                                        <Package size={20} />
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="text-lg font-black text-slate-800 tracking-tight leading-none mb-1">Đơn hàng #{order.id}</h4>
                                                                        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                                            <span className="flex items-center gap-1"><Clock size={12} /> {new Date(order.createdAt).toLocaleDateString("vi-VN")}</span>
                                                                            <span className="flex items-center gap-1"><CreditCard size={12} /> {order.paymentMethod}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="flex flex-wrap gap-2 py-2">
                                                                    {order.items?.map((item, idx) => (
                                                                        <span key={idx} className="bg-slate-50 text-slate-500 px-3 py-1.5 rounded-full text-[10px] font-bold border border-slate-100">
                                                                            {item.product?.name} <span className="text-primary-600">x{item.quantity}</span>
                                                                        </span>
                                                                    ))}
                                                                </div>

                                                                <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500 bg-slate-50 w-fit px-4 py-2 rounded-xl">
                                                                    <MapPin size={14} className="text-primary-500" />
                                                                    <span>{order.customerAddress}</span>
                                                                </div>
                                                            </div>

                                                            <div className="flex flex-col justify-between items-end min-w-[150px]">
                                                                <div className="text-right">
                                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Tổng thanh toán</p>
                                                                    <p className="text-3xl font-black text-primary-600 tracking-tighter leading-none">{order.totalAmount?.toLocaleString()} đ</p>
                                                                </div>
                                                                <Button className="rounded-xl font-bold border-slate-100 hover:border-primary-600 hover:text-primary-600 mt-4">Chi tiết</Button>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </motion.div>
                            ) : activeTab === "info" ? (
                                <motion.div
                                    key="info"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-8">Thông tin tài khoản</h3>
                                    <Card className="rounded-[3rem] border-none shadow-xl shadow-slate-200/50 p-8 md:p-12 overflow-hidden bg-white">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                            <div className="space-y-8">
                                                <div>
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 block">Tên đăng nhập</label>
                                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center gap-4">
                                                        <User size={20} className="text-primary-500" />
                                                        <span className="text-lg font-black text-slate-800 tracking-tight">{user?.username}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 block">Vai trò thành viên</label>
                                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center gap-4">
                                                        <Settings size={20} className="text-primary-500" />
                                                        <span className="text-lg font-black text-slate-800 tracking-tight">
                                                            {user?.role === "ROLE_ADMIN" ? "QUẢN TRỊ VIÊN" : "KHÁCH HÀNG THÂN THIẾT"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-primary-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden flex flex-col justify-between">
                                                <div className="relative z-10">
                                                    <ShoppingBag size={40} className="text-primary-500 mb-6" />
                                                    <h4 className="text-2xl font-black tracking-tight mb-2 uppercase">Chào mừng trở lại!</h4>
                                                    <p className="text-primary-100/60 font-medium italic text-sm leading-relaxed">
                                                        Cảm ơn bạn đã đồng hành cùng The MQC. Chúng tôi luôn nỗ lực mang đến những sản phẩm hữu cơ tươi ngon nhất cho gia đình bạn.
                                                    </p>
                                                </div>
                                                <div className="mt-12 relative z-10">
                                                    <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest mb-2">Thẻ thành viên</p>
                                                    <p className="text-2xl font-black tracking-widest">#{user?.id?.toString().padStart(6, '0')}</p>
                                                </div>
                                                {/* Decorative background circle */}
                                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary-600/20 rounded-full blur-3xl" />
                                            </div>
                                        </div>
                                        
                                        <Divider className="my-12" />
                                        
                                        <div className="flex justify-end">
                                            <Button type="primary" size="large" className="h-14 px-10 rounded-2xl font-black tracking-widest shadow-xl shadow-primary-200">
                                                CẬP NHẬT THÔNG TIN
                                            </Button>
                                        </div>
                                    </Card>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="settings"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="text-center py-20"
                                >
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-4">Cài đặt</h3>
                                    <p className="text-slate-400 font-medium">Tính năng đang được phát triển...</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </main>
                </div>
            </div>
        </div>
    );
}