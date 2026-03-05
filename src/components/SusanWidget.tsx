import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, X, MessageSquare } from 'lucide-react';

const SusanWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isListening, setIsListening] = useState(false);

  const handleAsk = () => {
    setIsListening(true);
    // Simulate processing and redirect
    setTimeout(() => {
      setIsListening(false);
      window.open('https://www.villagerpublishing.com/', '_blank');
    }, 2000);
  };

  return (
    <div className="fixed bottom-20 right-6 z-50 flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl border border-blue-100 p-4 mb-4 w-72 pointer-events-auto relative overflow-hidden"
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
            
            <div className="flex items-start gap-3 mb-3">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100" 
                  alt="Susan Sweeney" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-100"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Susan Sweeney</h3>
                <p className="text-xs text-blue-600 font-medium">Healthcare Advocate</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Ask me anything about health care in Colorado! I can connect you with trusted care providers.
            </p>
            
            <button
              onClick={handleAsk}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-all active:scale-95"
            >
              {isListening ? (
                <>
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }} 
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <Mic size={16} />
                  </motion.div>
                  Listening...
                </>
              ) : (
                <>
                  <Mic size={16} />
                  Ask Susan
                </>
              )}
            </button>
            
            <div className="mt-2 text-center">
               <a href="https://www.villagerpublishing.com/" target="_blank" rel="noreferrer" className="text-[10px] text-gray-400 hover:text-blue-500 uppercase tracking-wider font-bold">
                 Go to The Villager Today
               </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors pointer-events-auto"
        >
          <MessageSquare size={24} />
        </motion.button>
      )}
    </div>
  );
};

export default SusanWidget;
