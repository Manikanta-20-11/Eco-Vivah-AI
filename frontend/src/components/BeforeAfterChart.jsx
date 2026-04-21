import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BeforeAfterChart = ({ mlPrediction }) => {
  if (!mlPrediction) return null;

  const data = [
    {
      name: 'Food (kg)',
      Baseline: mlPrediction.baseline_food_kg || 0,
      Optimized: mlPrediction.predicted_food_kg || 0,
    }
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 w-full">
      <h3 className="text-xl font-bold text-gray-800 mb-6 text-center md:text-left">⚖️ Baseline vs ML Optimized</h3>

      <div style={{ width: '100%', minWidth: 0 }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            barGap={30}
            barSize={80}
          >
            <XAxis dataKey="name" tick={{ fontSize: 14, fontWeight: 500 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              cursor={{ fill: '#f3f4f6' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} verticalAlign="top" height={50} />
            <Bar dataKey="Baseline" fill="#9ca3af" radius={[4, 4, 0, 0]} isAnimationActive={true} />
            <Bar dataKey="Optimized" fill="#16a34a" radius={[4, 4, 0, 0]} isAnimationActive={true} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 max-w-2xl mx-auto">
        <p className="text-green-800 font-semibold text-center text-lg">
          🌿 ML saves {mlPrediction.savings_kg?.toFixed(2)} kg ({mlPrediction.savings_percent}%) compared to standard estimate
        </p>
      </div>
    </div>
  );
};

export default BeforeAfterChart;