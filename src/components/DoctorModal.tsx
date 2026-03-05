import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Calendar, Star, GraduationCap, Globe, Clock, Bookmark, CalendarPlus, Share2, Check } from 'lucide-react';
import { Doctor } from '../data';

interface DoctorModalProps {
  doctor: Doctor | null;
  onClose: () => void;
}

const DoctorModal: React.FC<DoctorModalProps> = ({ doctor, onClose }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [showCalendarOptions, setShowCalendarOptions] = useState(false);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    // In a real app, this would save to local storage or backend
  };

  const handleAddToCalendar = (type: 'google' | 'apple' | 'outlook', e: React.MouseEvent) => {
    e.stopPropagation();
    if (!doctor) return;

    const title = `Consultation with ${doctor.name}`;
    const details = `Specialty: ${doctor.specialty}\nLocation: ${doctor.location}\nBio: ${doctor.bio}`;
    const location = doctor.location;
    
    // Mock dates for demo - next available slot
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 2); // 2 days from now
    startDate.setHours(10, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setHours(11, 0, 0, 0);

    let url = '';

    if (type === 'google') {
      const start = startDate.toISOString().replace(/-|:|\.\d\d\d/g, '');
      const end = endDate.toISOString().replace(/-|:|\.\d\d\d/g, '');
      url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
    } else if (type === 'outlook') {
      url = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}&startdt=${startDate.toISOString()}&enddt=${endDate.toISOString()}`;
    } else if (type === 'apple') {
      // For Apple/iCal, we'd typically generate a .ics file blob
      const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${title}
DESCRIPTION:${details}
LOCATION:${location}
DTSTART:${startDate.toISOString().replace(/-|:|\.\d\d\d/g, '')}
DTEND:${endDate.toISOString().replace(/-|:|\.\d\d\d/g, '')}
END:VEVENT
END:VCALENDAR`;
      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      url = URL.createObjectURL(blob);
    }

    window.open(url, '_blank');
    setShowCalendarOptions(false);
  };

  if (!doctor) return null;

  return (
    <AnimatePresence initial={false}>
      {doctor && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
      >
        {/* Modal Content - Newspaper Style */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#fcfbf9] w-full max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar relative shadow-2xl border-4 border-double border-[#5c4d3c]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-[#f4f1ea] border border-[#d4c5b0] text-[#5c4d3c] hover:bg-[#5c4d3c] hover:text-white transition-colors z-10 rounded-none"
          >
            <X size={24} />
          </button>

          <div className="flex flex-col md:flex-row">
            {/* Left Column: Image & Quick Stats */}
            <div className="md:w-1/3 bg-[#e8e4d9] p-6 border-r border-[#d4c5b0] flex flex-col items-center text-center">
              <div className="w-48 h-48 mb-6 relative">
                <div className="absolute inset-0 border-4 border-[#5c4d3c] transform rotate-3"></div>
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover border border-[#5c4d3c] relative z-10 grayscale-[20%] sepia-[10%]"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <h2 className="font-serif text-2xl font-bold text-[#2c2c2c] mb-2 leading-tight">
                {doctor.name}
              </h2>
              <p className="font-serif italic text-[#5c4d3c] mb-6 border-b border-[#d4c5b0] pb-4 w-full">
                {doctor.specialty}
              </p>

              <div className="space-y-4 w-full mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-[#5c4d3c] uppercase tracking-wider text-xs">Rating</span>
                  <div className="flex items-center text-[#8b0000]">
                    <Star size={14} className="fill-current mr-1" />
                    <span className="font-bold font-mono">{doctor.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-[#5c4d3c] uppercase tracking-wider text-xs">Exp.</span>
                  <span className="font-mono text-[#2c2c2c]">{doctor.experience} Yrs</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-[#5c4d3c] uppercase tracking-wider text-xs">Langs</span>
                  <span className="font-serif italic text-[#2c2c2c] text-xs text-right">{doctor.languages.join(', ')}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full space-y-2">
                <button 
                  onClick={handleSave}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-colors ${
                    isSaved 
                      ? 'bg-[#5c4d3c] text-white border-[#5c4d3c]' 
                      : 'bg-transparent text-[#5c4d3c] border-[#5c4d3c] hover:bg-[#e0dbce]'
                  }`}
                >
                  {isSaved ? <Check size={14} /> : <Bookmark size={14} />}
                  {isSaved ? 'Saved' : 'Save for Later'}
                </button>

                <div className="relative">
                  <button 
                    onClick={() => setShowCalendarOptions(!showCalendarOptions)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest bg-transparent text-[#5c4d3c] border border-[#5c4d3c] hover:bg-[#e0dbce] transition-colors"
                  >
                    <CalendarPlus size={14} />
                    Add to Calendar
                  </button>
                  
                  {showCalendarOptions && (
                    <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-[#d4c5b0] shadow-lg z-20 flex flex-col text-left">
                      <button onClick={(e) => handleAddToCalendar('google', e)} className="px-4 py-2 hover:bg-[#f4f1ea] text-xs font-serif text-[#2c2c2c]">Google Calendar</button>
                      <button onClick={(e) => handleAddToCalendar('apple', e)} className="px-4 py-2 hover:bg-[#f4f1ea] text-xs font-serif text-[#2c2c2c]">Apple Calendar (iCal)</button>
                      <button onClick={(e) => handleAddToCalendar('outlook', e)} className="px-4 py-2 hover:bg-[#f4f1ea] text-xs font-serif text-[#2c2c2c]">Outlook</button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Detailed Bio */}
            <div className="md:w-2/3 p-8 font-serif">
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#8b0000] mb-2">
                  Professional Profile
                </h3>
                <h4 className="text-3xl font-bold text-[#2c2c2c] mb-4 leading-none">
                  A Legacy of Care
                </h4>
                <p className="text-gray-700 leading-relaxed text-justify first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:mt-[-6px]">
                  {doctor.bio}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 border-t border-b border-[#d4c5b0] py-6">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-[#5c4d3c]">
                    <GraduationCap size={18} />
                    <h5 className="font-bold uppercase text-xs tracking-widest">Education</h5>
                  </div>
                  <p className="text-sm text-gray-800">{doctor.education}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2 text-[#5c4d3c]">
                    <MapPin size={18} />
                    <h5 className="font-bold uppercase text-xs tracking-widest">Location</h5>
                  </div>
                  <p className="text-sm text-gray-800">{doctor.location}</p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-[#f4f1ea] p-4 border border-[#d4c5b0]">
                <div>
                  <div className="flex items-center gap-2 text-[#5c4d3c] mb-1">
                    <Calendar size={16} />
                    <span className="text-xs font-bold uppercase tracking-widest">Next Available</span>
                  </div>
                  <p className="font-mono text-lg font-bold text-[#2c2c2c]">{doctor.availability.split(':')[0]}</p>
                </div>
                <button className="bg-[#8b0000] text-[#f4f1ea] px-6 py-3 font-bold uppercase tracking-widest text-xs hover:bg-[#5c4d3c] transition-colors shadow-md">
                  Request Consult
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DoctorModal;
