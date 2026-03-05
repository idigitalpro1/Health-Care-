import React from 'react';
import { motion } from 'motion/react';
import { Activity } from 'lucide-react';

interface HeaderProps {
  onOpenPressKit: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenPressKit }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-500/30">
            <Activity size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">South Denver Health Map</h1>
            <p className="text-xs text-gray-500 font-medium">Find Specialists Near You</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            For Patients
          </button>
          <button className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            For Providers
          </button>
          <button 
            onClick={onOpenPressKit}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors border border-blue-200 bg-blue-50 px-3 py-1.5 rounded-md"
          >
            Press Kit
          </button>
          <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm">
            Emergency Care
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
