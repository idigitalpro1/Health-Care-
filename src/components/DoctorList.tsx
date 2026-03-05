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
      <div className="bg-[#fcfbf9] rounded-xl shadow-md border border-[#d4c5b0] p-4 h-full overflow-hidden flex flex-col">
        {/* Simplified Header for Side Columns */}
        <div className="mb-4 text-center border-b border-[#d4c5b0] pb-2">
          <h3 className="font-serif font-bold text-[#5c4d3c] uppercase tracking-widest text-sm">
            Specialists
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {filteredDoctors.map((doctor) => (
              <motion.div
                key={doctor.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ scale: 1.03, y: -2, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onClick={() => setSelectedDoctor(doctor)}
                className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 cursor-pointer relative z-0 hover:z-10 hover:border-blue-300"
              >
                <div className="flex gap-3 items-center">
                  <div className="relative shrink-0">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-12 h-12 rounded-full object-cover border border-gray-200"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-green-100 text-green-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-green-200 flex items-center shadow-sm">
                      <Star size={8} className="mr-0.5 fill-current" />
                      {doctor.rating}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm truncate font-serif">{doctor.name}</h3>
                    <p className="text-blue-700 text-xs font-medium truncate">{doctor.specialty}</p>
                    
                    <div className="mt-1 flex items-center justify-between">
                       <div className="flex items-center text-[10px] text-gray-500 truncate max-w-[60%]">
                        <MapPin size={10} className="mr-1 text-gray-400" />
                        <span className="truncate">{doctor.location}</span>
                      </div>
                      {selectedPart && (
                        <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-blue-100">
                          {doctor.matchScore}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredDoctors.length === 0 && (
            <div className="text-center py-12 text-gray-400 font-serif italic">
              <p>No specialists available in this section.</p>
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
