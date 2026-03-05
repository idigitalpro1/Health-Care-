import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import BodyMap from './BodyMap';
import { doctors } from '../data';
import { ChevronRight, Star, Calendar, ArrowRight, Activity, Stethoscope, Brain, Heart, Bone } from 'lucide-react';

const regionInsights: Record<string, { title: string, description: string, stats: string, icon: React.ReactNode }> = {
  head: { title: "Cranial & Neurology", description: "Advanced imaging and treatment for neurological conditions, including stroke prevention and memory care.", stats: "Top 5% Nationally", icon: <Brain size={16} /> },
  neck: { title: "Cervical & Thyroid", description: "Specialized care for thyroid disorders, neck pain, and cervical spine conditions.", stats: "98% Success Rate", icon: <Activity size={16} /> },
  shoulder: { title: "Shoulder & Rotator Cuff", description: "Minimally invasive arthroscopy and total shoulder replacement programs.", stats: "Fast Recovery", icon: <Bone size={16} /> },
  upperArm: { title: "Upper Arm & Bicep", description: "Treatment for muscle tears, tendonitis, and humerus fractures.", stats: "Specialized Care", icon: <Activity size={16} /> },
  elbow: { title: "Elbow & Joint", description: "Comprehensive care for tennis elbow, golfer's elbow, and complex fractures.", stats: "Expert Surgeons", icon: <Bone size={16} /> },
  forearm: { title: "Forearm & Tendons", description: "Specialized hand therapy and surgical intervention for trauma.", stats: "Advanced Rehab", icon: <Activity size={16} /> },
  wristHand: { title: "Wrist & Hand", description: "Carpal tunnel release, trigger finger treatment, and intricate microsurgery.", stats: "Precision Care", icon: <Stethoscope size={16} /> },
  chest: { title: "Thoracic & Cardiology", description: "Comprehensive heart and lung care, featuring our new non-invasive cardiac imaging center.", stats: "Award-winning Care", icon: <Heart size={16} /> },
  abdomen: { title: "Abdominal & GI", description: "Advanced gastroenterology, hernia repair, and minimally invasive general surgery.", stats: "Leading Technology", icon: <Activity size={16} /> },
  back: { title: "Lumbar & Spine", description: "Minimally invasive spine surgery and comprehensive pain management programs.", stats: "Fastest Recovery Time", icon: <Bone size={16} /> },
  hip: { title: "Pelvis & Orthopedics", description: "Robotic-assisted joint replacement and sports medicine for optimal mobility.", stats: "Over 1,000 Procedures/Yr", icon: <Bone size={16} /> },
  thigh: { title: "Thigh & Femur", description: "Treatment for quad/hamstring tears and complex femur fractures.", stats: "Sports Medicine", icon: <Activity size={16} /> },
  knee: { title: "Knee & Joint", description: "Advanced arthroscopic techniques and personalized rehabilitation plans.", stats: "95% Patient Satisfaction", icon: <Bone size={16} /> },
  calf: { title: "Calf & Achilles", description: "Specialized care for Achilles ruptures, DVT screening, and muscle strains.", stats: "Rapid Diagnosis", icon: <Activity size={16} /> },
  ankleFoot: { title: "Ankle & Foot", description: "Comprehensive podiatry, ankle replacement, and diabetic foot care.", stats: "Complete Care", icon: <Bone size={16} /> },
};

const InteractiveAnatomyModule: React.FC = () => {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  const insight = selectedPart ? regionInsights[selectedPart] : null;
  
  // Find specialists based on selected part
  const matchedDoctors = selectedPart 
    ? doctors.filter(d => d.bodyParts.includes(selectedPart)).slice(0, 2)
    : [];

  return (
    <div className="flex flex-col h-full border border-slate-800 bg-[#0a0f1a] text-slate-200 relative overflow-hidden rounded-xl shadow-2xl">
      {/* Subtle Da Vinci Sketchbook Background Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
      }}></div>
      
      <div className="border-b border-slate-800/50 p-4 flex justify-between items-center bg-[#050810]/80 backdrop-blur-md relative z-10">
        <h2 className="font-bold text-white uppercase tracking-widest text-sm flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
          </span>
          Interactive Anatomy
        </h2>
        <span className="text-[10px] font-mono text-cyan-500/70 uppercase tracking-widest border border-cyan-900/50 px-2 py-1 rounded bg-cyan-950/20">Select Region for Analysis</span>
      </div>
      
      <div className="flex-1 relative flex flex-col md:flex-row">
        {/* Body Map Area */}
        <div className="flex-1 relative min-h-[500px] md:min-h-[600px] flex items-center justify-center p-4">
          <BodyMap selectedPart={selectedPart} onSelectPart={setSelectedPart} />
        </div>

        {/* Insights Panel */}
        <AnimatePresence initial={false}>
          {selectedPart && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full md:w-80 bg-[#050810]/95 backdrop-blur-xl border-l border-slate-800/50 p-6 flex flex-col overflow-y-auto custom-scrollbar relative z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]"
            >
              <div className="mb-6 relative">
                <div className="absolute -top-2 -left-2 text-slate-800 opacity-20">
                  <Activity size={120} strokeWidth={0.5} />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-cyan-400 text-[10px] font-mono uppercase tracking-widest">Region Analysis</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-cyan-900 to-transparent"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2" style={{ fontFamily: '"Playfair Display", serif' }}>
                    {insight?.icon}
                    {insight?.title || "Region Selected"}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed font-serif" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                    {insight?.description || "Select a specific region to view detailed health intelligence and matched specialists."}
                  </p>
                  {insight?.stats && (
                    <div className="mt-5 inline-flex items-center gap-2 border border-cyan-900/50 bg-cyan-950/20 px-3 py-1.5 text-xs font-mono text-cyan-300 rounded-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                      {insight.stats}
                    </div>
                  )}
                </div>
              </div>

              {matchedDoctors.length > 0 && (
                <div className="mt-auto pt-6 border-t border-slate-800/50">
                  <div className="flex items-center gap-2 mb-5">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Matched Specialists</span>
                  </div>
                  <div className="space-y-5">
                    {matchedDoctors.map(doc => (
                      <div key={doc.id} className="group cursor-pointer bg-slate-900/30 p-3 rounded-lg border border-slate-800/50 hover:border-cyan-900/50 hover:bg-slate-800/50 transition-all">
                        <div className="flex gap-3 items-center">
                          <div className="relative">
                            <img src={doc.image} alt={doc.name} className="w-12 h-12 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 border border-slate-700" />
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#050810] rounded-full"></div>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">{doc.name}</h4>
                              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/30 px-1.5 py-0.5 rounded border border-cyan-900/50">{doc.matchScore}% Match</span>
                            </div>
                            <p className="text-[10px] text-cyan-500/80 uppercase tracking-wider mb-1">{doc.specialty}</p>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-1">
                              <span className="flex items-center text-yellow-500"><Star size={10} className="mr-1 fill-current" /> {doc.rating.toFixed(1)}</span>
                              {(() => {
                                const isToday = doc.availability.toLowerCase().includes('today');
                                const isTomorrow = doc.availability.toLowerCase().includes('tomorrow');
                                const text = doc.availability.replace('Next Available: ', '').replace('Available in ', '');
                                
                                if (isToday) {
                                  return (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-900/50 text-[8px] font-bold uppercase tracking-wider shrink-0">
                                      <Calendar size={8} /> Today
                                    </span>
                                  );
                                } else if (isTomorrow) {
                                  return (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-950/40 text-amber-400 border border-amber-900/50 text-[8px] font-bold uppercase tracking-wider shrink-0">
                                      <Calendar size={8} /> Tomorrow
                                    </span>
                                  );
                                } else {
                                  return (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800/50 text-slate-300 border border-slate-700/50 text-[8px] font-bold uppercase tracking-wider shrink-0">
                                      <Calendar size={8} /> {text}
                                    </span>
                                  );
                                }
                              })()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="mt-6 w-full py-3 border border-slate-700 text-xs font-mono uppercase tracking-widest text-slate-300 hover:bg-cyan-950/30 hover:text-cyan-400 hover:border-cyan-800 transition-all flex items-center justify-center gap-2 rounded-sm group">
                    View All Specialists <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InteractiveAnatomyModule;
