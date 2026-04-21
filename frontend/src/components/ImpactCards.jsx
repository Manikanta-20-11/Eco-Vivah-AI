const ImpactCards = ({ impact }) => {
  if (!impact) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
        <span className="text-2xl mb-1">🍽</span>
        <span className="text-2xl font-bold text-green-600">{impact.total_food_kg?.toFixed(2)} kg</span>
        <span className="text-sm text-gray-500">Total Food</span>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
        <span className="text-2xl mb-1">♻️</span>
        <span className="text-2xl font-bold text-green-600">{impact.estimated_waste_kg?.toFixed(2)} kg</span>
        <span className="text-sm text-gray-500">Food Waste</span>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
        <span className="text-2xl mb-1">⚡</span>
        <span className="text-2xl font-bold text-green-600">{impact.total_energy_kwh?.toFixed(2)} kWh</span>
        <span className="text-sm text-gray-500">Energy</span>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
        <span className="text-2xl mb-1">💧</span>
        <span className="text-2xl font-bold text-green-600">{impact.total_water_litres?.toFixed(2)} L</span>
        <span className="text-sm text-gray-500">Water</span>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
        <span className="text-2xl mb-1">🚗</span>
        <span className="text-2xl font-bold text-green-600">{impact.transport_emissions_kg_co2?.toFixed(2)} kg</span>
        <span className="text-sm text-gray-500">Transport CO2</span>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
        <span className="text-2xl mb-1">🌍</span>
        <span className="text-2xl font-bold text-green-600">{impact.total_carbon_kg_co2?.toFixed(2)} kg</span>
        <span className="text-sm text-gray-500">Total Carbon</span>
      </div>
    </div>
  );
};

export default ImpactCards;
