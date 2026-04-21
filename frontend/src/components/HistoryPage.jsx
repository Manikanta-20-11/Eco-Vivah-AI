import { useEffect, useState } from 'react';
import { getHistory } from '../api';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getHistory();
        setHistory(response.data.history || []);
      } catch (err) {
        console.error("Failed to load history", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
        <p className="text-gray-600 font-medium">Loading history...</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-4xl mb-4 text-gray-300">📊</span>
        <p className="text-gray-500 text-lg">No wedding plans yet. Generate your first eco plan above!</p>
      </div>
    );
  }

  const validScores = history.map(h => h.sustainability_score).filter(s => s != null);
  const avgScore = validScores.length ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length) : 0;
  const totalCarbon = Math.round(history.reduce((a, b) => a + (b.carbon_estimate_kg || 0), 0));

  return (
    <div className="animate-fade-in transition-all duration-500">
      <div className="mb-8 border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-800">📋 Wedding Planning History</h2>
        <p className="text-gray-500 mt-1">Your last 20 eco wedding plans</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-green-50 border border-green-100 p-4 rounded-xl text-center">
          <span className="block text-2xl font-bold text-green-700">{history.length}</span>
          <span className="text-sm font-medium text-green-800">Total Plans</span>
        </div>
        <div className="bg-green-50 border border-green-100 p-4 rounded-xl text-center">
          <span className="block text-2xl font-bold text-green-700">{avgScore}/100</span>
          <span className="text-sm font-medium text-green-800">Avg Score</span>
        </div>
        <div className="bg-green-50 border border-green-100 p-4 rounded-xl text-center">
          <span className="block text-2xl font-bold text-green-700">{totalCarbon.toLocaleString()} kg</span>
          <span className="text-sm font-medium text-green-800">Total Carbon</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {history.map((record) => {
          let carbonColor = "text-green-600";
          if (record.carbon_estimate_kg > 3000) carbonColor = "text-red-500";
          else if (record.carbon_estimate_kg > 1500) carbonColor = "text-amber-500";

          // Format D-MMM-YYYY strictly ensuring clean UI bounds avoiding ISO strings
          const dateStr = new Date(record.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
          let firstTip = record.waste_reduction_tips?.[0] || "";
          if (firstTip.length > 100) firstTip = firstTip.substring(0, 100) + '...';

          return (
            <div key={record.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">

              <div className="bg-green-600 p-4 flex justify-between items-center text-white">
                <div>
                  <div className="font-bold text-lg">Plan #{record.id}</div>
                  <div className="text-sm text-green-100 opacity-90">{dateStr}</div>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold">{record.sustainability_score != null ? record.sustainability_score : "N/A"}</span>
                  <span className="text-sm text-green-100 ml-1">/ 100</span>
                </div>
              </div>

              <div className="p-5 flex flex-col gap-4 text-sm leading-snug">
                <div className="text-gray-700 font-medium flex items-center gap-2">
                  <span>👥 {record.num_guests} guests</span>
                  <span className="text-gray-300">•</span>
                  <span>📅 {record.duration_days} day(s)</span>
                  <span className="text-gray-300">•</span>
                  <span>📍 {record.venue_location}</span>
                </div>

                {record.sub_events?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {record.sub_events.map((se, i) => (
                      <span key={i} className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs">{se}</span>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <span className="text-xs text-gray-500 block mb-1">🌍 Carbon</span>
                    <span className={`font-bold ${carbonColor}`}>{Math.round(record.carbon_estimate_kg || 0).toLocaleString()} kg CO2</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <span className="text-xs text-gray-500 block mb-1">🍽 Food</span>
                    <span className="font-bold text-gray-700">{Math.round(record.food_quantity_kg || 0).toLocaleString()} kg</span>
                  </div>
                </div>

                {record.sdg_tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {record.sdg_tags.map((tag, i) => (
                      <span key={i} className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full text-xs font-medium">{tag}</span>
                    ))}
                  </div>
                )}

                {firstTip && (
                  <div className="italic text-gray-500 text-xs mt-1">
                    {firstTip}
                  </div>
                )}
              </div>

              <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center text-sm gap-2">
                <span className="font-semibold text-green-800">Budget: INR {record.budget_inr?.toLocaleString()}</span>
                {record.cultural_preferences?.length > 0 && (
                  <span className="text-gray-500 md:text-right md:truncate md:max-w-[60%] w-full">{record.cultural_preferences.join(', ')}</span>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryPage;
