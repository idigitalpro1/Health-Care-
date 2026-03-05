import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, LayoutDashboard, Image, FileText, Settings, Users, Briefcase, Download } from 'lucide-react';
import MediaAssetsTab from './MediaAssetsTab';

interface PressKitPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PressKitPortal: React.FC<PressKitPortalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('media');

  if (!isOpen) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'media', label: 'Media Assets', icon: Image },
    { id: 'bio', label: 'Bio & Credentials', icon: Users },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'sponsored', label: 'Sponsored Posts', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
        >
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="bg-blue-600 text-white p-1 rounded-md text-xs font-mono">PK</span>
                Press Kit
              </h2>
              <p className="text-xs text-gray-500 mt-1">Manage your media presence</p>
            </div>
            
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="p-4 border-t border-gray-200">
              <button className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                <Download size={16} />
                Download Kit
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col h-full overflow-hidden relative">
            {/* Header */}
            <header className="h-16 border-b border-gray-200 flex items-center justify-between px-8 bg-white shrink-0">
              <h1 className="text-xl font-bold text-gray-900">
                {tabs.find((t) => t.id === activeTab)?.label}
              </h1>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </header>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
              {activeTab === 'media' && <MediaAssetsTab />}
              {activeTab !== 'media' && (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <Settings size={32} />
                  </div>
                  <p className="text-lg font-medium">This section is under construction.</p>
                  <p className="text-sm">Check back soon for updates.</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PressKitPortal;
