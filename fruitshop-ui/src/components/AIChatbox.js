import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader2, Minus, Maximize2 } from 'lucide-react';
import { Input } from 'antd';

const AIChatbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Xin chào! Tôi là trợ lý ảo của GreenGo. Tôi có thể giúp gì cho bạn hôm nay?", sender: 'ai', timestamp: new Date() }
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

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newUserMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, newUserMessage]);
    setInputValue('');
    setIsTyping(true);

    // Mock AI Response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        text: getMockResponse(inputValue),
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getMockResponse = (input) => {
    const text = input.toLowerCase();
    if (text.includes('giá') || text.includes('bao nhiêu')) return "Giá của các sản phẩm luôn được cập nhật mới nhất trên trang web. Bạn có thể xem chi tiết ở mục 'Sản phẩm' nhé!";
    if (text.includes('ship') || text.includes('giao hàng')) return "GreenGo hỗ trợ giao hàng nhanh trong vòng 2h tại khu vực nội thành. Đơn hàng trên 500k sẽ được miễn phí vận chuyển!";
    if (text.includes('tươi') || text.includes('nguồn gốc')) return "Tất cả trái cây tại GreenGo đều được nhập trực tiếp từ các nông trại đạt chuẩn VietGAP, đảm bảo tươi ngon 100% trong ngày.";
    if (text.includes('khuyến mãi') || text.includes('giảm giá')) return "Hiện tại chúng tôi đang có chương trình giảm giá 25% cho các đơn hàng đầu tiên. Bạn đừng bỏ lỡ nhé!";
    return "Cảm ơn bạn đã quan tâm! Tôi đã ghi nhận yêu cầu và sẽ phản hồi chi tiết hơn. Bạn có muốn biết thêm về sản phẩm nào không?";
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
              height: isMinimized ? '60px' : '500px',
              width: '380px'
            }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="glass-card mb-4 overflow-hidden flex flex-col rounded-3xl shadow-2xl border border-white/30"
            style={{ maxWidth: 'calc(100vw - 48px)' }}
          >
            {/* Header */}
            <div className="bg-primary-600 p-4 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                  <Bot size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight">AI Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-[10px] text-primary-100 uppercase font-medium tracking-wider">Trực tuyến</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {isMinimized ? <Maximize2 size={16} /> : <Minus size={16} />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                          msg.sender === 'user' ? 'bg-primary-100 text-primary-700' : 'bg-white text-primary-600 border border-primary-100'
                        }`}>
                          {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                        </div>
                        <div className={`p-3 rounded-2xl text-sm shadow-sm ${
                          msg.sender === 'user' 
                            ? 'bg-primary-600 text-white rounded-tr-none' 
                            : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                        }`}>
                          {msg.text}
                          <div className={`text-[10px] mt-1 opacity-70 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex gap-2 items-center bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-100">
                  <div className="relative flex items-center gap-2">
                    <Input
                      placeholder="Nhập tin nhắn..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onPressEnter={handleSend}
                      className="rounded-xl py-2 px-4 border-slate-200 focus:border-primary-500 focus:ring-primary-500 pr-12"
                      bordered={false}
                      style={{ background: '#f8fafc' }}
                    />
                    <button 
                      onClick={handleSend}
                      disabled={!inputValue.trim() || isTyping}
                      className={`absolute right-1.5 p-2 rounded-lg transition-all ${
                        inputValue.trim() && !isTyping 
                        ? 'bg-primary-600 text-white shadow-md shadow-primary-200' 
                        : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 text-center">
                    Trợ lý ảo có thể trả lời sai. Hãy kiểm tra thông tin quan trọng.
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
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
          isOpen ? 'bg-white text-primary-600 rotate-90 scale-0 opacity-0 pointer-events-none' : 'bg-primary-600 text-white'
        }`}
      >
        <MessageCircle size={28} />
      </motion.button>
    </div>
  );
};

export default AIChatbox;
