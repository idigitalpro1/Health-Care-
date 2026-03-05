import React from 'react';
import { motion } from 'motion/react';

const NewsTicker: React.FC = () => {
  return (
    <div className="bg-red-700 text-white overflow-hidden py-2 shadow-md relative z-40">
      <div className="flex whitespace-nowrap">
        <motion.div
          className="flex gap-8 items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        >
          {[...Array(2)].map((_, i) => (
            <React.Fragment key={i}>
              <span className="font-bold uppercase tracking-wider">BREAKING:</span>
              <span>South Denver Health: New Urgent Care Center Opens in Highlands Ranch</span>
              <span className="text-red-300">•</span>
              <span className="font-bold uppercase tracking-wider">ALERT:</span>
              <span>Flu Season Peaking - Get Your Shot Today at CVS or Walgreens</span>
              <span className="text-red-300">•</span>
              <span className="font-bold uppercase tracking-wider">UPDATE:</span>
              <span>UCHealth Announces New Telehealth Initiative for Rural Colorado</span>
              <span className="text-red-300">•</span>
              <span className="font-bold uppercase tracking-wider">COMMUNITY:</span>
              <span>Free Health Screenings at Denver Union Station this Saturday</span>
              <span className="text-red-300">•</span>
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default NewsTicker;
