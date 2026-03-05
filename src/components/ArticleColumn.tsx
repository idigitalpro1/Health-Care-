import React from 'react';
import { motion } from 'motion/react';

const ArticleColumn: React.FC = () => {
  return (
    <div className="bg-[#fcfbf9] rounded-xl shadow-md border border-[#d4c5b0] p-5 h-full overflow-y-auto custom-scrollbar flex flex-col font-serif">
      {/* Editorial Header */}
      <div className="border-b-2 border-black mb-4 pb-2">
        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Opinion & Analysis</h4>
        <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-2">
          The Pulse of South Denver: Navigating Our Healthcare Landscape
        </h2>
        <div className="flex items-center gap-3 mt-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-300 grayscale">
            <img 
              src="https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=200&h=200" 
              alt="Patrick Henry Sweeney"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">By Patrick Henry Sweeney</p>
            <p className="text-xs text-gray-600 italic">The Villager</p>
          </div>
        </div>
      </div>

      {/* Article Body */}
      <div className="text-gray-800 text-sm leading-relaxed space-y-4 text-justify">
        <p>
          <span className="float-left text-4xl font-bold mr-2 mt-[-6px] font-serif">A</span>s we stand at the crossroads of innovation and tradition in South Denver's medical community, the question isn't just about access—it's about the <em>quality</em> of the connection between patient and provider.
        </p>
        
        <p>
          Recent data from the Colorado Health Institute suggests that while coverage has expanded, the complexity of navigating specialist networks remains a significant barrier for our residents in Highlands Ranch, Greenwood Village, and Cherry Hills.
        </p>

        <h5 className="font-bold text-black mt-4 mb-1 uppercase text-xs tracking-wide">The Cost of Confusion</h5>
        <p>
          "It's a maze," says local resident Martha Higgins. "I spent three weeks just trying to find a knee specialist who accepts my insurance and has availability." Her story is not unique. The fragmentation of our local systems often leaves patients in pain, waiting for answers.
        </p>

        <div className="my-4 border-l-4 border-blue-800 pl-4 py-1 italic text-gray-600 bg-blue-50 pr-2">
          "We need a return to the 'Vitruvian' ideal—where the human form is seen as a whole, not just a collection of billable codes."
        </div>

        <p>
          This is why initiatives like the <strong>South Denver Health Map</strong> are critical. By visualizing care and putting the patient's anatomy at the center of the search, we strip away the bureaucratic layers. It's about restoring the human element to a digital process.
        </p>

        <h5 className="font-bold text-black mt-4 mb-1 uppercase text-xs tracking-wide">Looking Ahead</h5>
        <p>
          With UCHealth and Centura expanding their footprints, the competition is fierce. But for the consumer, competition should yield better outcomes. We must demand transparency in pricing, clarity in outcomes, and above all, a healthcare system that recognizes us as people first.
        </p>
        
        <p>
          As we move into the next quarter, keep an eye on the proposed telehealth regulations in the state legislature. They could fundamentally change how we interact with our doctors. Until then, stay informed, stay healthy, and keep asking the hard questions.
        </p>
      </div>
      
      {/* Footer / Signature */}
      <div className="mt-8 pt-4 border-t border-gray-300 text-center">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Signature_sample.svg/1200px-Signature_sample.svg.png" 
          alt="Signature" 
          className="h-8 mx-auto opacity-60 mb-2"
        />
        <p className="text-[10px] text-gray-500 uppercase tracking-widest">
          Patrick Henry Sweeney is the Publisher of The Villager
        </p>
      </div>
    </div>
  );
};

export default ArticleColumn;
