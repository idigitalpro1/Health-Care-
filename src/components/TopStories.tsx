import React from 'react';

const stories = [
  {
    id: 1,
    title: "Breakthrough in Non-Invasive Cardiac Imaging",
    excerpt: "New MRI techniques at South Denver General are reducing the need for exploratory procedures by 40%.",
    byline: "Dr. Elena Rostova",
    date: "Mar 5",
    tag: "Cardiology",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400&h=300"
  },
  {
    id: 2,
    title: "Rising Cases of RSV: What Parents Need to Know",
    excerpt: "Local pediatric wards see a 15% uptick in respiratory syncytial virus cases this month.",
    byline: "James Wilson",
    date: "Mar 4",
    tag: "Pediatrics"
  },
  {
    id: 3,
    title: "The Mediterranean Diet's Impact on Longevity",
    excerpt: "A 10-year study of Colorado residents shows significant cardiovascular benefits.",
    byline: "Sarah Jenkins, RD",
    date: "Mar 3",
    tag: "Wellness"
  },
  {
    id: 4,
    title: "Advances in Robotic Surgery Techniques",
    excerpt: "Minimally invasive robotic procedures are now standard for joint replacements.",
    byline: "Dr. Michael Chen",
    date: "Mar 2",
    tag: "Technology"
  }
];

const TopStories: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="border-b-2 border-slate-900 pb-2 mb-2">
        <h2 className="font-bold text-slate-900 uppercase tracking-widest text-sm">Top Stories & Opinion</h2>
      </div>
      
      <div className="flex flex-col gap-6">
        {stories.map((story, index) => (
          <article key={story.id} className={`group cursor-pointer ${index !== stories.length - 1 ? 'border-b border-slate-200 pb-6' : ''}`}>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">{story.tag}</span>
                  <span className="text-[10px] text-slate-400">•</span>
                  <span className="text-[10px] text-slate-500 uppercase">{story.date}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight group-hover:text-blue-700 transition-colors" style={{ fontFamily: '"Playfair Display", serif' }}>
                  {story.title}
                </h3>
                <p className="text-sm text-slate-600 leading-snug mb-2 font-serif" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                  {story.excerpt}
                </p>
                <div className="text-xs text-slate-500 font-medium">
                  By {story.byline}
                </div>
              </div>
              {story.image && (
                <div className="w-24 h-24 shrink-0 overflow-hidden">
                  <img 
                    src={story.image} 
                    alt={story.title} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Author Bio Card Example */}
      <div className="mt-4 bg-slate-50 border border-slate-200 p-4">
        <div className="flex items-center gap-3 mb-2">
          <img 
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150&h=150" 
            alt="Dr. Elena Rostova" 
            className="w-10 h-10 rounded-full object-cover grayscale"
            referrerPolicy="no-referrer"
          />
          <div>
            <h4 className="text-sm font-bold text-slate-900">Dr. Elena Rostova</h4>
            <p className="text-[10px] uppercase tracking-wider text-slate-500">Chief of Cardiology</p>
          </div>
        </div>
        <p className="text-xs text-slate-600 font-serif leading-relaxed mb-3" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
          Dr. Rostova specializes in non-invasive imaging and preventive cardiology, bringing 20 years of clinical excellence to South Denver.
        </p>
        <button className="text-xs font-bold text-blue-700 uppercase tracking-wider hover:underline">
          Follow Author →
        </button>
      </div>
    </div>
  );
};

export default TopStories;
