import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, MapPin, Calendar, Stethoscope } from 'lucide-react';
import { doctors } from '../data';

const categories = [
  { id: 'cardiology', label: 'Cardiology' },
  { id: 'pediatrics', label: 'Pediatrics' },
  { id: 'wellness', label: 'Wellness' },
  { id: 'orthopedics', label: 'Orthopedics' },
  { id: 'neurology', label: 'Neurology' },
  { id: 'primary-care', label: 'Primary Care' },
];

const DirectoryRail: React.FC = () => {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="bg-slate-50 border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-2">
          <Stethoscope size={16} className="text-slate-900" />
          <h3 className="font-bold text-slate-900 uppercase tracking-widest text-xs">Provider Directory</h3>
        </div>
        
        <div className="flex flex-col gap-6">
          {categories.map(category => {
            const categoryDoctors = doctors.filter(d => d.category === category.id);
            const isExpanded = expandedCategories[category.id];
            const visibleDoctors = isExpanded ? categoryDoctors : categoryDoctors.slice(0, 2);

            return (
              <div key={category.id} className="flex flex-col gap-3">
                <h4 className="font-bold text-slate-900 uppercase tracking-widest text-[10px] border-b border-slate-200 pb-1">
                  {category.label}
                </h4>
                
                <div className="flex flex-col gap-3">
                  <AnimatePresence initial={false}>
                    {visibleDoctors.map(doc => (
                      <motion.div 
                        key={doc.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="group cursor-pointer bg-white p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden focus-within:ring-2 focus-within:ring-blue-500"
                      >
                        <div className="flex gap-3 items-center">
                          <div className="relative shrink-0">
                            <img src={doc.image} alt={doc.name} className="w-10 h-10 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300 border border-slate-300" referrerPolicy="no-referrer" />
                            <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-[8px] font-bold px-1 py-0.5 rounded border border-white flex items-center shadow-sm">
                              {doc.rating.toFixed(1)}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate">{doc.name}</h4>
                            <p className="text-[9px] text-slate-500 uppercase tracking-wider mb-1 truncate">{doc.specialty}</p>
                            <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono mt-1">
                              <span className="flex items-center truncate max-w-[50%]"><MapPin size={8} className="mr-1" /> {doc.location}</span>
                              {(() => {
                                const isToday = doc.availability.toLowerCase().includes('today');
                                const isTomorrow = doc.availability.toLowerCase().includes('tomorrow');
                                const text = doc.availability.replace('Next Available: ', '').replace('Available in ', '');
                                
                                if (isToday) {
                                  return (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[8px] font-bold uppercase tracking-wider shrink-0">
                                      <Calendar size={8} /> Today
                                    </span>
                                  );
                                } else if (isTomorrow) {
                                  return (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[8px] font-bold uppercase tracking-wider shrink-0">
                                      <Calendar size={8} /> Tomorrow
                                    </span>
                                  );
                                } else {
                                  return (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200 text-[8px] font-bold uppercase tracking-wider shrink-0">
                                      <Calendar size={8} /> {text}
                                    </span>
                                  );
                                }
                              })()}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                
                {categoryDoctors.length > 2 && (
                  <button 
                    onClick={() => toggleCategory(category.id)}
                    className="text-[10px] font-bold text-blue-700 uppercase tracking-widest hover:underline self-start flex items-center gap-1 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                  >
                    {isExpanded ? (
                      <>Show less <ChevronUp size={12} /></>
                    ) : (
                      <>Show all 6 <ChevronDown size={12} /></>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DirectoryRail;
