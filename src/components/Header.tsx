import React from 'react';
import { motion } from 'motion/react';
import { Activity } from 'lucide-react';

interface HeaderProps {
  onOpenPressKit: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenPressKit }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
        <div className="flex items-center gap-6 h-full">
          <div className="flex items-center gap-2 h-full border-r border-gray-200 pr-6">
            <Activity size={16} className="text-blue-600" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900">Health_Intelligence_Portal</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 h-full">
            <button className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Specialists</button>
            <button className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Resources</button>
            <button className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Advocacy</button>
          </nav>
        </div>
        
        <div className="flex items-center gap-4 h-full">
          <button 
            onClick={onOpenPressKit}
            className="text-[10px] font-bold uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors"
          >
            Media_Kit
          </button>
          <div className="h-4 w-px bg-gray-200"></div>
          <button className="bg-black text-white px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
            Emergency_Alert
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
