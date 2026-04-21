const MLCard = ({ mlPrediction }) => {
  if (!mlPrediction) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold text-green-800 mb-4">🤖 ML Food Prediction</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
          <span className="text-sm text-gray-500 mb-1">Standard Estimate</span>
          <span className="text-2xl font-bold text-gray-700">{mlPrediction.baseline_food_kg?.toFixed(2)} kg</span>
        </div>
        <div className="bg-green-50 p-4 rounded-lg flex flex-col items-center">
          <span className="text-sm text-gray-500 mb-1">ML Optimized</span>
          <span className="text-2xl font-bold text-green-600">{mlPrediction.predicted_food_kg?.toFixed(2)} kg</span>
        </div>
      </div>
      
      <div className="bg-green-100 border border-green-200 p-4 rounded-lg text-center mb-2">
        <p className="text-green-800 font-medium">
          You save {mlPrediction.savings_kg?.toFixed(2)} kg ({mlPrediction.savings_percent}%)
        </p>
      </div>
      
      <p className="text-center italic text-gray-500 text-sm mt-3 pb-2">
        {mlPrediction.recommendation}
      </p>
    </div>
  );
};

export default MLCard;
