import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import { RotateCw, Layers, ZoomIn } from 'lucide-react';

interface BodyMapProps {
  selectedPart: string | null;
  onSelectPart: (part: string | null) => void;
}

const BodyMap: React.FC<BodyMapProps> = ({ selectedPart, onSelectPart }) => {
  const [view, setView] = useState<'front' | 'back'>('front');
  const [layer, setLayer] = useState<'skin' | 'skeleton'>('skin');
  const [genderMode, setGenderMode] = useState<'male' | 'female' | 'both'>('both');

  // Detailed Hotspots
  const createHotspots = (offsetX: number) => [
    { id: 'head', label: 'Head & Neck', cx: offsetX, cy: 50, r: 25 },
    { id: 'neck', label: 'Cervical', cx: offsetX, cy: 90, r: 15 },
    { id: 'shoulder', label: 'Shoulder', cx: offsetX - 60, cy: 110, r: 20 },
    { id: 'upperArm', label: 'Upper Arm', cx: offsetX - 80, cy: 150, r: 18 },
    { id: 'elbow', label: 'Elbow', cx: offsetX - 95, cy: 190, r: 15 },
    { id: 'forearm', label: 'Forearm', cx: offsetX - 110, cy: 230, r: 16 },
    { id: 'wristHand', label: 'Wrist & Hand', cx: offsetX - 120, cy: 270, r: 18 },
    { id: 'chest', label: 'Thoracic', cx: offsetX, cy: 140, r: 35 },
    { id: 'abdomen', label: 'Abdomen', cx: offsetX, cy: 210, r: 30 },
    { id: 'back', label: 'Lumbar', cx: offsetX, cy: 210, r: 30, backOnly: true }, // Only relevant if we had true 3D, but we'll map it to abdomen area for now
    { id: 'hip', label: 'Pelvis & Hip', cx: offsetX, cy: 280, r: 35 },
    { id: 'thigh', label: 'Thigh', cx: offsetX - 25, cy: 350, r: 25 },
    { id: 'knee', label: 'Knee', cx: offsetX - 30, cy: 420, r: 18 },
    { id: 'calf', label: 'Calf', cx: offsetX - 30, cy: 480, r: 20 },
    { id: 'ankleFoot', label: 'Ankle & Foot', cx: offsetX - 30, cy: 550, r: 20 },
  ];

  const maleHotspots = createHotspots(200);
  const femaleHotspots = createHotspots(200).map(h => {
    // Mirror the arm/leg positions for the female figure when in 'both' mode
    if (h.cx < 200) {
      return { ...h, cx: 200 + (200 - h.cx) };
    }
    return h;
  });

  // Da Vinci Proportions Circles
  const proportionCircles = [
    { cy: 280, r: 280 }, // Vitruvian man outer circle
    { cy: 280, r: 140 }, // Inner proportion
  ];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden rounded-lg">
      
      {/* Controls - Editorial Style */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
        <div className="flex bg-[#050810]/80 backdrop-blur-md rounded border border-slate-700/50 p-1 shadow-lg">
          <button 
            onClick={() => setGenderMode('male')}
            className={clsx("px-3 py-1.5 transition-all text-[10px] font-mono uppercase tracking-widest rounded-sm", genderMode === 'male' ? "bg-cyan-950/50 text-cyan-400 border border-cyan-900/50" : "text-slate-400 hover:text-white")}
            title="Male View"
          >
            M
          </button>
          <button 
            onClick={() => setGenderMode('both')}
            className={clsx("px-3 py-1.5 transition-all text-[10px] font-mono uppercase tracking-widest rounded-sm mx-1", genderMode === 'both' ? "bg-cyan-950/50 text-cyan-400 border border-cyan-900/50" : "text-slate-400 hover:text-white")}
            title="Side-by-Side View"
          >
            M/F
          </button>
          <button 
            onClick={() => setGenderMode('female')}
            className={clsx("px-3 py-1.5 transition-all text-[10px] font-mono uppercase tracking-widest rounded-sm", genderMode === 'female' ? "bg-cyan-950/50 text-cyan-400 border border-cyan-900/50" : "text-slate-400 hover:text-white")}
            title="Female View"
          >
            F
          </button>
        </div>

        <button 
          onClick={() => setView(view === 'front' ? 'back' : 'front')}
          className="bg-[#050810]/80 backdrop-blur-md text-slate-300 p-2 border border-slate-700/50 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 rounded shadow-lg"
          title="Rotate View"
        >
          <RotateCw size={14} className={clsx("transition-transform duration-500", view === 'back' && "rotate-180")} />
          <span className="text-[10px] uppercase tracking-widest font-mono">Rotate</span>
        </button>
        <button 
          onClick={() => setLayer(layer === 'skin' ? 'skeleton' : 'skin')}
          className={clsx(
            "bg-[#050810]/80 backdrop-blur-md p-2 border border-slate-700/50 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 rounded shadow-lg",
            layer === 'skeleton' ? "text-cyan-400" : "text-slate-300"
          )}
          title="Toggle Layer"
        >
          <Layers size={14} />
          <span className="text-[10px] uppercase tracking-widest font-mono">Layer</span>
        </button>
      </div>

      {/* Main Figure Container */}
      <motion.div 
        className="relative h-[550px] w-full max-w-[800px] flex items-center justify-center"
        initial={false}
        animate={{ rotateY: view === 'front' ? 0 : 180 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 60 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <svg viewBox="0 0 800 600" className="w-full h-full drop-shadow-2xl">
          <defs>
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(15, 23, 42, 0.9)" />
              <stop offset="50%" stopColor="rgba(30, 41, 59, 0.9)" />
              <stop offset="100%" stopColor="rgba(15, 23, 42, 0.9)" />
            </linearGradient>
            <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="activeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComponentTransfer in="blur" result="glow">
                <feFuncA type="linear" slope="2" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          {/* Da Vinci Background Elements */}
          <g className="opacity-20 pointer-events-none" style={{ transform: view === 'back' ? 'scaleX(-1) translate(-800px, 0)' : 'none' }}>
            {/* Fine Grid */}
            <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#334155" strokeWidth="0.5" opacity="0.5"/>
            </pattern>
            {/* Major Grid */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <rect width="40" height="40" fill="url(#smallGrid)"/>
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#475569" strokeWidth="1" opacity="0.8"/>
            </pattern>
            <rect width="800" height="600" fill="url(#grid)" />
            
            {/* Proportion Circles & Linework */}
            <g transform={`translate(${genderMode === 'male' ? 200 : genderMode === 'female' ? 200 : 400}, 0)`}>
              {proportionCircles.map((circle, i) => (
                <circle key={i} cx="0" cy={circle.cy} r={circle.r} fill="none" stroke="#64748b" strokeWidth="0.75" strokeDasharray="4 6" />
              ))}
              
              {/* Center Line */}
              <line x1="0" y1="0" x2="0" y2="600" stroke="#64748b" strokeWidth="1" strokeDasharray="10 4 2 4" />
              
              {/* Horizontal Proportion Lines */}
              {[70, 140, 210, 280, 350, 420, 490, 560].map((y, i) => (
                <g key={`hline-${i}`}>
                  <line x1="-350" y1={y} x2="350" y2={y} stroke="#475569" strokeWidth="0.5" />
                  <text x="-340" y={y - 4} fill="#64748b" fontSize="8" fontFamily="monospace" opacity="0.7">SEC.{i+1}</text>
                </g>
              ))}
              
              {/* Angles / Diagonals */}
              <line x1="-280" y1="0" x2="280" y2="560" stroke="#334155" strokeWidth="0.5" strokeDasharray="2 2" />
              <line x1="280" y1="0" x2="-280" y2="560" stroke="#334155" strokeWidth="0.5" strokeDasharray="2 2" />
              
              {/* Decorative technical marks */}
              <circle cx="0" cy="280" r="4" fill="none" stroke="#94a3b8" strokeWidth="1" />
              <circle cx="0" cy="280" r="1" fill="#94a3b8" />
              
              <path d="M -280 270 L -280 290 M 280 270 L 280 290" stroke="#64748b" strokeWidth="1" />
              <path d="M -140 275 L -140 285 M 140 275 L 140 285" stroke="#64748b" strokeWidth="1" />
              
              {/* Faux handwriting/notes */}
              <text x="150" y="50" fill="#64748b" fontSize="10" fontFamily="monospace" opacity="0.6" style={{ fontStyle: 'italic' }}>* ratio 1:1.618</text>
              <text x="-250" y="520" fill="#64748b" fontSize="10" fontFamily="monospace" opacity="0.6" style={{ fontStyle: 'italic' }}>fig. 1 - anterior</text>
            </g>
          </g>

          {/* MALE FIGURE */}
          <motion.g 
            animate={{ 
              x: genderMode === 'male' ? 200 : genderMode === 'both' ? 0 : -200,
              opacity: genderMode === 'female' ? 0 : 1,
              scale: genderMode === 'female' ? 0.8 : 1
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <motion.g animate={{ opacity: layer === 'skin' ? 1 : 0.1 }}>
              {/* Detailed Male Silhouette with Segmentation */}
              <path
                d="
                  M200,25 Q225,25 225,55 Q225,75 215,85 
                  L250,100 Q265,105 265,120 
                  L255,160 Q250,180 240,200
                  L225,280 Q230,300 235,320
                  L240,400 Q240,420 235,440
                  L220,520 Q215,540 215,560
                  L185,560 Q185,540 180,520
                  L165,440 Q160,420 160,400
                  L165,320 Q170,300 175,280
                  L160,200 Q150,180 145,160
                  L135,120 Q135,105 150,100
                  L185,85 Q175,75 175,55 Q175,25 200,25 Z
                "
                fill="url(#bodyGradient)"
                stroke="rgba(148, 163, 184, 0.3)"
                strokeWidth="1.5"
                filter="url(#subtleGlow)"
              />
              {/* Anatomical Segmentation Lines */}
              <g stroke="rgba(148, 163, 184, 0.2)" strokeWidth="1" fill="none">
                <path d="M185,85 Q200,95 215,85" /> {/* Neck line */}
                <path d="M150,100 Q200,120 250,100" /> {/* Clavicle */}
                <path d="M175,140 Q200,150 225,140" /> {/* Pectoral */}
                <path d="M160,200 Q200,210 240,200" /> {/* Costal margin */}
                <path d="M175,280 Q200,290 225,280" /> {/* Pelvic line */}
                <path d="M165,400 Q180,410 195,400" /> {/* Left Knee */}
                <path d="M205,400 Q220,410 235,400" /> {/* Right Knee */}
              </g>
            </motion.g>

            {/* Male Skeleton */}
            <motion.g animate={{ opacity: layer === 'skeleton' ? 1 : 0 }}>
               {/* Skull */}
               <path d="M200,30 Q220,30 220,55 Q220,70 210,80 L190,80 Q180,70 180,55 Q180,30 200,30 Z" fill="none" stroke="rgba(148, 163, 184, 0.5)" strokeWidth="1.5" />
               {/* Spine */}
               <path d="M200,80 Q205,150 200,280" stroke="rgba(148, 163, 184, 0.5)" strokeWidth="3" strokeDasharray="4 2" fill="none" />
               {/* Ribs */}
               {[110, 130, 150, 170, 190].map(y => (
                 <path key={y} d={`M170,${y} Q200,${y-10} 230,${y}`} stroke="rgba(148, 163, 184, 0.3)" strokeWidth="1.5" fill="none" />
               ))}
               {/* Pelvis */}
               <path d="M170,270 Q200,290 230,270 L210,300 L190,300 Z" stroke="rgba(148, 163, 184, 0.5)" strokeWidth="1.5" fill="none" />
               {/* Legs */}
               <line x1="185" y1="290" x2="175" y2="410" stroke="rgba(148, 163, 184, 0.5)" strokeWidth="2" />
               <line x1="215" y1="290" x2="225" y2="410" stroke="rgba(148, 163, 184, 0.5)" strokeWidth="2" />
               <circle cx="175" cy="410" r="4" fill="none" stroke="rgba(148, 163, 184, 0.5)" />
               <circle cx="225" cy="410" r="4" fill="none" stroke="rgba(148, 163, 184, 0.5)" />
               <line x1="175" y1="414" x2="170" y2="530" stroke="rgba(148, 163, 184, 0.5)" strokeWidth="2" />
               <line x1="225" y1="414" x2="230" y2="530" stroke="rgba(148, 163, 184, 0.5)" strokeWidth="2" />
               {/* Arms */}
               <line x1="160" y1="105" x2="140" y2="180" stroke="rgba(148, 163, 184, 0.5)" strokeWidth="2" />
               <line x1="240" y1="105" x2="260" y2="180" stroke="rgba(148, 163, 184, 0.5)" strokeWidth="2" />
               <circle cx="140" cy="180" r="3" fill="none" stroke="rgba(148, 163, 184, 0.5)" />
               <circle cx="260" cy="180" r="3" fill="none" stroke="rgba(148, 163, 184, 0.5)" />
               <line x1="140" y1="183" x2="125" y2="260" stroke="rgba(148, 163, 184, 0.5)" strokeWidth="2" />
               <line x1="260" y1="183" x2="275" y2="260" stroke="rgba(148, 163, 184, 0.5)" strokeWidth="2" />
            </motion.g>

            {/* Male Hotspots */}
            {maleHotspots.map((spot) => (
              <motion.g
                key={`male-${spot.id}`}
                onClick={() => onSelectPart(selectedPart === spot.id ? null : spot.id)}
                className="cursor-pointer group"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {/* Region Outline / Hit Area */}
                <circle 
                  cx={spot.cx} 
                  cy={spot.cy} 
                  r={spot.r} 
                  className={clsx(
                    "transition-all duration-300",
                    selectedPart === spot.id 
                      ? "fill-cyan-500/30 stroke-cyan-300 stroke-[2px]" 
                      : "fill-slate-800/30 stroke-slate-500/50 stroke-[1px] group-hover:stroke-cyan-400 group-hover:fill-cyan-900/50"
                  )}
                  style={{ strokeDasharray: selectedPart === spot.id ? 'none' : '4 4' }}
                  filter={selectedPart === spot.id ? "url(#activeGlow)" : ""}
                />
                
                {/* Center dot */}
                <circle 
                  cx={spot.cx} 
                  cy={spot.cy} 
                  r={selectedPart === spot.id ? 4 : 2} 
                  className={clsx(
                    "transition-all duration-300", 
                    selectedPart === spot.id 
                      ? "fill-cyan-300" 
                      : "fill-slate-500 group-hover:fill-cyan-300"
                  )} 
                  filter={selectedPart === spot.id ? "url(#activeGlow)" : ""}
                />
                
                {/* Active Pulse */}
                {selectedPart === spot.id && (
                  <motion.circle 
                    cx={spot.cx} 
                    cy={spot.cy} 
                    r={spot.r + 5} 
                    className="fill-none stroke-cyan-400" 
                    animate={{ r: [spot.r, spot.r + 15], opacity: [0.8, 0], strokeWidth: [2, 0] }} 
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }} 
                  />
                )}
                
                {/* Hover/Active Label (SVG Tooltip) */}
                <g className={clsx(
                  "transition-opacity duration-200 pointer-events-none",
                  selectedPart === spot.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}>
                  <rect x={spot.cx + spot.r + 5} y={spot.cy - 10} width="95" height="20" rx="2" fill="rgba(15, 23, 42, 0.9)" stroke={selectedPart === spot.id ? "rgba(34, 211, 238, 0.9)" : "rgba(34, 211, 238, 0.5)"} strokeWidth={selectedPart === spot.id ? "1" : "0.5"} filter={selectedPart === spot.id ? "url(#subtleGlow)" : ""} />
                  <text x={spot.cx + spot.r + 10} y={spot.cy + 3} fill="#e2e8f0" fontSize="9" fontFamily="monospace" letterSpacing="0.05em">{spot.label}</text>
                  <line x1={spot.cx + spot.r} y1={spot.cy} x2={spot.cx + spot.r + 5} y2={spot.cy} stroke="rgba(34, 211, 238, 0.5)" strokeWidth="0.5" />
                </g>
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
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <motion.g animate={{ opacity: layer === 'skin' ? 1 : 0.1 }}>
              {/* Detailed Female Silhouette */}
              <path
                d="
                  M200,25 Q220,25 220,55 Q220,75 210,85 
                  L240,105 Q250,110 250,125 
                  L240,165 Q235,185 230,205
                  L220,280 Q235,300 240,320
                  L245,400 Q245,420 240,440
                  L225,520 Q220,540 220,560
                  L190,560 Q190,540 185,520
                  L170,440 Q165,420 165,400
                  L170,320 Q175,300 190,280
                  L180,205 Q175,185 170,165
                  L160,125 Q160,110 170,105
                  L190,85 Q180,75 180,55 Q180,25 200,25 Z
                "
                fill="url(#bodyGradient)"
                stroke="rgba(148, 163, 184, 0.3)"
                strokeWidth="1.5"
                filter="url(#subtleGlow)"
              />
              {/* Anatomical Segmentation Lines */}
              <g stroke="rgba(148, 163, 184, 0.2)" strokeWidth="1" fill="none">
                <path d="M190,85 Q200,95 210,85" />
                <path d="M165,110 Q200,125 235,110" />
                <path d="M175,150 Q200,165 225,150" />
                <path d="M170,210 Q200,220 230,210" />
                <path d="M180,280 Q200,295 220,280" />
                <path d="M170,400 Q185,410 200,400" />
                <path d="M210,400 Q225,410 240,400" />
              </g>
            </motion.g>

            {/* Female Skeleton */}
            <motion.g animate={{ opacity: layer === 'skeleton' ? 1 : 0 }}>
               <path d="M200,30 Q218,30 218,55 Q218,70 208,80 L192,80 Q182,70 182,55 Q182,30 200,30 Z" fill="none" stroke="rgba(148, 163, 184, 0.5)" strokeWidth="1.5" />
               <path d="M200,80 Q203,150 200,280" stroke="rgba(148, 163, 184, 0.5)" strokeWidth="3" strokeDasharray="4 2" fill="none" />
               {[110, 130, 150, 170, 190].map(y => (
                 <path key={y} d={`M175,${y} Q200,${y-8} 225,${y}`} stroke="rgba(148, 163, 184, 0.3)" strokeWidth="1.5" fill="none" />
               ))}
               <path d="M165,270 Q200,295 235,270 L215,300 L185,300 Z" stroke="rgba(148, 163, 184, 0.5)" strokeWidth="1.5" fill="none" />
               <line x1="180" y1="290" x2="175" y2="410" stroke="rgba(148, 163, 184, 0.5)" strokeWidth="2" />
               <line x1="220" y1="290" x2="225" y2="410" stroke="rgba(148, 163, 184, 0.5)" strokeWidth="2" />
               <circle cx="175" cy="410" r="4" fill="none" stroke="rgba(148, 163, 184, 0.5)" />
               <circle cx="225" cy="410" r="4" fill="none" stroke="rgba(148, 163, 184, 0.5)" />
               <line x1="175" y1="414" x2="170" y2="530" stroke="rgba(148, 163, 184, 0.5)" strokeWidth="2" />
               <line x1="225" y1="414" x2="230" y2="530" stroke="rgba(148, 163, 184, 0.5)" strokeWidth="2" />
               <line x1="165" y1="110" x2="150" y2="185" stroke="rgba(148, 163, 184, 0.5)" strokeWidth="2" />
               <line x1="235" y1="110" x2="250" y2="185" stroke="rgba(148, 163, 184, 0.5)" strokeWidth="2" />
               <circle cx="150" cy="185" r="3" fill="none" stroke="rgba(148, 163, 184, 0.5)" />
               <circle cx="250" cy="185" r="3" fill="none" stroke="rgba(148, 163, 184, 0.5)" />
               <line x1="150" y1="188" x2="140" y2="265" stroke="rgba(148, 163, 184, 0.5)" strokeWidth="2" />
               <line x1="250" y1="188" x2="260" y2="265" stroke="rgba(148, 163, 184, 0.5)" strokeWidth="2" />
            </motion.g>

            {/* Female Hotspots */}
            {femaleHotspots.map((spot) => (
              <motion.g
                key={`female-${spot.id}`}
                onClick={() => onSelectPart(selectedPart === spot.id ? null : spot.id)}
                className="cursor-pointer group"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {/* Region Outline / Hit Area */}
                <circle 
                  cx={spot.cx} 
                  cy={spot.cy} 
                  r={spot.r} 
                  className={clsx(
                    "transition-all duration-300",
                    selectedPart === spot.id 
                      ? "fill-cyan-500/30 stroke-cyan-300 stroke-[2px]" 
                      : "fill-slate-800/30 stroke-slate-500/50 stroke-[1px] group-hover:stroke-cyan-400 group-hover:fill-cyan-900/50"
                  )}
                  style={{ strokeDasharray: selectedPart === spot.id ? 'none' : '4 4' }}
                  filter={selectedPart === spot.id ? "url(#activeGlow)" : ""}
                />
                
                {/* Center dot */}
                <circle 
                  cx={spot.cx} 
                  cy={spot.cy} 
                  r={selectedPart === spot.id ? 4 : 2} 
                  className={clsx(
                    "transition-all duration-300", 
                    selectedPart === spot.id 
                      ? "fill-cyan-300" 
                      : "fill-slate-500 group-hover:fill-cyan-300"
                  )} 
                  filter={selectedPart === spot.id ? "url(#activeGlow)" : ""}
                />
                
                {/* Active Pulse */}
                {selectedPart === spot.id && (
                  <motion.circle 
                    cx={spot.cx} 
                    cy={spot.cy} 
                    r={spot.r + 5} 
                    className="fill-none stroke-cyan-400" 
                    animate={{ r: [spot.r, spot.r + 15], opacity: [0.8, 0], strokeWidth: [2, 0] }} 
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }} 
                  />
                )}
                
                {/* Hover/Active Label (SVG Tooltip) */}
                <g className={clsx(
                  "transition-opacity duration-200 pointer-events-none",
                  selectedPart === spot.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}>
                  <rect x={spot.cx + spot.r + 5} y={spot.cy - 10} width="95" height="20" rx="2" fill="rgba(15, 23, 42, 0.9)" stroke={selectedPart === spot.id ? "rgba(34, 211, 238, 0.9)" : "rgba(34, 211, 238, 0.5)"} strokeWidth={selectedPart === spot.id ? "1" : "0.5"} filter={selectedPart === spot.id ? "url(#subtleGlow)" : ""} />
                  <text x={spot.cx + spot.r + 10} y={spot.cy + 3} fill="#e2e8f0" fontSize="9" fontFamily="monospace" letterSpacing="0.05em">{spot.label}</text>
                  <line x1={spot.cx + spot.r} y1={spot.cy} x2={spot.cx + spot.r + 5} y2={spot.cy} stroke="rgba(34, 211, 238, 0.5)" strokeWidth="0.5" />
                </g>
              </motion.g>
            ))}
          </motion.g>
        </svg>
      </motion.div>
      
      {/* Reset Button */}
      <AnimatePresence initial={false}>
        {selectedPart && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => onSelectPart(null)}
            className="absolute bottom-6 bg-[#050810]/80 backdrop-blur-md border border-slate-700/50 text-slate-300 px-6 py-2 text-xs font-mono tracking-widest hover:bg-slate-800 hover:text-white transition-colors uppercase rounded shadow-lg"
          >
            Reset Analysis
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BodyMap;
