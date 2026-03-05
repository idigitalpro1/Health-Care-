import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import { RotateCw, Layers, Users, User } from 'lucide-react';

interface BodyMapProps {
  selectedPart: string | null;
  onSelectPart: (part: string | null) => void;
}

const BodyMap: React.FC<BodyMapProps> = ({ selectedPart, onSelectPart }) => {
  const [view, setView] = useState<'front' | 'back'>('front');
  const [layer, setLayer] = useState<'skin' | 'skeleton'>('skin');
  const [genderMode, setGenderMode] = useState<'male' | 'female' | 'both'>('both');

  // Male Hotspots (Left side in 'both' mode)
  const maleHotspots = [
    { id: 'head', label: 'Cranial', cx: 200, cy: 50 },
    { id: 'shoulder', label: 'Shoulder', cx: 130, cy: 110 },
    { id: 'elbow', label: 'Elbow', cx: 100, cy: 190 },
    { id: 'wrist', label: 'Wrist', cx: 80, cy: 260 },
    { id: 'hip', label: 'Pelvis', cx: 200, cy: 280 },
    { id: 'knee', label: 'Knee', cx: 170, cy: 400 },
    { id: 'ankle', label: 'Ankle', cx: 170, cy: 520 },
  ];

  // Female Hotspots (Right side in 'both' mode)
  // We'll offset these by 400px when in 'both' mode
  const femaleHotspots = [
    { id: 'head', label: 'Cranial', cx: 200, cy: 50 },
    { id: 'shoulder', label: 'Shoulder', cx: 270, cy: 110 },
    { id: 'elbow', label: 'Elbow', cx: 300, cy: 190 },
    { id: 'wrist', label: 'Wrist', cx: 320, cy: 260 },
    { id: 'hip', label: 'Pelvis', cx: 200, cy: 280 },
    { id: 'knee', label: 'Knee', cx: 230, cy: 400 },
    { id: 'ankle', label: 'Ankle', cx: 230, cy: 520 },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center perspective-1000">
      {/* 3D Grid Floor */}
      <div className="absolute bottom-0 w-full h-1/2 bg-[linear-gradient(to_bottom,transparent,rgba(59,130,246,0.1))] transform rotate-x-60 origin-bottom pointer-events-none"></div>
      
      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
        <div className="flex bg-slate-800/80 backdrop-blur rounded-lg border border-slate-600 p-1 mb-2">
          <button 
            onClick={() => setGenderMode('male')}
            className={clsx("p-2 rounded-md transition-all", genderMode === 'male' ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white")}
            title="Male View"
          >
            <User size={16} />
          </button>
          <button 
            onClick={() => setGenderMode('both')}
            className={clsx("p-2 rounded-md transition-all", genderMode === 'both' ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white")}
            title="Side-by-Side View"
          >
            <Users size={16} />
          </button>
          <button 
            onClick={() => setGenderMode('female')}
            className={clsx("p-2 rounded-md transition-all", genderMode === 'female' ? "bg-pink-600 text-white" : "text-slate-400 hover:text-white")}
            title="Female View"
          >
            <User size={16} className="text-pink-400" />
          </button>
        </div>

        <button 
          onClick={() => setView(view === 'front' ? 'back' : 'front')}
          className="bg-slate-800/80 backdrop-blur text-blue-400 p-2 rounded-lg border border-slate-600 hover:bg-slate-700 hover:text-white transition-all"
          title="Rotate View"
        >
          <RotateCw size={20} className={clsx("transition-transform duration-500", view === 'back' && "rotate-180")} />
        </button>
        <button 
          onClick={() => setLayer(layer === 'skin' ? 'skeleton' : 'skin')}
          className={clsx(
            "bg-slate-800/80 backdrop-blur p-2 rounded-lg border border-slate-600 hover:bg-slate-700 transition-all",
            layer === 'skeleton' ? "text-blue-400" : "text-slate-400"
          )}
          title="Toggle Layer"
        >
          <Layers size={20} />
        </button>
      </div>

      {/* Main Figure Container */}
      <motion.div 
        className="relative h-[600px] w-full max-w-[800px] flex items-center justify-center"
        initial={false}
        animate={{ rotateY: view === 'front' ? 0 : 180 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 60 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <svg viewBox="0 0 800 600" className="w-full h-full drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]">
          <defs>
            <linearGradient id="holoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.1)" />
              <stop offset="50%" stopColor="rgba(59, 130, 246, 0.4)" />
              <stop offset="100%" stopColor="rgba(59, 130, 246, 0.1)" />
            </linearGradient>
            <linearGradient id="holoGradientFemale" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(236, 72, 153, 0.1)" />
              <stop offset="50%" stopColor="rgba(236, 72, 153, 0.4)" />
              <stop offset="100%" stopColor="rgba(236, 72, 153, 0.1)" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          {/* MALE FIGURE */}
          <motion.g 
            animate={{ 
              x: genderMode === 'male' ? 200 : genderMode === 'both' ? 0 : -200,
              opacity: genderMode === 'female' ? 0 : 1,
              scale: genderMode === 'female' ? 0.8 : 1
            }}
            transition={{ duration: 0.5 }}
          >
            <motion.g animate={{ opacity: layer === 'skin' ? 1 : 0.3 }}>
              <path
                d="M200,30 Q230,30 230,60 Q230,80 215,90 L260,110 L260,160 L220,280 L230,380 L230,500 L210,550 L190,550 L170,500 L170,380 L180,280 L140,160 L140,110 L185,90 Q170,80 170,60 Q170,30 200,30"
                fill="url(#holoGradient)"
                stroke="rgba(59, 130, 246, 0.6)"
                strokeWidth="1.5"
                filter="url(#glow)"
              />
              {/* Male Grid Lines */}
              <path d="M200,30 L200,550 M140,160 L260,160 M180,280 L220,280" fill="none" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="0.5" />
            </motion.g>

            {/* Male Skeleton */}
            <motion.g animate={{ opacity: layer === 'skeleton' ? 1 : 0 }}>
               <circle cx="200" cy="60" r="25" fill="none" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="2" />
               <line x1="200" y1="85" x2="200" y2="280" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="4" strokeDasharray="4 2" />
               <path d="M170,120 Q200,120 230,120 M165,140 Q200,140 235,140" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="2" fill="none" />
               <path d="M170,280 L230,280 L200,310 Z" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="2" fill="none" />
               <line x1="180" y1="310" x2="170" y2="500" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="3" />
               <line x1="220" y1="310" x2="230" y2="500" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="3" />
               <line x1="140" y1="110" x2="100" y2="190" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="3" />
               <line x1="260" y1="110" x2="300" y2="190" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="3" />
            </motion.g>

            {/* Male Hotspots */}
            {maleHotspots.map((spot) => (
              <motion.g
                key={`male-${spot.id}`}
                onClick={() => onSelectPart(selectedPart === spot.id ? null : spot.id)}
                className="cursor-pointer group"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <circle cx={spot.cx} cy={spot.cy} r={4} className={clsx("transition-all duration-300", selectedPart === spot.id ? "fill-white stroke-blue-400 stroke-[3px]" : "fill-blue-500 stroke-blue-900 stroke-1")} />
                {selectedPart === spot.id && (
                  <motion.circle cx={spot.cx} cy={spot.cy} r={10} className="fill-none stroke-blue-400" animate={{ r: [10, 20], opacity: [0.8, 0] }} transition={{ repeat: Infinity, duration: 2 }} />
                )}
              </motion.g>
            ))}
          </motion.g>

          {/* FEMALE FIGURE */}
          <motion.g 
            animate={{ 
              x: genderMode === 'female' ? 200 : genderMode === 'both' ? 400 : 600,
              opacity: genderMode === 'male' ? 0 : 1,
              scale: genderMode === 'male' ? 0.8 : 1
            }}
            transition={{ duration: 0.5 }}
          >
            <motion.g animate={{ opacity: layer === 'skin' ? 1 : 0.3 }}>
              <path
                d="M200,30 Q225,30 225,55 Q225,75 210,85 L250,110 L240,160 L230,280 L240,380 L230,500 L210,550 L190,550 L170,500 L160,380 L170,280 L160,160 L150,110 L190,85 Q175,75 175,55 Q175,30 200,30 Z"
                fill="url(#holoGradientFemale)"
                stroke="rgba(236, 72, 153, 0.6)"
                strokeWidth="1.5"
                filter="url(#glow)"
              />
              {/* Female Grid Lines */}
              <path d="M200,30 L200,550 M150,160 L240,160 M170,280 L230,280" fill="none" stroke="rgba(236, 72, 153, 0.2)" strokeWidth="0.5" />
            </motion.g>

            {/* Female Skeleton */}
            <motion.g animate={{ opacity: layer === 'skeleton' ? 1 : 0 }}>
               <circle cx="200" cy="60" r="24" fill="none" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="2" />
               <line x1="200" y1="85" x2="200" y2="280" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="4" strokeDasharray="4 2" />
               <path d="M175,120 Q200,120 225,120 M170,140 Q200,140 230,140" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="2" fill="none" />
               <path d="M160,280 L240,280 L200,310 Z" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="2" fill="none" />
               <line x1="180" y1="310" x2="175" y2="500" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="3" />
               <line x1="220" y1="310" x2="225" y2="500" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="3" />
               <line x1="150" y1="110" x2="120" y2="190" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="3" />
               <line x1="250" y1="110" x2="280" y2="190" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="3" />
            </motion.g>

            {/* Female Hotspots */}
            {femaleHotspots.map((spot) => (
              <motion.g
                key={`female-${spot.id}`}
                onClick={() => onSelectPart(selectedPart === spot.id ? null : spot.id)}
                className="cursor-pointer group"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <circle cx={spot.cx} cy={spot.cy} r={4} className={clsx("transition-all duration-300", selectedPart === spot.id ? "fill-white stroke-pink-400 stroke-[3px]" : "fill-pink-500 stroke-pink-900 stroke-1")} />
                {selectedPart === spot.id && (
                  <motion.circle cx={spot.cx} cy={spot.cy} r={10} className="fill-none stroke-pink-400" animate={{ r: [10, 20], opacity: [0.8, 0] }} transition={{ repeat: Infinity, duration: 2 }} />
                )}
              </motion.g>
            ))}
          </motion.g>
        </svg>
      </motion.div>
      
      {/* Reset Button */}
      <AnimatePresence>
        {selectedPart && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => onSelectPart(null)}
            className="absolute bottom-8 bg-blue-600/20 backdrop-blur border border-blue-500/50 text-blue-300 px-6 py-2 rounded-full text-xs font-mono tracking-widest hover:bg-blue-600/40 transition-colors uppercase"
          >
            Reset Analysis
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BodyMap;
