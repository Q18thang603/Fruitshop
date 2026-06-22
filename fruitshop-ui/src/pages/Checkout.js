import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    CreditCard,
    Truck,
    MapPin,
    Phone,
    User,
    MessageSquare,
    ChevronLeft,
    ShieldCheck,
    Zap
} from "lucide-react";
import { motion } from "framer-motion";
import {
    Form,
    Input,
    Button,
    Card,
    Divider,
    Radio,
    Space
} from "antd";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import api from "../api/axios";

const { TextArea } = Input;

export default function Checkout() {
    const { cartItems, totalPrice } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        if (cartItems.length === 0) {
            toast.error("Giỏ hàng của bạn đang trống!");
            return;
        }

        setLoading(true);
        try {
            await api.post("/orders", values);
            toast.success("Đặt hàng thành công!");
            navigate("/success");
        } catch (error) {
            const msg = error.response?.data?.message || "Đặt hàng thất bại, vui lòng thử lại";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen mt-[100px] md:mt-[130px] py-12 md:py-20">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-4 mb-12">
                    <Link to="/cart" className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm hover:shadow-md transition-all text-slate-400 hover:text-primary-600">
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <span className="text-primary-600 font-black text-[10px] uppercase tracking-[0.3em] mb-1 block">Quy trình cuối cùng</span>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">THANH TOÁN</h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Checkout Form */}
                    <div className="lg:col-span-7">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card className="rounded-[3rem] border-none shadow-2xl shadow-slate-200/50 p-6 md:p-10">
                                <Form
                                    form={form}
                                    layout="vertical"
                                    onFinish={onFinish}
                                    initialValues={{
                                        customerName: user?.username || "",
                                        paymentMethod: "COD"
                                    }}
                                    requiredMark={false}
                                >
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                                            <MapPin size={20} />
                                        </div>
                                        <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">Thông tin giao hàng</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Form.Item
                                            label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest">Họ và tên</span>}
                                            name="customerName"
                                            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                                        >
                                            <Input prefix={<User size={16} className="text-slate-300 mr-2" />} className="rounded-xl h-12 border-slate-100" placeholder="Nguyễn Văn A" />
                                        </Form.Item>

                                        <Form.Item
                                            label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest">Số điện thoại</span>}
                                            name="customerPhone"
                                            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                                        >
                                            <Input prefix={<Phone size={16} className="text-slate-300 mr-2" />} className="rounded-xl h-12 border-slate-100" placeholder="09xx xxx xxx" />
                                        </Form.Item>
                                    </div>

                                    <Form.Item
                                        label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest">Địa chỉ chi tiết</span>}
                                        name="customerAddress"
                                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                                    >
                                        <Input prefix={<MapPin size={16} className="text-slate-300 mr-2" />} className="rounded-xl h-12 border-slate-100" placeholder="Số nhà, tên đường, phường/xã..." />
                                    </Form.Item>

                                    <div className="flex items-center gap-3 mt-12 mb-8">
                                        <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                                            <CreditCard size={20} />
                                        </div>
                                        <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">Phương thức thanh toán</h2>
                                    </div>

                                    <Form.Item name="paymentMethod">
                                        <Radio.Group className="w-full">
                                            <Space direction="vertical" className="w-full gap-4">
                                                <Radio.Button value="COD" className="w-full h-auto p-6 rounded-2xl border-slate-100 flex items-center gap-4 transition-all hover:border-primary-300">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                                                            <Truck size={20} />
                                                        </div>
                                                        <div className="text-left">
                                                            <p className="font-black text-slate-800 leading-none mb-1">COD</p>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Thanh toán khi nhận hàng</p>
                                                        </div>
                                                    </div>
                                                </Radio.Button>
                                                <Radio.Button value="BANK_TRANSFER" className="w-full h-auto p-6 rounded-2xl border-slate-100 flex items-center gap-4 transition-all hover:border-primary-300">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                                                            <CreditCard size={20} />
                                                        </div>
                                                        <div className="text-left">
                                                            <p className="font-black text-slate-800 leading-none mb-1">Chuyển khoản</p>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Chuyển khoản ngân hàng 24/7</p>
                                                        </div>
                                                    </div>
                                                </Radio.Button>
                                            </Space>
                                        </Radio.Group>
                                    </Form.Item>

                                    <Form.Item
                                        label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest">Ghi chú đơn hàng</span>}
                                        name="note"
                                    >
                                        <TextArea prefix={<MessageSquare size={16} className="text-slate-300 mr-2" />} rows={4} className="rounded-2xl border-slate-100 p-4" placeholder="Ví dụ: Giao vào giờ hành chính..." />
                                    </Form.Item>

                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="w-full h-16 rounded-2xl font-black tracking-widest mt-8 shadow-2xl shadow-primary-200"
                                        loading={loading}
                                        disabled={cartItems.length === 0}
                                    >
                                        XÁC NHẬN ĐẶT HÀNG
                                    </Button>
                                </Form>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-[150px] space-y-8">
                            <Card className="rounded-[3rem] border-none shadow-2xl shadow-slate-200/50 p-6 md:p-8 overflow-hidden bg-slate-900 text-white">
                                <div className="absolute top-0 left-0 w-full h-2 bg-primary-600" />
                                <h2 className="text-2xl font-black mb-8 tracking-tighter uppercase">ĐƠN HÀNG CỦA BẠN</h2>

                                <div className="space-y-6 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                                    {cartItems.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-white rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-1 border border-white/10">
                                                <img src={item.image} className="w-full h-full object-contain" alt="" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-black uppercase tracking-tight line-clamp-1">{item.name}</h4>
                                                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mt-1">Số lượng: {item.quantity}</p>
                                            </div>
                                            <span className="text-sm font-black text-primary-400">{(item.price * item.quantity).toLocaleString()} đ</span>
                                        </div>
                                    ))}
                                </div>

                                <Divider className="border-white/10 my-8" />

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm font-bold text-white/50 uppercase tracking-widest">
                                        <span>Tạm tính</span>
                                        <span className="text-white">{totalPrice.toLocaleString()} đ</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-bold text-white/50 uppercase tracking-widest">
                                        <span>Phí vận chuyển</span>
                                        <span className="text-primary-400">Miễn phí</span>
                                    </div>
                                    <Divider className="border-white/10 my-4" />
                                    <div className="flex justify-between items-end">
                                        <span className="font-black uppercase tracking-widest text-sm">Tổng cộng</span>
                                        <div className="text-right">
                                            <span className="text-3xl font-black text-primary-500 tracking-tighter leading-none block">
                                                {totalPrice.toLocaleString()} đ
                                            </span>
                                            <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-1 inline-block">Bao gồm VAT</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-100 flex flex-col gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Bảo mật thông tin</h4>
                                        <p className="text-[10px] text-slate-400 font-medium">Dữ liệu của bạn được mã hóa 256-bit</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center">
                                        <Zap size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Xử lý siêu tốc</h4>
                                        <p className="text-[10px] text-slate-400 font-medium">Đơn hàng được xác nhận sau 5 phút</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}