import React, { useState } from 'react';
import Header from './components/Header';
import BodyMap from './components/BodyMap';
import DoctorList from './components/DoctorList';
import NewsTicker from './components/NewsTicker';
import ProvidersSliver from './components/ProvidersSliver';
import SusanWidget from './components/SusanWidget';
import ArticleColumn from './components/ArticleColumn';
import PressKitPortal from './components/PressKit/PressKitPortal';
import { doctors } from './data';

function App() {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [isPressKitOpen, setIsPressKitOpen] = useState(false);

  // Split doctors for left and right columns
  const leftDoctors = doctors.slice(0, Math.ceil(doctors.length / 2));
  const rightDoctors = doctors.slice(Math.ceil(doctors.length / 2));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans overflow-x-hidden">
      {/* Logo Slider Up Top */}
      <ProvidersSliver />
      
      {/* Large Modern Title */}
      <div className="bg-white border-b border-gray-200 py-8 text-center">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-gray-900 uppercase" style={{ fontFamily: 'Inter, sans-serif' }}>
          The Villager Today
        </h1>
        <p className="text-xl text-gray-500 font-light tracking-widest mt-2 uppercase">Modern Healthcare Intelligence</p>
      </div>

      <Header onOpenPressKit={() => setIsPressKitOpen(true)} />
      
      <main className="flex-1 max-w-[1920px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 mb-12">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-auto xl:h-[calc(100vh-24rem)]">
          
          {/* Column 1: Editorial Article */}
          <div className="xl:col-span-3 h-[600px] xl:h-full overflow-hidden">
            <ArticleColumn />
          </div>

          {/* Column 2: Steam Cards (Left) */}
          <div className="xl:col-span-2 h-[600px] xl:h-full overflow-hidden">
            <DoctorList doctors={leftDoctors} selectedPart={selectedPart} />
          </div>
          
          {/* Column 3: 3D Interactive Body Map (Center) */}
          <div className="xl:col-span-5 flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 rounded-3xl shadow-2xl border border-slate-700 p-8 relative overflow-hidden min-h-[700px]">
             <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
             <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
             
             <div className="absolute top-6 left-0 right-0 text-center z-10">
               <h2 className="text-2xl text-white font-light tracking-[0.2em] uppercase">
                 Interactive Anatomy
               </h2>
               <p className="text-blue-400 text-xs font-mono mt-2">SELECT REGION FOR ANALYSIS</p>
             </div>
            <BodyMap selectedPart={selectedPart} onSelectPart={setSelectedPart} />
          </div>
          
          {/* Column 4: Steam Cards (Right) */}
          <div className="xl:col-span-2 h-[600px] xl:h-full overflow-hidden">
            <DoctorList doctors={rightDoctors} selectedPart={selectedPart} />
          </div>
          
        </div>
      </main>

      <SusanWidget />
      
      {/* News Ticker at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <NewsTicker />
      </div>

      {/* Press Kit Portal Modal */}
      <PressKitPortal isOpen={isPressKitOpen} onClose={() => setIsPressKitOpen(false)} />
    </div>
  );
}

export default App;
