import { motion } from "framer-motion";
import { 
  Leaf, 
  HeartPulse, 
  Apple, 
  ShieldCheck, 
  Droplet,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { Card, Tag, Divider, Button } from "antd";

const articles = [
  {
    icon: Leaf,
    title: "Ăn đủ rau và trái cây giúp bữa ăn cân bằng hơn",
    summary: "Rau và trái cây cung cấp chất xơ, vitamin, khoáng chất và nhiều hợp chất thực vật có lợi. Khi bữa ăn có nhiều màu sắc từ rau củ, cơ thể có thêm nguồn dưỡng chất đa dạng.",
    points: [
      "Ưu tiên rau trong bữa chính và dùng trái cây tươi cho bữa phụ.",
      "Kết hợp nhiều màu như xanh đậm, cam, đỏ, tím để đa dạng dưỡng chất.",
      "Hạn chế thay trái cây nguyên quả bằng nước ép quá thường xuyên."
    ],
    sourceLabel: "WHO: Healthy diet",
    sourceUrl: "https://www.who.int/news-room/fact-sheets/detail/healthy-diet"
  },
  {
    icon: HeartPulse,
    title: "Rau xanh và trái cây có liên quan đến sức khỏe tim mạch",
    summary: "Các hướng dẫn dinh dưỡng thường khuyến khích tăng rau và trái cây vì nhóm thực phẩm này giàu chất xơ, kali, magie và chất chống oxy hóa.",
    points: [
      "Rau lá xanh, bông cải, cải bắp và trái cây họ cam quýt là lựa chọn tốt.",
      "Ăn rau củ nguyên dạng giúp no lâu hơn và hỗ trợ kiểm soát khẩu phần.",
      "Nên dùng rau củ như một phần của lối sống cân bằng."
    ],
    sourceLabel: "Harvard T.H. Chan: Vegetables and Fruits",
    sourceUrl: "https://nutritionsource.hsph.harvard.edu/what-should-you-eat/vegetables-and-fruits/"
  },
  {
    icon: Apple,
    title: "Trái cây tươi là bữa phụ thông minh",
    summary: "Trái cây có vị ngọt tự nhiên, nước và chất xơ, phù hợp cho bữa phụ giữa ngày. Khi dùng đúng lượng, trái cây giúp giảm cảm giác thèm đồ ngọt công nghiệp.",
    points: [
      "Cam cung cấp vị chua ngọt dễ ăn, phù hợp dùng sau bữa chính.",
      "Bơ giàu chất béo không bão hòa, hợp với salad hoặc bánh mì.",
      "Chuối tiện mang theo, phù hợp trước hoặc sau vận động nhẹ."
    ],
    sourceLabel: "CDC: Fruits and vegetables for healthy weight",
    sourceUrl: "https://www.cdc.gov/healthy-weight-growth/healthy-eating/fruits-vegetables.html"
  },
  {
    icon: ShieldCheck,
    title: "Thực phẩm hữu cơ: chọn đúng và dùng an toàn",
    summary: "Thực phẩm hữu cơ thường được chọn vì cách sản xuất hạn chế một số hóa chất nông nghiệp. Cách rửa, bảo quản và chế biến vẫn rất quan trọng.",
    points: [
      "Rửa rau củ dưới vòi nước sạch trước khi chế biến.",
      "Bảo quản thực phẩm tươi ở nhiệt độ phù hợp và dùng sớm.",
      "Kiểm tra nhãn, nguồn gốc và chọn sản phẩm còn tươi."
    ],
    sourceLabel: "Mayo Clinic: Organic foods",
    sourceUrl: "https://www.mayoclinic.org/health/organic-food/NU00255"
  },
  {
    icon: Droplet,
    title: "Nước ép hữu cơ nên dùng như phần bổ sung",
    summary: "Nước ép từ trái cây và rau củ có thể giúp thay đổi khẩu vị, nhưng không nên thay thế hoàn toàn rau củ nguyên miếng.",
    points: [
      "Dùng ly nhỏ, không thêm nhiều đường hoặc sữa đặc.",
      "Kết hợp nước ép với bữa ăn cân bằng thay vì uống thay bữa chính.",
      "Ưu tiên trái cây nguyên quả nếu mục tiêu là bổ sung chất xơ."
    ],
    sourceLabel: "Harvard Health: How many fruits and vegetables",
    sourceUrl: "https://www.health.harvard.edu/diet-and-nutrition/how-many-fruits-and-vegetables-do-we-really-need"
  }
];

export default function News() {
  return (
    <div className="bg-slate-50 min-h-screen mt-[100px] md:mt-[130px] py-12">
      <div className="container mx-auto px-4">
        <header className="max-w-3xl mb-16">
          <span className="text-primary-600 font-black text-xs uppercase tracking-[0.3em] mb-3 block">Tin tức sức khỏe</span>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-6">
            SỐNG KHỎE MỖI NGÀY
          </h1>
          <p className="text-lg text-slate-500 font-medium italic">
            "Các bài viết tóm tắt những nguyên tắc dễ áp dụng trong bữa ăn hằng ngày, kèm nguồn tham khảo từ tổ chức y tế và trường đại học uy tín."
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {articles.map((article, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="rounded-[3rem] border-none shadow-xl shadow-slate-200/50 p-8 md:p-12 h-full flex flex-col group hover:shadow-2xl transition-all duration-500 overflow-hidden">
                <div className="flex items-start gap-6 mb-8">
                  <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 group-hover:scale-110 transition-transform">
                    <article.icon size={32} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-tight group-hover:text-primary-600 transition-colors">
                      {article.title}
                    </h2>
                    <Tag color="green" className="mt-2 rounded-full font-bold uppercase text-[9px] tracking-widest px-3">Cập nhật mới</Tag>
                  </div>
                </div>

                <p className="text-slate-500 leading-relaxed font-medium mb-8">
                  {article.summary}
                </p>

                <div className="space-y-4 mb-10 flex-1">
                   {article.points.map((point, idx) => (
                     <div key={idx} className="flex items-start gap-3">
                        <ChevronRight size={16} className="text-primary-500 mt-1 shrink-0" />
                        <span className="text-sm font-bold text-slate-600">{point}</span>
                     </div>
                   ))}
                </div>

                <Divider className="my-0 border-slate-100" />
                
                <div className="pt-8 flex items-center justify-between">
                  <a 
                    href={article.sourceUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-primary-600 transition-colors uppercase tracking-widest"
                  >
                    Nguồn: {article.sourceLabel}
                    <ExternalLink size={14} />
                  </a>
                  <Button type="link" className="text-primary-600 font-black p-0 h-auto">XEM CHI TIẾT</Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

