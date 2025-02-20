
import { PureComponent } from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

interface GaugeChartProps {
  value: number;
  title: string;
}

const GaugeChart = ({ value, title }: GaugeChartProps) => {
  const data = [
    {
      name: 'value',
      value: value * 100, // Convert to percentage
      fill: value > 0.5 ? '#ef4444' : '#22c55e',
    },
  ];

  return (
    <div className="w-[200px] h-[200px] bg-white/5 backdrop-blur-sm rounded-lg p-4">
      <h3 className="text-lg font-medium text-white mb-2 text-center">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="60%"
          outerRadius="100%"
          barSize={10}
          data={data}
          startAngle={180}
          endAngle={0}
        >
          <RadialBar
            background
            dataKey="value"
            cornerRadius={30}
            fill="#82ca9d"
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="text-center text-white text-xl mt-2">
        {(value * 100).toFixed(1)}%
      </div>
    </div>
  );
};

export default GaugeChart;
