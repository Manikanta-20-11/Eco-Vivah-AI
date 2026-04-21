import { useEffect, useState } from 'react';

const CarbonGauge = ({ totalCarbon = 0 }) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const maxCarbon = 5000;
  
  useEffect(() => {
    let startTimestamp = null;
    const duration = 1500;
    
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setAnimatedValue(easeProgress * totalCarbon);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [totalCarbon]);

  let color = '#16a34a'; // Green
  let statusText = 'Low impact';
  if (totalCarbon >= 1500 && totalCarbon <= 3000) {
    color = '#d97706'; // Amber
    statusText = 'Medium impact';
  } else if (totalCarbon > 3000) {
    color = '#dc2626'; // Red
    statusText = 'High impact';
  }

  const radius = 80;
  const strokeWidth = 16;
  const cx = 100;
  const cy = 100;
  const circumference = Math.PI * radius;
  
  const displayValue = Math.min(animatedValue, maxCarbon);
  const percent = displayValue / maxCarbon;
  const strokeDashoffset = circumference - (percent * circumference);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 text-center h-full flex flex-col items-center">
      <h3 className="text-xl font-bold text-gray-800 mb-6 w-full text-center">🌍 Carbon Footprint Gauge</h3>
      
      <div className="relative flex justify-center items-center h-28 overflow-hidden mb-4">
        <svg width="200" height="110" viewBox="0 0 200 110" className="overflow-visible">
          <path
            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <path
            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-300 ease-out"
          />
        </svg>
        
        <div className="absolute top-[45px] flex flex-col items-center">
          <span className="text-3xl font-bold" style={{ color }}>
            {Math.round(animatedValue)} <span className="text-base font-semibold">kg</span>
          </span>
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wide mt-1">CO2 Footprint</span>
        </div>
      </div>
      
      <div className="mt-auto flex flex-col items-start text-sm text-gray-600 space-y-2 pt-4 border-t border-gray-100 w-full px-2">
        <div className="flex items-center gap-2">
          <span>🟢 Under 1500 kg — Low impact</span>
        </div>
        <div className="flex items-center gap-2">
          <span>🟡 1500–3000 kg — Medium impact</span>
        </div>
        <div className="flex items-center gap-2">
          <span>🔴 Over 3000 kg — High impact</span>
        </div>
      </div>
    </div>
  );
};

export default CarbonGauge;
