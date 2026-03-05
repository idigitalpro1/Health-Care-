import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 border-t-4 border-blue-600 mt-12">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & Subscribe */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: '"Libre Baskerville", serif' }}>
              The Villager
            </h2>
            <p className="text-gray-400 text-sm max-w-md leading-relaxed">
              South Denver's trusted source for health intelligence, medical breakthroughs, and community wellness news since 1982.
            </p>
            <div className="pt-4">
              <a 
                href="https://villagerpublishing.com/subscribe" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-none transition-colors uppercase tracking-widest text-sm border border-transparent hover:border-white"
              >
                Subscribe to The Villager
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6 border-b border-gray-800 pb-2">Sections</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Local News</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Health & Wellness</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Medical Advancements</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Doctor Directory</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Events Calendar</a></li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6 border-b border-gray-800 pb-2">Connect</h3>
            <ul className="space-y-3 text-sm text-gray-300 mb-6">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-gray-500" />
                <a href="mailto:editor@villagerpublishing.com" className="hover:text-white transition-colors">editor@villagerpublishing.com</a>
              </li>
            </ul>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors p-2 bg-gray-800 rounded-full hover:bg-blue-600">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors p-2 bg-gray-800 rounded-full hover:bg-blue-400">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors p-2 bg-gray-800 rounded-full hover:bg-pink-600">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors p-2 bg-gray-800 rounded-full hover:bg-blue-700">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Row */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-mono">
          <p>&copy; {new Date().getFullYear()} Villager Publishing. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
