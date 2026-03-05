import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, X, MessageSquare, Send, Loader2, Heart, ShieldCheck, Info } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const SusanWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: "Hi, I'm Susan Sweeney. I'm your health care advocate working for you. Tell me what's going on?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: 'user', parts: [{ text: `You are Susan Sweeney, a dedicated healthcare advocate for the South Denver community (Highlands Ranch, Greenwood Village, Cherry Hills). 
          Your goal is to help patients find the right specialists, understand local healthcare options, and feel empowered. 
          Be compassionate, professional, and knowledgeable about Colorado healthcare. 
          If asked about specific doctors, refer to the "South Denver Health Map" (the app the user is currently using).
          Keep responses concise and helpful. 
          
          User says: ${userMessage}` }] }
        ],
        config: {
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      });

      const aiText = response.text || "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm experiencing a technical hiccup. As your advocate, I recommend checking our specialist map while I get back online!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // In a real app, we'd start Web Speech API here
      setTimeout(() => {
        setIsListening(false);
        setInput("I'm looking for a knee specialist in Highlands Ranch.");
      }, 2000);
    }
  };

  return (
    <div className="fixed bottom-20 right-6 z-50 flex flex-col items-end pointer-events-none">
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="bg-white rounded-3xl shadow-2xl border border-blue-100 w-80 sm:w-96 pointer-events-auto relative overflow-hidden flex flex-col max-h-[600px]"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100" 
                    alt="Susan Sweeney" 
                    className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-indigo-700"></div>
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-none">Susan Sweeney</h3>
                  <p className="text-[10px] text-blue-100 mt-1 flex items-center gap-1">
                    <ShieldCheck size={10} /> Verified Health Advocate
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 custom-scrollbar min-h-[300px]"
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-blue-600" />
                    <span className="text-xs text-slate-400">Susan is thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100">
              <div className="flex items-center gap-2 bg-slate-100 rounded-2xl px-3 py-1">
                <button 
                  type="button"
                  onClick={toggleListening}
                  className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'text-slate-400 hover:text-blue-600'}`}
                >
                  <Mic size={18} />
                </button>
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Susan anything..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 text-slate-700"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-2 text-blue-600 disabled:text-slate-300 transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
              <div className="mt-2 flex items-center justify-center gap-4">
                <div className="flex items-center gap-1 text-[9px] text-slate-400 uppercase tracking-tighter font-bold">
                  <Heart size={8} className="text-red-400" /> Community First
                </div>
                <div className="flex items-center gap-1 text-[9px] text-slate-400 uppercase tracking-tighter font-bold">
                  <Info size={8} className="text-blue-400" /> AI Powered
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-all pointer-events-auto relative group"
        >
          <MessageSquare size={28} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-slate-900 px-3 py-1.5 rounded-lg text-xs font-bold shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-slate-100">
            Ask Susan Sweeney
          </div>
        </motion.button>
      )}
    </div>
  );
};

export default SusanWidget;
