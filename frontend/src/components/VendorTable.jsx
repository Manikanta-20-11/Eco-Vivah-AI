const VendorTable = ({ optimizer }) => {
  if (!optimizer || !optimizer.selected_vendors) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-green-600 text-white">
              <th className="p-3 font-medium text-sm">Type</th>
              <th className="p-3 font-medium text-sm">Vendor Name</th>
              <th className="p-3 font-medium text-sm">Distance</th>
              <th className="p-3 font-medium text-sm">Cost</th>
              <th className="p-3 font-medium text-sm text-center">Eco Certified</th>
            </tr>
          </thead>
          <tbody>
            {optimizer.selected_vendors.map((vendor, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-green-50'}>
                <td className="p-3 text-sm capitalize text-gray-700">{vendor.type}</td>
                <td className="p-3 text-sm font-medium text-gray-900">{vendor.name}</td>
                <td className="p-3 text-sm text-gray-600">{vendor.distance_km?.toFixed(2)} km</td>
                <td className="p-3 text-sm text-gray-600">₹{vendor.cost_inr?.toFixed(2)}</td>
                <td className="p-3 text-sm text-center">
                  {vendor.eco_certified ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      ✓ Yes
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      ✗ No
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="bg-gray-50 p-4 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-gray-700 font-medium">
          Total Cost: <span className="font-bold text-gray-900">₹{optimizer.total_cost_inr?.toFixed(2)}</span>
        </div>
        <div className="text-gray-700 font-medium">
          CO2 Saved vs Baseline: <span className="font-bold text-green-600">{optimizer.co2_savings_kg?.toFixed(2)} kg</span>
        </div>
      </div>
    </div>
  );
};

export default VendorTable;
