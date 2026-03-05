import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const stories = [
  {
    id: 1,
    title: "Breakthrough in Non-Invasive Cardiac Imaging",
    byline: "Dr. Elena Rostova",
    date: "March 5, 2026",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800&h=400",
    category: "Cardiology"
  },
  {
    id: 2,
    title: "New Pediatric Wing Opens at South Denver General",
    byline: "James Wilson",
    date: "March 4, 2026",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800&h=400",
    category: "Local News"
  },
  {
    id: 3,
    title: "Understanding the Latest Nutrition Guidelines",
    byline: "Sarah Jenkins, RD",
    date: "March 3, 2026",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800&h=400",
    category: "Wellness"
  },
  {
    id: 4,
    title: "Advances in Robotic Surgery Techniques",
    byline: "Dr. Michael Chen",
    date: "March 2, 2026",
    image: "https://images.unsplash.com/photo-1551076805-e1869043e560?auto=format&fit=crop&q=80&w=800&h=400",
    category: "Technology"
  }
];

const FeaturedStories: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white border border-gray-900 mb-8 relative overflow-hidden group">
      <div className="absolute top-0 left-0 bg-gray-900 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 z-20">
        Featured Stories
      </div>
      
      <div className="relative h-[400px] w-full">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <img 
              src={stories[currentIndex].image} 
              alt={stories[currentIndex].title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
              <span className="text-xs font-bold tracking-widest uppercase text-gray-300 mb-2 block">
                {stories[currentIndex].category}
              </span>
              <h2 className="text-2xl md:text-4xl font-bold mb-2 leading-tight" style={{ fontFamily: '"Playfair Display", serif' }}>
                {stories[currentIndex].title}
              </h2>
              <div className="flex items-center gap-4 text-sm text-gray-300 font-mono">
                <span>By {stories[currentIndex].byline}</span>
                <span>•</span>
                <span>{stories[currentIndex].date}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-4 right-4 flex gap-2 z-20">
        {stories.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentIndex ? 'bg-white w-6' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedStories;
