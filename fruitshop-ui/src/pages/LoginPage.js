import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Form, Input, Button, Divider, Alert } from "antd";
import { User, Lock, ArrowRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";

export default function LoginPage() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const onFinish = async (values) => {
        setError("");
        setLoading(true);
        console.log("LOGIN_PAGE: Form submitted", values.username);
        
        const result = await login(values.username, values.password);
        console.log("LOGIN_PAGE: Login result received", result);
        
        setLoading(false);

        if (result && result.success) {
            const userData = result.data;
            console.log("LOGIN_PAGE: Success! User data:", userData);
            console.log("LOGIN_PAGE: TOKEN:", userData?.token);
            
            toast.success("Chào mừng bạn quay trở lại!");
            
            if (userData.role === "ROLE_ADMIN") {
                console.log("LOGIN_PAGE: Admin detected. Navigating to /admin/dashboard");
                navigate("/admin/dashboard");
            } else {
                console.log("LOGIN_PAGE: Regular user detected. Navigating to /");
                navigate("/");
            }
        } else {
            const msg = result?.message || "Sai tài khoản hoặc mật khẩu";
            console.warn("LOGIN_PAGE: Login failure", msg);
            setError(msg);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary-100 rounded-full blur-[120px] opacity-50" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-green-100 rounded-full blur-[120px] opacity-50" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full z-10"
            >
                <div className="bg-white/80 backdrop-blur-xl p-10 md:p-12 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-white/20">
                    <div className="text-center mb-10">
                        <Link to="/" className="inline-block mb-6">
                            <span className="text-3xl font-black text-primary-600 tracking-tighter">THE MQC</span>
                        </Link>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Chào mừng trở lại</h2>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">Đăng nhập để tiếp tục mua sắm</p>
                    </div>

                    {error && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                            <Alert message={error} type="error" showIcon closable className="rounded-xl font-medium" />
                        </motion.div>
                    )}

                    <Form
                        name="login"
                        onFinish={onFinish}
                        layout="vertical"
                        requiredMark={false}
                        className="space-y-6"
                    >
                        <Form.Item
                            name="username"
                            label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tên tài khoản</span>}
                            rules={[{ required: true, message: 'Vui lòng nhập tài khoản!' }]}
                        >
                            <Input 
                                prefix={<User size={18} className="text-slate-300 mr-2" />} 
                                placeholder="Nhập tên tài khoản của bạn" 
                                className="h-14 rounded-2xl border-slate-100 bg-white/50"
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Mật khẩu</span>}
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                        >
                            <Input.Password 
                                prefix={<Lock size={18} className="text-slate-300 mr-2" />} 
                                placeholder="Nhập mật khẩu" 
                                className="h-14 rounded-2xl border-slate-100 bg-white/50"
                            />
                        </Form.Item>

                        <div className="flex items-center justify-end mb-6">
                            <Link to="/forgot-password" size="small" className="text-xs font-black text-primary-600 uppercase tracking-widest hover:underline">
                                Quên mật khẩu?
                            </Link>
                        </div>

                        <Form.Item className="mb-0">
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                loading={loading}
                                className="w-full h-16 rounded-2xl font-black tracking-[0.2em] shadow-xl shadow-primary-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                ĐĂNG NHẬP <ArrowRight size={18} className="ml-2 inline" />
                            </Button>
                        </Form.Item>
                    </Form>

                    <Divider plain className="my-10 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Hoặc tiếp tục với</Divider>

                    <div className="grid grid-cols-2 gap-4">
                        <Button className="h-12 rounded-xl flex items-center justify-center gap-2 font-bold text-slate-600 border-slate-100 hover:bg-slate-50 transition-all">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" /> Google
                        </Button>
                        <Button className="h-12 rounded-xl flex items-center justify-center gap-2 font-bold text-slate-600 border-slate-100 hover:bg-slate-50 transition-all">
                            <FaGithub size={20} /> GitHub
                        </Button>
                    </div>

                    <p className="text-center mt-12 text-sm font-bold text-slate-400 uppercase tracking-widest">
                        Chưa có tài khoản?{" "}
                        <Link to="/register" className="text-primary-600 font-black hover:underline ml-2">Đăng ký ngay</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
