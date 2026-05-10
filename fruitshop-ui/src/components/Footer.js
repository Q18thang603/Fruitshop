import { 
    Phone, 
    Mail, 
    MapPin,
    ArrowRight
} from "lucide-react";
import { 
    FaFacebookF, 
    FaInstagram, 
    FaTwitter, 
    FaYoutube 
} from "react-icons/fa6";
import { Link } from "react-router-dom";
import { Button, Input, Divider } from "antd";

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-white pt-24 pb-12 overflow-hidden relative">
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-600/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    
                    {/* Brand Section */}
                    <div className="space-y-8">
                        <div>
                            <Link to="/" className="flex flex-col">
                                <span className="text-3xl font-black text-primary-500 tracking-tighter leading-none">THE MQC</span>
                                <span className="text-[10px] font-bold text-slate-500 tracking-[0.2em] leading-none mt-1 uppercase">Fresh & Natural</span>
                            </Link>
                        </div>
                        <p className="text-slate-400 font-medium leading-relaxed italic">
                            "Sứ mệnh của chúng tôi là mang đến cho mọi gia đình Việt những sản phẩm hữu cơ thuần khiết nhất từ bàn tay người nông dân."
                        </p>
                        <div className="flex gap-4">
                            {[FaFacebookF, FaInstagram, FaTwitter, FaYoutube].map((Icon, i) => (
                                <a key={i} href="/" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-[0.3em] mb-8 text-primary-500">Liên kết nhanh</h4>
                        <ul className="space-y-4">
                            {[
                                { name: 'Trang chủ', path: '/' },
                                { name: 'Sản phẩm', path: '/products' },
                                { name: 'Giới thiệu', path: '/about' },
                                { name: 'Tin tức', path: '/news' },
                                { name: 'Liên hệ', path: '/contact' }
                            ].map((link, i) => (
                                <li key={i}>
                                    <Link to={link.path} className="text-slate-400 hover:text-white flex items-center gap-2 group transition-colors">
                                        <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary-500" />
                                        <span className="font-bold">{link.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-[0.3em] mb-8 text-primary-500">Thông tin liên hệ</h4>
                        <ul className="space-y-6">
                            <li className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 text-primary-500">
                                    <MapPin size={18} />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Địa chỉ</p>
                                    <p className="text-sm font-bold text-slate-200">Hai Bà Trưng, Hà Nội</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 text-primary-500">
                                    <Phone size={18} />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Hotline</p>
                                    <p className="text-sm font-bold text-slate-200">0999 999 999</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 text-primary-500">
                                    <Mail size={18} />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Email</p>
                                    <p className="text-sm font-bold text-slate-200">themqc@fresh.com</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-[0.3em] mb-8 text-primary-500">Bản tin ưu đãi</h4>
                        <p className="text-slate-400 text-sm mb-6 font-medium">Đăng ký để nhận thông tin khuyến mãi và công thức nấu ăn hữu cơ mỗi tuần.</p>
                        <div className="space-y-3">
                            <Input 
                                placeholder="Email của bạn..." 
                                className="h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl"
                            />
                            <Button type="primary" className="w-full h-12 rounded-xl font-black tracking-widest">ĐĂNG KÝ NGAY</Button>
                        </div>
                    </div>
                </div>

                <Divider className="border-white/5 my-0" />

                <div className="pt-12 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                        © 2026 <span className="text-primary-500">THE MQC</span>. ALL RIGHTS RESERVED.
                    </p>
                    <div className="flex gap-8">
                        {['Bảo mật', 'Điều khoản', 'Giao hàng'].map((text, i) => (
                            <a key={i} href="/" className="text-slate-500 hover:text-white text-xs font-black uppercase tracking-widest transition-colors">
                                {text}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}