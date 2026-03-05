import React from 'react';

const ProvidersSliver: React.FC = () => {
  const providers = [
    { name: 'UCHealth', color: 'text-gray-600' },
    { name: 'Centura Health', color: 'text-blue-800' },
    { name: 'HealthONE', color: 'text-teal-700' },
    { name: 'SCL Health', color: 'text-blue-600' },
    { name: 'Denver Health', color: 'text-red-700' },
    { name: 'Kaiser Permanente', color: 'text-blue-500' },
    { name: 'Children\'s Hospital', color: 'text-green-600' },
  ];

  return (
    <div className="bg-gray-100 border-t border-gray-200 py-3 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center gap-8 overflow-x-auto custom-scrollbar opacity-70 hover:opacity-100 transition-opacity">
        {providers.map((provider, idx) => (
          <div key={idx} className={`font-bold text-lg whitespace-nowrap ${provider.color} font-serif`}>
            {provider.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProvidersSliver;
