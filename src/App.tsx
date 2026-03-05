import React, { useState } from 'react';
import { motion } from 'motion/react';
import HeaderInteractiveBackground from './components/HeaderInteractiveBackground';
import ConstellationBackground from './components/ConstellationBackground';
import Header from './components/Header';
import NewsTicker from './components/NewsTicker';
import ProvidersSliver from './components/ProvidersSliver';
import SusanWidget from './components/SusanWidget';
import PressKitPortal from './components/PressKit/PressKitPortal';
import FeaturedStories from './components/FeaturedStories';
import TopStories from './components/TopStories';
import InteractiveAnatomyModule from './components/InteractiveAnatomyModule';
import WidgetRail from './components/WidgetRail';
import InfiniteFeed from './components/InfiniteFeed';
import Footer from './components/Footer';
import StripePurchase from './components/StripePurchase';
import PaymentSuccess from './components/PaymentSuccess';

function App() {
  const [isPressKitOpen, setIsPressKitOpen] = useState(false);
  const isSuccessPage = typeof window !== 'undefined' && window.location.pathname === '/success';

  if (isSuccessPage) {
    return <PaymentSuccess />;
  }

  return (
    <div className="min-h-screen bg-transparent flex flex-col font-sans overflow-x-hidden relative">
      <ConstellationBackground intensity="medium" />
      
      {/* Logo Slider Up Top */}
      <ProvidersSliver />
      
      {/* Large Modern Title */}
      <div className="bg-slate-950 border-b-4 border-slate-900 py-12 text-center relative overflow-hidden">
        <HeaderInteractiveBackground mode="canvas" intensity="medium" interactive={true} />
        
        <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/50 z-10"></div>
        
        <div className="relative z-10">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-[10vw] md:text-[8vw] font-bold text-white leading-[0.85] mb-4 drop-shadow-lg" 
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            The Villager
          </motion.h1>
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="h-px w-12 bg-slate-500/50"></div>
            <p className="text-sm md:text-base text-slate-300 font-bold tracking-[0.4em] uppercase font-sans drop-shadow-md">
              South Denver Health Intelligence
            </p>
            <div className="h-px w-12 bg-slate-500/50"></div>
          </div>
          <div className="text-[10px] font-mono text-cyan-400/80 uppercase tracking-widest mt-4 drop-shadow-sm">
            EST. 1982 • VOL. XLII • NO. 156 • {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}
          </div>
        </div>
      </div>

      <Header onOpenPressKit={() => setIsPressKitOpen(true)} />
      
      <main className="flex-1 max-w-[1920px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 mb-12">
        <StripePurchase />
        
        {/* Featured Stories Slider */}
        <FeaturedStories />

        {/* Main 6-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8">
          
          {/* Col 1-2: Top stories + Opinion cards */}
          <div className="lg:col-span-2">
            <TopStories />
          </div>
          
          {/* Col 3-4: INTERACTIVE ANATOMY hero module */}
          <div className="lg:col-span-3">
            <InteractiveAnatomyModule />
          </div>
          
          {/* Col 5-6: Utility widgets rail */}
          <div className="lg:col-span-1">
            <WidgetRail />
          </div>
          
        </div>

        {/* Infinite Feed */}
        <InfiniteFeed />

      </main>

      <SusanWidget />
      
      {/* News Ticker at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <NewsTicker />
      </div>

      <Footer />

      {/* Press Kit Portal Modal */}
      <PressKitPortal isOpen={isPressKitOpen} onClose={() => setIsPressKitOpen(false)} />
    </div>
  );
}

export default App;
