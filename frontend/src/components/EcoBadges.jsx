const EcoBadges = ({ impact, mlPrediction, optimizer }) => {
  if (!impact || !mlPrediction || !optimizer) return null;

  const hasEcoVendor = (type) => {
    return optimizer.selected_vendors?.some(v => v.type.toLowerCase() === type.toLowerCase() && v.eco_certified);
  };

  const basicBadges = [
    {
      id: "zero_waste",
      icon: "🌱",
      name: "Zero Waste Hero",
      condition: mlPrediction.savings_percent >= 15,
      description: "Reduced food waste by 15% or more!",
      colorClass: "bg-green-100 text-green-900 border-green-200"
    },
    {
      id: "solar_champion",
      icon: "☀️",
      name: "Solar Champion",
      condition: hasEcoVendor("lighting"),
      description: "Chose eco-certified lighting!",
      colorClass: "bg-amber-100 text-amber-900 border-amber-200"
    },
    {
      id: "green_caterer",
      icon: "🌿",
      name: "Green Caterer",
      condition: hasEcoVendor("catering"),
      description: "Chose an eco-certified caterer!",
      colorClass: "bg-green-100 text-green-900 border-green-200"
    },
    {
      id: "clean_transport",
      icon: "🚌",
      name: "Clean Transport",
      condition: hasEcoVendor("transport"),
      description: "Chose eco-certified transport!",
      colorClass: "bg-blue-100 text-blue-900 border-blue-200"
    },
    {
      id: "eco_decorator",
      icon: "💐",
      name: "Eco Decorator",
      condition: hasEcoVendor("decoration"),
      description: "Chose an eco-certified decorator!",
      colorClass: "bg-rose-100 text-rose-900 border-rose-200"
    },
    {
      id: "carbon_conscious",
      icon: "🌍",
      name: "Carbon Conscious",
      condition: impact.total_carbon_kg_co2 < 2000,
      description: "Total carbon footprint under 2000 kg!",
      colorClass: "bg-teal-100 text-teal-900 border-teal-200"
    },
    {
      id: "water_saver",
      icon: "💧",
      name: "Water Saver",
      condition: impact.total_water_litres < 50000,
      description: "Water usage under 50,000 litres!",
      colorClass: "bg-blue-100 text-blue-900 border-blue-200"
    }
  ];

  const earnedBasic = basicBadges.filter(b => b.condition).length;

  const badges = [
    ...basicBadges, // Oops, variable typo
    {
      id: "eco_champion",
      icon: "🏆",
      name: "Eco Champion",
      condition: earnedBasic >= 5,
      description: "Outstanding eco-friendly wedding planning!",
      colorClass: "bg-yellow-100 text-yellow-900 border-yellow-300"
    }
  ];

  const earnedTotal = badges.filter(b => b.condition).length;

  let message = "💡 Try choosing eco-certified vendors to earn badges!";
  let messageColor = "text-gray-600";
  if (earnedTotal >= 7) {
    message = "🌟 Exceptional! Your wedding is a sustainability role model!";
    messageColor = "text-yellow-700 font-bold";
  } else if (earnedTotal >= 4) {
    message = "👏 Great job! You're making a real difference!";
    messageColor = "text-green-700 font-bold";
  } else if (earnedTotal >= 1) {
    message = "🌱 Good start! A few more eco choices can earn more badges.";
    messageColor = "text-green-600 font-medium";
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 w-full border border-gray-100">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800">🏅 Your Eco Badges</h3>
        <p className="text-gray-500 text-sm mt-1">{earnedTotal} / 8 badges earned</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {badges.map((badge) => {
          const isEarned = badge.condition;

          return (
            <div
              key={badge.id}
              className={`
                relative flex flex-col items-center justify-center text-center p-4 rounded-xl border
                ${isEarned
                  ? `${badge.colorClass} hover:scale-105 transition-transform duration-200 cursor-default z-10`
                  : 'bg-gray-50 border-gray-200 opacity-40 grayscale'}
              `}
            >
              {isEarned && (
                <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                  ✓ Earned
                </div>
              )}
              <span className="text-4xl mb-2">{badge.icon}</span>
              <span className="font-bold text-sm mb-1">{badge.name}</span>
              <span className="text-xs leading-tight opacity-90">{badge.description}</span>
            </div>
          );
        })}
      </div>

      <div className="text-center w-full mt-2">
        <p className={`text-base ${messageColor}`}>{message}</p>
      </div>
    </div>
  );
};

export default EcoBadges;
