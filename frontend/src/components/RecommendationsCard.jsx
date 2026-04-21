const RecommendationsCard = ({ recommendations }) => {
  if (!recommendations || Object.keys(recommendations).length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100 flex items-center justify-center text-red-600">
        ⚠️ AI recommendations unavailable — quota exceeded. Try again tomorrow.
      </div>
    );
  }

  const score = recommendations.sustainability_score || 0;
  let scoreColor = 'text-green-600 border-green-600 bg-green-50';
  if (score < 40) scoreColor = 'text-red-600 border-red-600 bg-red-50';
  else if (score < 70) scoreColor = 'text-amber-600 border-amber-600 bg-amber-50';

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
      
      <div className="flex flex-col items-center text-center space-y-3 pb-6 border-b border-gray-100">
        <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center ${scoreColor}`}>
          <span className="text-3xl font-bold">{score}</span>
        </div>
        <p className="text-gray-600 max-w-xl">{recommendations.score_explanation}</p>
        
        <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
          {recommendations.sdg_tags?.map((tag, idx) => (
             <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
               {tag}
             </span>
          ))}
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 pb-6 border-b border-gray-100">
        <div>
          <h4 className="font-semibold text-gray-800 flex items-center mb-3">
            <span className="mr-2">♻️</span> Waste Reduction Strategies
          </h4>
          <ol className="list-decimal pl-5 text-gray-600 space-y-2 text-sm">
            {recommendations.waste_reduction_strategies?.map((strat, i) => (
              <li key={i}>{strat}</li>
            ))}
          </ol>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-800 flex items-center mb-3">
            <span className="mr-2">🏪</span> Vendor Recommendations
          </h4>
          <ul className="list-disc pl-5 text-gray-600 space-y-2 text-sm">
            {recommendations.vendor_recommendations?.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 pb-6 border-b border-gray-100">
        <div>
          <h4 className="font-semibold text-gray-800 flex items-center mb-3">
            <span className="mr-2">⚡</span> Energy Tips
          </h4>
          <ul className="list-disc pl-5 text-gray-600 space-y-2 text-sm">
            {recommendations.energy_recommendations?.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-800 flex items-center mb-3">
            <span className="mr-2">🪔</span> Cultural Tips
          </h4>
          <ul className="list-disc pl-5 text-gray-600 space-y-2 text-sm">
            {recommendations.cultural_sustainability_tips?.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="bg-green-50 p-5 rounded-lg border border-green-100 mt-2">
        <h4 className="font-semibold text-green-800 mb-2">📊 Impact Summary</h4>
        <p className="text-gray-700 text-sm leading-relaxed">
          {recommendations.estimated_impact_summary}
        </p>
      </div>

    </div>
  );
};

export default RecommendationsCard;
