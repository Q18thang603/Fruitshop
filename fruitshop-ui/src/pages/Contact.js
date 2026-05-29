import { motion } from "framer-motion";
import {
   Phone,
   MapPin,
   Clock,
   Mail,
   Send,
   MessageSquare,
   User,
   Smartphone
} from "lucide-react";
import { Card, Button, Input, Form, Divider } from "antd";

const { TextArea } = Input;

export default function Contact() {
   const onFinish = (values) => {
      console.log("Contact form values:", values);
   };

   return (
      <div className="bg-slate-50 min-h-screen mt-[100px] md:mt-[130px] py-12 md:py-20">
         <div className="container mx-auto px-4">
            <header className="text-center max-w-3xl mx-auto mb-20">
               <span className="text-primary-600 font-black text-xs uppercase tracking-[0.3em] mb-4 block">Kết nối với chúng tôi</span>
               <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-6">
                  LIÊN HỆ THE MQC
               </h1>
               <p className="text-lg text-slate-500 font-medium italic">
                  "Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn mọi lúc, mọi nơi."
               </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
               {/* Contact Info Card */}
               <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="lg:col-span-5"
               >
                  <Card className="rounded-[3rem] border-none shadow-2xl shadow-slate-200/50 p-8 md:p-12 bg-slate-900 text-white overflow-hidden relative">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/20 rounded-full blur-3xl -mr-16 -mt-16" />

                     <h2 className="text-3xl font-black mb-8 tracking-tighter uppercase">Thông tin cửa hàng</h2>
                     <p className="text-slate-400 font-medium mb-12 leading-relaxed">
                        Shop luôn sẵn sàng hỗ trợ khách hàng trong giờ làm việc. Bạn có thể gọi trực tiếp hoặc gửi thông tin qua form bên cạnh.
                     </p>

                     <div className="space-y-10">
                        {[
                           { icon: Phone, label: "Số điện thoại", value: "099 999 999", color: "text-primary-400" },
                           { icon: MapPin, label: "Địa chỉ", value: "Hai Bà Trưng, Hà Nội", color: "text-blue-400" },
                           { icon: Clock, label: "Giờ mở cửa", value: "08:00 - 21:00, T2 - CN", color: "text-orange-400" },
                           { icon: Mail, label: "Email hỗ trợ", value: "hello@the-mqc.vn", color: "text-green-400" }
                        ].map((item, i) => (
                           <div key={i} className="flex items-center gap-6 group">
                              <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                                 <item.icon size={24} />
                              </div>
                              <div>
                                 <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1 block">{item.label}</span>
                                 <strong className="text-lg font-black tracking-tight">{item.value}</strong>
                              </div>
                           </div>
                        ))}
                     </div>

                     <div className="mt-16 pt-10 border-t border-white/5">
                        <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest mb-4">Mạng xã hội</p>
                        <div className="flex gap-4">
                           {/* Placeholder for social icons */}
                           {[1, 2, 3, 4].map(i => (
                              <div key={i} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary-600 transition-colors cursor-pointer">
                                 <span className="text-[10px] font-black">MQC</span>
                              </div>
                           ))}
                        </div>
                     </div>
                  </Card>
               </motion.div>

               {/* Contact Form Card */}
               <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="lg:col-span-7"
               >
                  <Card className="rounded-[3rem] border-none shadow-2xl shadow-slate-200/50 p-8 md:p-12 bg-white">
                     <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center">
                           <MessageSquare size={24} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Gửi lời nhắn</h2>
                     </div>

                     <Form layout="vertical" onFinish={onFinish} requiredMark={false} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <Form.Item
                              label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest">Họ và tên</span>}
                              name="name"
                              rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                           >
                              <Input prefix={<User size={18} className="text-slate-300 mr-2" />} className="h-14 rounded-2xl bg-slate-50 border-none" placeholder="Nguyễn Văn A" />
                           </Form.Item>
                           <Form.Item
                              label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest">Số điện thoại</span>}
                              name="phone"
                              rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                           >
                              <Input prefix={<Smartphone size={18} className="text-slate-300 mr-2" />} className="h-14 rounded-2xl bg-slate-50 border-none" placeholder="09xx xxx xxx" />
                           </Form.Item>
                        </div>

                        <Form.Item
                           label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest">Nội dung cần hỗ trợ</span>}
                           name="message"
                           rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
                        >
                           <TextArea rows={6} className="rounded-3xl bg-slate-50 border-none p-6" placeholder="Chia sẻ với chúng tôi vấn đề của bạn..." />
                        </Form.Item>

                        <Button type="primary" size="large" htmlType="submit" className="w-full h-16 rounded-2xl font-black tracking-widest shadow-xl shadow-primary-200 group">
                           GỬI LIÊN HỆ
                           <Send size={18} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Button>
                     </Form>
                  </Card>
               </motion.div>
            </div>
         </div>
      </div>
   );
}

