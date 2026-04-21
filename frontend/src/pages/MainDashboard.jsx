import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import InputForm from '../components/InputForm';
import CarbonGauge from '../components/CarbonGauge';
import ImpactCharts from '../components/ImpactCharts';
import BeforeAfterChart from '../components/BeforeAfterChart';
import EcoBadges from '../components/EcoBadges';
import VendorTable from '../components/VendorTable';
import RecommendationsCard from '../components/RecommendationsCard';
import ChatBox from '../components/ChatBox';

const MainDashboard = () => {
  const { user } = useAuth();
  const [result, setResult] = useState(null);
  const [weddingInput, setWeddingInput] = useState(null);

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';

  return (
    <div className="bg-gray-50 min-h-screen font-sans pb-16">
      <Navbar user={user} />
      
      <header className="bg-green-700 shadow-md relative z-20">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white flex items-center">
            <span className="mr-2">🌿</span> Eco-Vivah AI
          </h1>
          <p className="text-green-100 mt-1 text-base font-medium">Sustainable Indian Wedding Planner</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        
        <h2 className="text-2xl font-bold text-green-800 mb-6 font-serif">
          Welcome back, {displayName}! 🌿
        </h2>
        
        <InputForm 
          onResult={setResult} 
          onInputCapture={(payload) => setWeddingInput({ ...payload, user_id: user?.uid })} 
        />

        {result && (
          <div className="mt-12 space-y-10 animate-fade-in transition-all duration-500">
            
            <section>
              <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-3 border-b border-gray-200 pb-2">Environmental Impact Baseline</h2>
              <div className="flex flex-col md:flex-row gap-6 items-start mt-8">
                <div className="w-full md:w-[40%] flex justify-center">
                  <CarbonGauge totalCarbon={result.impact?.total_carbon_kg_co2 || 0} />
                </div>
                <div className="w-full md:w-[60%] flex">
                  <ImpactCharts impact={result.impact} />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-green-800 mt-12 mb-4 border-b border-gray-200 pb-2">ML Food Optimization</h2>
              <BeforeAfterChart mlPrediction={result.ml_prediction} />
            </section>

            <section>
              <h2 className="text-xl font-semibold text-green-800 mt-8 mb-3">🏅 Eco Achievements</h2>
              <EcoBadges
                impact={result.impact}
                mlPrediction={result.ml_prediction}
                optimizer={result.optimizer}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-green-800 mt-12 mb-4 border-b border-gray-200 pb-2">Vendor Selection</h2>
              <VendorTable optimizer={result.optimizer} />
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-green-800 mt-12 mb-4 border-b border-gray-200 pb-2">AI Eco Recommendations</h2>
              <RecommendationsCard recommendations={result.recommendations} />
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-green-800 mt-8 mb-3">
                💬 Chat with Your Eco Plan
              </h2>
              <ChatBox weddingInput={weddingInput} result={result} />
            </section>
            
          </div>
        )}
      </main>
    </div>
  );
};

export default MainDashboard;