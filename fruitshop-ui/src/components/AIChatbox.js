import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader2, Minus, Maximize2, Sparkles, Heart, Activity, AlertCircle, ShoppingCart, Info } from 'lucide-react';
import { Input } from 'antd';
import { Link } from 'react-router-dom';
import { CartContext } from "../context/CartContext";
import { ProductContext } from "../context/ProductContext";
import { toast } from "react-toastify";
import { getProductImage } from "../utils/imageUtils";
import { setFallbackImage } from "../utils/cloudinary";

// Helper to normalize Vietnamese text
const normalizeText = (text) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .trim();
};

const INTENTS = {
  fruits: {
    keywords: ["trai cay", "hoa qua", "fruit", "trai cay tuoi", "trai cay sach", "trai cay tot cho suc khoe"],
    response: "GreenGo cung cấp các loại trái cây tươi ngon, giàu chất xơ, vitamin và khoáng chất tự nhiên giúp tăng cường sức khỏe tổng thể. Dưới đây là các loại trái cây chất lượng đang có sẵn:",
    searchTerms: [], // Category check
    isCategory: "fruit"
  },
  vegetables: {
    keywords: ["rau", "rau xanh", "rau sach", "rau huu co", "vegetable"],
    response: "Rau xanh là nguồn cung cấp chất xơ và vitamin dồi dào, giúp thanh lọc cơ thể và hỗ trợ hệ tiêu hóa khỏe mạnh. Dưới đây là các loại rau củ hữu cơ tươi ngon tại GreenGo:",
    searchTerms: [], // Category check
    isCategory: "vegetable"
  },
  vitamin_a: {
    keywords: ["vitamin a", "bo mat", "mat yeu", "kho mat", "nhin mo"],
    response: "Vitamin A đóng vai trò quan trọng trong việc bảo vệ thị lực, hỗ trợ hệ miễn dịch và sự phát triển của tế bào. Bạn có thể bổ sung Vitamin A từ các sản phẩm màu cam, đỏ đậm hoặc rau xanh đậm dưới đây:",
    searchTerms: ["ca rot", "bi do", "xoai", "bong cai"]
  },
  vitamin_b: {
    keywords: ["vitamin b", "thieu vitamin b", "met moi", "nang luong"],
    response: "Các vitamin nhóm B (B6, B9, B12...) hỗ trợ quá trình trao đổi chất, cung cấp năng lượng và duy trì hoạt động hệ thần kinh khỏe mạnh. Hãy tham khảo các sản phẩm giàu Vitamin B:",
    searchTerms: ["chuoi", "bo", "khoai lang", "trung", "thit bo"]
  },
  vitamin_c: {
    keywords: ["vitamin c", "tang de khang", "cam cum", "mien dich"],
    response: "Vitamin C là chất chống oxy hóa mạnh mẽ, giúp nâng cao sức đề kháng, bảo vệ thành mạch và hỗ trợ hấp thụ sắt tốt hơn. Tham khảo các sản phẩm giàu Vitamin C có sẵn:",
    searchTerms: ["cam", "kiwi", "dau tay", "chanh", "oi", "bong cai"]
  },
  vitamin_d: {
    keywords: ["vitamin d", "xuong khop", "hap thu canxi"],
    response: "Vitamin D hỗ trợ cơ thể hấp thụ Canxi hiệu quả, giúp xương khớp chắc khỏe và dẻo dai. Dưới đây là các sản phẩm giàu Vitamin D đang có sẵn:",
    searchTerms: ["trung", "sua", "bo"]
  },
  vitamin_e: {
    keywords: ["vitamin e", "dep da", "chong lao hoa"],
    response: "Vitamin E là người bạn tuyệt vời cho làn da, giúp giữ ẩm, chống oxy hóa và làm chậm quá trình lão hóa da tế bào. Các thực phẩm giàu Vitamin E dành cho bạn:",
    searchTerms: ["bo", "bong cai", "hat"]
  },
  weight_loss: {
    keywords: ["giam can", "eat clean", "healthy", "it calo"],
    response: "Để giảm cân lành mạnh, bạn nên chọn các thực phẩm giàu chất xơ, ít calo và tạo cảm giác no lâu. GreenGo gợi ý các thực phẩm hỗ trợ quá trình giảm cân của bạn hiệu quả:",
    searchTerms: ["bo", "bong cai", "bap cai", "ca rot", "dau", "oi", "rau"]
  },
  immune_support: {
    keywords: ["tang de khang", "mien dich", "hay om"],
    response: "Một chế độ ăn uống giàu vitamin C, E và khoáng chất là chìa khóa vàng giúp hệ miễn dịch hoạt động tối ưu, phòng ngừa ốm vặt. Hãy tham khảo sản phẩm bổ trợ hệ miễn dịch sau:",
    searchTerms: ["cam", "oi", "bong cai", "trung"]
  },
  beautiful_skin: {
    keywords: ["dep da", "duong da", "chong lao hoa"],
    response: "Dinh dưỡng từ bên trong giúp làn da luôn căng bóng, khỏe mạnh và tràn đầy sức sống nhờ các axit béo có lợi và chất chống oxy hóa. Tham khảo sản phẩm dưỡng da tự nhiên:",
    searchTerms: ["bo", "cam", "ca rot", "dau tay", "oi"]
  },
  diabetes: {
    keywords: ["tieu duong", "dai thao duong", "duong huyet"],
    response: "Dành cho người tiểu đường, chế độ ăn cần ưu tiên các thực phẩm có chỉ số đường huyết (GI) thấp, giàu xơ để ổn định đường huyết. Dưới đây là thực phẩm phù hợp để tham khảo:",
    searchTerms: ["oi", "buoi", "tao", "bong cai", "bap cai", "dau"],
    isMedical: true
  },
  high_blood_pressure: {
    keywords: ["huyet ap cao", "tim mach"],
    response: "Để hỗ trợ ổn định huyết áp và bảo vệ hệ tim mạch, việc bổ sung kali, chất xơ và giảm muối trong khẩu phần ăn là cực kỳ quan trọng. Các thực phẩm khuyên dùng bổ trợ huyết áp:",
    searchTerms: ["chuoi", "bong cai", "bo", "ca rot", "cam"],
    isMedical: true
  },
  anemia: {
    keywords: ["thieu mau", "chong mat", "hoa mat"],
    response: "Thực phẩm giàu sắt, axit folic và Vitamin C (giúp hấp thụ sắt tốt hơn) rất cần thiết để cải thiện tình trạng thiếu máu. Các sản phẩm hỗ trợ bổ máu đang có sẵn:",
    searchTerms: ["thit bo", "trung", "bong cai", "rau", "cam"],
    isMedical: true
  },
  digestive_health: {
    keywords: ["tao bon", "tieu hoa"],
    response: "Hệ tiêu hóa khỏe mạnh cần lượng chất xơ dồi dào cùng các vitamin để hỗ trợ nhu động ruột và phát triển lợi khuẩn. Mời bạn tham khảo sản phẩm giàu chất xơ:",
    searchTerms: ["chuoi", "khoai lang", "bong cai", "bap cai", "dau"],
    isMedical: true
  },
  best_sellers: {
    keywords: ["ban chay", "san pham hot", "san pham noi bat", "nen mua gi", "toi nen an gi", "goi y cho toi"],
    response: "Dưới đây là các sản phẩm nổi bật và bán chạy nhất tại GreenGo, được nhiều khách hàng tin dùng lựa chọn vì độ tươi ngon vượt trội:",
    searchTerms: ["chuoi", "cam", "bo", "oi", "bong cai", "trung", "thit bo"],
    isPopular: true
  },
  elderly: {
    keywords: ["nguoi gia", "nguoi cao tuoi", "san pham tot cho nguoi gia"],
    response: "Đối với người cao tuổi, các thực phẩm mềm, dễ tiêu hóa, giàu chất chống oxy hóa và tốt cho tim mạch là sự lựa chọn ưu việt nhất. Tham khảo danh sách sản phẩm dinh dưỡng:",
    searchTerms: ["bong cai", "cam", "chuoi", "bo", "khoai lang"],
    isMedical: true
  },
  children: {
    keywords: ["tre em", "cho be", "san pham cho tre em"],
    response: "Trẻ em cần chế độ dinh dưỡng dồi dào năng lượng, vitamin và khoáng chất để phát triển toàn diện cả thể chất lẫn trí tuệ. Các sản phẩm lành tính, dễ ăn và dinh dưỡng cho bé:",
    searchTerms: ["chuoi", "trung", "cam", "bo", "ca rot", "khoai lang"],
    isMedical: true
  },
  pregnant: {
    keywords: ["phu nu mang thai", "me bau", "ba bau", "mang thai"],
    response: "Mẹ bầu cần bổ sung đầy đủ axit folic, sắt, canxi và các vitamin cần thiết cho sự phát triển khỏe mạnh của thai nhi và sức khỏe của mẹ. Các thực phẩm giàu dinh dưỡng cho mẹ bầu:",
    searchTerms: ["bo", "cam", "trung", "bong cai", "thit bo"],
    isMedical: true
  }
};

const SUGGESTIONS = [
  { text: "Bán chạy nhất 🌟", query: "nên mua gì bán chạy" },
  { text: "Rau quả Vitamin C 🍊", query: "sản phẩm giàu vitamin c tăng đề kháng" },
  { text: "Hỗ trợ giảm cân 🥗", query: "eat clean giảm cân tốt" },
  { text: "Tốt cho tiêu hóa 🍠", query: "ăn gì tốt cho tiêu hóa" },
  { text: "Mẹ bầu & Bé 🤰", query: "sản phẩm cho mẹ bầu và bé" },
  { text: "Bổ mắt, Vitamin A 🥕", query: "ăn gì bổ mắt vitamin a" }
];

const AIChatbox = () => {
  const { addToCart } = useContext(CartContext);
  const { products } = useContext(ProductContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Xin chào! Tôi là Trợ lý Dinh dưỡng GreenGo. Tôi có thể tư vấn các loại thực phẩm bổ dưỡng, giàu vitamin, phù hợp với các mục tiêu sức khỏe hoặc tình trạng cơ thể của bạn. Hôm nay bạn muốn tìm hiểu loại thực phẩm nào?",
      sender: 'ai',
      timestamp: new Date(),
      isWelcome: true
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Fuzzy intent matcher
  const matchIntent = (inputText) => {
    const normalizedInput = normalizeText(inputText);
    if (!normalizedInput) return null;

    let bestIntent = null;
    let maxScore = 0;

    Object.entries(INTENTS).forEach(([key, value]) => {
      let score = 0;
      
      // Calculate match score based on matched keyword tokens
      value.keywords.forEach((keyword) => {
        const normKeyword = normalizeText(keyword);
        if (normalizedInput.includes(normKeyword)) {
          // Exact keyword phrase match gives higher score
          score += normKeyword.split(" ").length * 5;
        } else {
          // Token matches
          const keywordTokens = normKeyword.split(" ");
          const matchedTokens = keywordTokens.filter(token => normalizedInput.includes(token));
          if (matchedTokens.length === keywordTokens.length) {
            score += matchedTokens.length * 3;
          } else if (matchedTokens.length > 0) {
            score += matchedTokens.length * 1;
          }
        }
      });

      if (score > maxScore) {
        maxScore = score;
        bestIntent = { key, ...value, score };
      }
    });

    // Require a minimum score threshold for matching
    return maxScore >= 2 ? bestIntent : null;
  };

  const getRecommendations = (matchedIntent) => {
    if (!products || products.length === 0) return [];

    // 1. FILTER PRODUCTS
    // stock > 0 (quantity > 0)
    // active = true (if available)
    let filtered = products.filter(p => {
      const hasStock = p.quantity > 0;
      const isActive = p.active !== false; // Active unless explicitly false
      return hasStock && isActive;
    });

    // 2. MATCH INTENT PRODUCTS
    if (matchedIntent) {
      if (matchedIntent.isCategory) {
        filtered = filtered.filter(p => p.category?.toLowerCase() === matchedIntent.isCategory);
      } else {
        // Match by search terms
        filtered = filtered.filter(p => {
          const normName = normalizeText(p.name);
          const normDesc = normalizeText(p.description);
          return matchedIntent.searchTerms.some(term => {
            const normTerm = normalizeText(term);
            return normName.includes(normTerm) || normDesc.includes(normTerm);
          });
        });
      }
    }

    // 3. SORT PRODUCTS
    // Sort by stock quantity (descending), then rating (descending) if available
    filtered.sort((a, b) => {
      if (b.quantity !== a.quantity) {
        return b.quantity - a.quantity;
      }
      return (b.rating || 0) - (a.rating || 0);
    });

    // Return top 4 recommended items
    return filtered.slice(0, 4);
  };

  const handleSend = (textToSend = null) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    const newUserMessage = {
      id: messages.length + 1,
      text: query,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const matchedIntent = matchIntent(query);
      let responseText = "";
      let recommendations = [];
      let isMedical = false;
      let followUps = [];

      if (matchedIntent) {
        responseText = matchedIntent.response;
        recommendations = getRecommendations(matchedIntent);
        isMedical = matchedIntent.isMedical || false;

        // Dynamic nutrition explanation additions
        if (recommendations.length > 0) {
          responseText += " Các sản phẩm này giàu chất dinh dưỡng tự nhiên và vô cùng có lợi cho sức khỏe của bạn.";
        } else {
          responseText = `Hiện tại GreenGo chưa có sẵn các mặt hàng phục vụ tốt nhất cho nhu cầu này. Tuy nhiên, bạn có thể tham khảo chế độ ăn uống lành mạnh với các loại rau xanh và trái cây khác tại cửa hàng.`;
        }

        // Generate context-aware follow up questions
        if (matchedIntent.key === "weight_loss") {
          followUps = ["Tôi nên ăn gì bổ mắt?", "Sản phẩm tốt cho tim mạch?"];
        } else if (matchedIntent.key === "diabetes") {
          followUps = ["Thực phẩm tốt cho huyết áp cao?", "Trái cây giàu Vitamin C?"];
        } else {
          followUps = ["Sản phẩm bán chạy nhất? 🌟", "Rau quả hữu cơ tốt cho sức khỏe?"];
        }
      } else {
        // Fallback response matching
        const normQuery = normalizeText(query);
        if (normQuery.includes('gia') || normQuery.includes('bao nhieu')) {
          responseText = "Giá của các sản phẩm tại GreenGo luôn được công khai trực tiếp trên từng mặt hàng. Bạn có thể xem chi tiết giá và thêm trực tiếp vào giỏ hàng ngay trong phần hiển thị sản phẩm.";
        } else if (normQuery.includes('ship') || normQuery.includes('giao hang')) {
          responseText = "GreenGo hỗ trợ giao hàng nhanh trong vòng 2 giờ nội thành. Đặc biệt, miễn phí vận chuyển cho tất cả đơn hàng từ 500.000đ trở lên!";
        } else if (normQuery.includes('nguon goc') || normQuery.includes('sach')) {
          responseText = "100% trái cây và rau củ quả tại GreenGo đều có chứng nhận nguồn gốc rõ ràng, đạt chuẩn organic/VietGAP để mang đến sự an tâm tuyệt đối cho sức khỏe gia đình bạn.";
        } else {
          responseText = "GreenGo luôn sẵn sàng tư vấn các giải pháp thực phẩm dinh dưỡng tốt cho cơ thể. Bạn có thể hỏi về các nhóm Vitamin (A, B, C, D, E), mục tiêu sức khỏe (giảm cân, đẹp da, tăng đề kháng), hoặc tình trạng cơ thể (tiểu đường, huyết áp, thiếu máu).";
        }
        followUps = ["Nên mua gì bán chạy? 🌟", "Ăn gì bổ mắt? 🥕"];
      }

      const aiResponse = {
        id: messages.length + 2,
        text: responseText,
        sender: 'ai',
        timestamp: new Date(),
        recommendations: recommendations,
        isMedical: isMedical,
        followUps: followUps
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              height: isMinimized ? '72px' : '620px',
              width: '420px'
            }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="glass-card mb-4 overflow-hidden flex flex-col rounded-3xl shadow-2xl border border-slate-200 bg-white"
            style={{ maxWidth: 'calc(100vw - 48px)' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-sm flex items-center justify-center">
                  <Bot size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm leading-tight text-white flex items-center gap-1.5">
                    Trợ lý Dinh dưỡng
                    <Sparkles size={14} className="text-yellow-300 animate-pulse" />
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
                    <span className="text-[10px] text-green-100 uppercase font-black tracking-wider">Tư vấn sức khỏe</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors bg-transparent border-none text-white cursor-pointer flex items-center justify-center"
                >
                  {isMinimized ? <Maximize2 size={16} /> : <Minus size={16} />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors bg-transparent border-none text-white cursor-pointer flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 flex flex-col">
                  {messages.map((msg) => (
                    <div key={msg.id} className="space-y-2">
                      <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex gap-2.5 max-w-[90%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                          <div className={`flex-shrink-0 w-8.5 h-8.5 rounded-full flex items-center justify-center shadow-sm ${
                            msg.sender === 'user' ? 'bg-green-100 text-green-700' : 'bg-white text-green-600 border border-green-100'
                          }`}>
                            {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                              msg.sender === 'user'
                                ? 'bg-green-600 text-white rounded-tr-none'
                                : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                            }`}>
                              {msg.text}
                              
                              {/* Medical disclaimer inline for AI messages that require it */}
                              {msg.isMedical && (
                                <div className="mt-3 pt-2.5 border-t border-red-100 flex items-start gap-1.5 text-[10px] text-red-500 font-medium">
                                  <AlertCircle size={12} className="shrink-0 mt-0.5" />
                                  <span>Thông tin chỉ mang tính tham khảo, không thay thế tư vấn y tế chuyên nghiệp.</span>
                                </div>
                              )}

                              <div className={`text-[9px] mt-1.5 opacity-60 ${msg.sender === 'user' ? 'text-right text-green-100' : 'text-left text-slate-400'}`}>
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>

                            {/* Welcome Quick Categories (rendered only in first welcome message) */}
                            {msg.isWelcome && (
                              <div className="grid grid-cols-2 gap-2 mt-2 max-w-sm pl-0">
                                <button onClick={() => handleSend("trái cây")} className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-green-50 text-slate-700 hover:text-green-600 rounded-xl border border-slate-100 text-xs font-bold transition-all text-left cursor-pointer">
                                  <Heart size={12} className="text-red-500" /> Trái cây sạch
                                </button>
                                <button onClick={() => handleSend("rau củ")} className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-green-50 text-slate-700 hover:text-green-600 rounded-xl border border-slate-100 text-xs font-bold transition-all text-left cursor-pointer">
                                  <Activity size={12} className="text-green-500" /> Rau củ hữu cơ
                                </button>
                                <button onClick={() => handleSend("tiểu đường")} className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-green-50 text-slate-700 hover:text-green-600 rounded-xl border border-slate-100 text-xs font-bold transition-all text-left cursor-pointer">
                                  <Info size={12} className="text-blue-500" /> Dành cho tiểu đường
                                </button>
                                <button onClick={() => handleSend("giảm cân")} className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-green-50 text-slate-700 hover:text-green-600 rounded-xl border border-slate-100 text-xs font-bold transition-all text-left cursor-pointer">
                                  <Sparkles size={12} className="text-yellow-500" /> Giảm cân an toàn
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Product Recommendation Cards (Standard site style, compact and modern) */}
                      {msg.recommendations && msg.recommendations.length > 0 && (
                        <div className="flex justify-start pl-11 pr-2">
                          <div className="grid grid-cols-2 gap-3 w-full">
                            {msg.recommendations.map((prod) => (
                              <div key={prod.id} className="group bg-white rounded-2xl p-3 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden">
                                {prod.category && (
                                  <span className="absolute top-2 left-2 z-10 bg-green-50 text-green-700 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    {prod.category === 'fruit' ? 'Trái cây' : prod.category === 'vegetable' ? 'Rau củ' : prod.category}
                                  </span>
                                )}
                                
                                <div className="relative aspect-square bg-slate-50 rounded-xl overflow-hidden mb-2.5 p-2 flex items-center justify-center">
                                  <img 
                                    src={getProductImage(prod.image)} 
                                    alt={prod.name} 
                                    onError={(e) => setFallbackImage(e, prod.imageFallback)}
                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                  />
                                </div>
                                
                                <div className="text-left mb-2">
                                  <h4 className="text-[11px] font-black text-slate-800 line-clamp-1 mb-1 uppercase tracking-tight leading-tight">{prod.name}</h4>
                                  <p className="text-xs font-black text-green-600 mb-1">{(prod.price || 0).toLocaleString()} đ</p>
                                  <div className="flex items-center gap-1 text-[9px] text-slate-400 font-semibold">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                    <span>Còn kho: {prod.quantity} kg</span>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-1.5 mt-1">
                                  <Link
                                    to={`/product/${prod.id}`}
                                    onClick={() => setIsOpen(false)}
                                    className="py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-lg text-[9px] text-center uppercase tracking-wider transition-all border border-slate-200/50 cursor-pointer no-underline block"
                                  >
                                    Chi tiết
                                  </Link>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      addToCart(prod);
                                      toast.success(`Đã thêm ${prod.name} vào giỏ hàng!`);
                                    }}
                                    className="py-1.5 bg-green-600 hover:bg-green-700 text-white font-black rounded-lg text-[9px] uppercase tracking-wider transition-all active:scale-95 border-none cursor-pointer flex items-center justify-center gap-0.5"
                                  >
                                    <ShoppingCart size={10} /> Thêm giỏ
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* AI Follow-up Suggestions */}
                      {msg.followUps && msg.followUps.length > 0 && (
                        <div className="flex flex-wrap gap-2 pl-11 mt-1 justify-start">
                          {msg.followUps.map((fu, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSend(fu.replace(/[🥕🍊🌟]/g, "").trim())}
                              className="px-2.5 py-1 bg-green-50 hover:bg-green-100 text-green-700 rounded-full border border-green-200/50 text-[10px] font-bold transition-all cursor-pointer"
                            >
                              {fu}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex gap-2 items-center bg-white p-3.5 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                        <div className="flex gap-1.5">
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Suggestion Chips */}
                <div className="px-4 py-2 border-t border-slate-100 bg-white flex gap-2 overflow-x-auto scrollbar-hide">
                  {SUGGESTIONS.map((chip, index) => (
                    <button
                      key={index}
                      onClick={() => handleSend(chip.query)}
                      className="whitespace-nowrap px-3 py-1.5 bg-slate-50 hover:bg-green-50 text-slate-600 hover:text-green-600 rounded-full border border-slate-100 text-[10px] font-extrabold transition-all cursor-pointer shrink-0"
                    >
                      {chip.text}
                    </button>
                  ))}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-100">
                  <div className="relative flex items-center gap-2">
                    <Input
                      placeholder="Hỏi về dinh dưỡng, giảm cân, tiểu đường..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onPressEnter={() => handleSend()}
                      className="rounded-2xl py-2.5 px-4 border-slate-200 focus:border-green-500 focus:ring-green-500 pr-12 text-xs"
                      bordered={false}
                      style={{ background: '#f8fafc' }}
                    />
                    <button
                      onClick={() => handleSend()}
                      disabled={!inputValue.trim() || isTyping}
                      className={`absolute right-1.5 p-2 rounded-xl transition-all border-none flex items-center justify-center cursor-pointer ${
                        inputValue.trim() && !isTyping
                          ? 'bg-green-600 text-white shadow-md shadow-green-200'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {isTyping ? <Loader2 size={18} className="animate-spin text-slate-400" /> : <Send size={18} />}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 text-center flex items-center justify-center gap-1">
                    <AlertCircle size={10} /> Trợ lý Dinh dưỡng cung cấp thông tin tham khảo.
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
        }}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 border-none cursor-pointer ${
          isOpen ? 'bg-white text-green-600 rotate-90 scale-0 opacity-0 pointer-events-none' : 'bg-green-600 text-white'
        }`}
      >
        <MessageCircle size={28} />
      </motion.button>
    </div>
  );
};

export default AIChatbox;
