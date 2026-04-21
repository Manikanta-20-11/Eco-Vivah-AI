import { useState } from 'react';
import { analyzeWedding } from '../api';

const InputForm = ({ onResult, onInputCapture }) => {
  const [guests, setGuests] = useState('');
  const [duration, setDuration] = useState('');
  const [subEvents, setSubEvents] = useState('');
  const [budget, setBudget] = useState('');
  const [preferences, setPreferences] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      num_guests: parseInt(guests),
      duration_days: parseInt(duration),
      sub_events: subEvents.split(',').map(s => s.trim()).filter(s => s),
      budget_inr: parseFloat(budget),
      cultural_preferences: preferences.split(',').map(s => s.trim()).filter(s => s),
      venue_location: location
    };

    if (onInputCapture) onInputCapture(payload);

    try {
      const response = await analyzeWedding(payload);
      onResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'API call failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold text-green-800 mb-4">Wedding Details</h2>
      {error && <div className="mb-4 text-red-600 bg-red-50 p-3 rounded">{error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Number of guests</label>
          <input type="number" min="10" max="10000" required value={guests} onChange={e => setGuests(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days)</label>
          <input type="number" min="1" max="7" required value={duration} onChange={e => setDuration(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Sub-events (comma separated)</label>
          <input type="text" required placeholder="Haldi, Sangeet, Reception" value={subEvents} onChange={e => setSubEvents(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Total budget (INR)</label>
          <input type="number" required min="1" value={budget} onChange={e => setBudget(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Cultural preferences</label>
          <input type="text" required placeholder="vegetarian, no plastic" value={preferences} onChange={e => setPreferences(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Venue location</label>
          <input type="text" required placeholder="Delhi" value={location} onChange={e => setLocation(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
        </div>
      </div>
      
      <button type="submit" disabled={loading}
        className="mt-6 w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg disabled:opacity-50 transition-colors">
        {loading ? 'Analyzing...' : '🌿 Generate Eco Plan'}
      </button>
    </form>
  );
};

export default InputForm;
