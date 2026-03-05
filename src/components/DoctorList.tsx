import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MapPin, Calendar } from 'lucide-react';
import { Doctor } from '../data';
import DoctorModal from './DoctorModal';

interface DoctorListProps {
  doctors: Doctor[];
  selectedPart: string | null;
}

const DoctorList: React.FC<DoctorListProps> = ({ doctors, selectedPart }) => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const filteredDoctors = selectedPart
    ? doctors.filter((doc) => doc.bodyParts.includes(selectedPart))
    : doctors;

  return (
    <>
      <div className="bg-[#1a1a1a] rounded-xl shadow-2xl border border-slate-800 p-4 h-full overflow-hidden flex flex-col">
        {/* Simplified Header for Side Columns */}
        <div className="mb-4 text-center border-b border-slate-800 pb-2">
          <h3 className="font-mono font-bold text-blue-400 uppercase tracking-[0.2em] text-[10px]">
            SYSTEM_SPECIALISTS_V2.0
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
          <AnimatePresence mode="popLayout" initial={false}>
            {filteredDoctors.map((doctor) => (
              <motion.div
                key={doctor.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)", borderColor: "rgba(59, 130, 246, 0.5)" }}
                onClick={() => setSelectedDoctor(doctor)}
                className="bg-[#242424] rounded-lg p-3 border border-slate-800 cursor-pointer relative group transition-all"
              >
                <div className="flex gap-3 items-center">
                  <div className="relative shrink-0">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-700 grayscale group-hover:grayscale-0 transition-all"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-[8px] font-bold px-1 py-0.5 rounded border border-blue-400 flex items-center shadow-lg">
                      {doctor.rating}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-100 text-xs truncate font-mono uppercase tracking-tight">{doctor.name}</h3>
                    <p className="text-blue-400 text-[10px] font-mono truncate opacity-80">{doctor.specialty}</p>
                    
                    <div className="mt-1 flex items-center justify-between">
                       <div className="flex items-center text-[9px] text-slate-500 truncate max-w-[60%] font-mono">
                        <MapPin size={8} className="mr-1 text-slate-600" />
                        <span className="truncate">{doctor.location}</span>
                      </div>
                      {selectedPart && (
                        <span className="text-emerald-400 text-[9px] font-mono font-bold">
                          MATCH_{doctor.matchScore}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Technical Accent */}
                <div className="absolute top-0 right-0 w-1 h-1 bg-blue-500/20 rounded-bl-full"></div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredDoctors.length === 0 && (
            <div className="text-center py-12 text-slate-600 font-mono text-xs uppercase tracking-widest">
              <p>NO_MATCHES_FOUND</p>
            </div>
          )}
        </div>
      </div>

      <DoctorModal 
        doctor={selectedDoctor} 
        onClose={() => setSelectedDoctor(null)} 
      />
    </>
  );
};

export default DoctorList;
