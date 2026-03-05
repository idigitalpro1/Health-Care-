import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight } from 'lucide-react';

const modules = [
  { id: 'investigations', title: 'Investigations', items: [
    { title: 'The Hidden Cost of Delayed Screenings', excerpt: 'A deep dive into how postponing routine checks affects long-term health outcomes.', author: 'Maria Gonzalez', date: 'Mar 4' },
    { title: 'Uncovering the Roots of Local Asthma Rates', excerpt: 'Environmental factors and their correlation with pediatric respiratory issues in South Denver.', author: 'Dr. James Wilson', date: 'Mar 2' }
  ]},
  { id: 'specialist-briefs', title: 'Specialist Briefs', items: [
    { title: 'New Protocols in Concussion Management', excerpt: 'Updated guidelines for student athletes returning to play.', author: 'Dr. Marcus Thorne', date: 'Mar 5' },
    { title: 'Advances in Minimally Invasive Spine Surgery', excerpt: 'How new robotic techniques are reducing recovery times by 50%.', author: 'Dr. Sarah Jenkins', date: 'Mar 1' }
  ]},
  { id: 'clinical-trends', title: 'Clinical Trends', items: [
    { title: 'The Rise of Telehealth for Mental Wellness', excerpt: 'Virtual therapy sessions see a 300% increase year-over-year.', author: 'Emily Carter', date: 'Feb 28' },
    { title: 'Personalized Medicine: The Future of Oncology', excerpt: 'Genetic profiling is changing how we approach cancer treatment.', author: 'Dr. Elena Rostova', date: 'Feb 25' }
  ]},
  { id: 'community-outcomes', title: 'Community Outcomes', items: [
    { title: 'South Denver General Recognized for Cardiac Care', excerpt: 'Hospital receives top national honors for patient survival rates.', author: 'The Villager Staff', date: 'Feb 20' },
    { title: 'Local Wellness Initiative Shows Promising Results', excerpt: 'Community garden project linked to improved dietary habits in participants.', author: 'Maria Gonzalez', date: 'Feb 18' }
  ]},
  { id: 'sponsored', title: 'Sponsored Content', items: [
    { title: 'Understanding Your Medicare Options for 2027', excerpt: 'A comprehensive guide to navigating the upcoming changes in coverage.', author: 'HealthPartners Insurance', date: 'Mar 1', isSponsored: true }
  ]}
];

const InfiniteFeed: React.FC = () => {
  const [visibleModules, setVisibleModules] = useState<number>(2);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleModules < modules.length && !isLoading) {
          setIsLoading(true);
          setTimeout(() => {
            setVisibleModules(prev => Math.min(prev + 1, modules.length));
            setIsLoading(false);
          }, 800); // Simulate network delay
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [visibleModules, isLoading]);

  return (
    <div className="mt-12 border-t-4 border-slate-900 pt-8">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-widest" style={{ fontFamily: '"Playfair Display", serif' }}>
          More Health Intelligence
        </h2>
        <div className="flex-1 h-px bg-slate-300"></div>
      </div>

      <div className="space-y-12">
        <AnimatePresence initial={false}>
          {modules.slice(0, visibleModules).map((mod, index) => (
            <motion.section 
              key={mod.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
              <div className="md:col-span-1 border-t-2 border-slate-900 pt-2">
                <h3 className="font-bold text-slate-900 uppercase tracking-widest text-sm flex items-center gap-2">
                  {mod.title}
                  {('isSponsored' in mod.items[0] && mod.items[0].isSponsored) && <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-sm">SPONSORED</span>}
                </h3>
              </div>
              <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {mod.items.map((item, i) => (
                  <article key={i} className="group cursor-pointer border-b border-slate-200 pb-6 sm:border-b-0 sm:pb-0">
                    <h4 className="text-lg font-bold text-slate-900 mb-2 leading-tight group-hover:text-blue-700 transition-colors" style={{ fontFamily: '"Playfair Display", serif' }}>
                      {item.title}
                    </h4>
                    <p className="text-sm text-slate-600 leading-snug mb-3 font-serif" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                      {item.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <span>By {item.author}</span>
                      <span>•</span>
                      <span className="uppercase">{item.date}</span>
                    </div>
                  </article>
                ))}
              </div>
            </motion.section>
          ))}
        </AnimatePresence>

        {/* Loading Indicator / Skeleton */}
        {visibleModules < modules.length && (
          <div ref={loaderRef} className="py-8 flex justify-center">
            {isLoading ? (
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            ) : (
              <div className="h-8"></div> // Spacer to trigger observer
            )}
          </div>
        )}
        
        {visibleModules === modules.length && (
          <div className="text-center py-8 text-sm text-slate-500 font-mono uppercase tracking-widest border-t border-slate-200">
            End of Feed
          </div>
        )}
      </div>
    </div>
  );
};

export default InfiniteFeed;
