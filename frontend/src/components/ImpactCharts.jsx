import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const ImpactCharts = ({ impact }) => {
  if (!impact) return null;

  const barData = [
    { name: 'Food (kg)', value: impact.total_food_kg || 0 },
    { name: 'Energy (kWh)', value: impact.total_energy_kwh || 0 },
    { name: 'Water (÷100 L)', value: (impact.total_water_litres || 0) / 100 },
    { name: 'Decoration Waste (kg)', value: impact.decoration_waste_kg || 0 }
  ];

  const energyCarbonApprox = Math.max(0, (impact.total_carbon_kg_co2 || 0) - (impact.transport_emissions_kg_co2 || 0));
  const pieData = [
    { name: 'Energy Carbon', value: energyCarbonApprox },
    { name: 'Transport Carbon', value: impact.transport_emissions_kg_co2 || 0 }
  ];

  const COLORS = ['#16a34a', '#3b82f6'];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    if (percent === 0) return null;
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 w-full flex flex-col md:flex-row gap-8">

      {/* Left Chart - Bar Chart */}
      <div className="w-full md:w-[60%] flex flex-col" style={{ minWidth: 0 }}>
        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">📊 Resource Usage Breakdown</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData} margin={{ top: 10, right: 20, left: 0, bottom: 40 }}>
            <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              cursor={{ fill: '#f3f4f6' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="value" fill="#16a34a" radius={[4, 4, 0, 0]} isAnimationActive={true} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Right Chart - Pie Chart */}
      <div className="w-full md:w-[40%] flex flex-col border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-6" style={{ minWidth: 0 }}>
        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">🌍 Carbon Sources</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="45%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={95}
              dataKey="value"
              isAnimationActive={true}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default ImpactCharts;