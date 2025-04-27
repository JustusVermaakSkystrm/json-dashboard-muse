
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartDataPoint } from "@/types/chart";

interface FallProbabilityChartProps {
  data: ChartDataPoint[];
  title: string;
}

const FallProbabilityChart = ({ data, title }: FallProbabilityChartProps) => {
  // Debug the incoming data
  if (data && data.length > 0) {
    console.log("FallProbabilityChart received data points:", data.length);
    console.log("First data point:", data[0]);
  } else {
    console.log("FallProbabilityChart: No data available");
  }

  return (
    <Card className="bg-white/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={70}
              />
              <YAxis 
                domain={[0, 1]}
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              />
              <Tooltip 
                formatter={(value: number) => `${(value * 100).toFixed(1)}%`}
              />
              <Legend />
              <ReferenceLine y={0.5} stroke="red" strokeDasharray="3 3" />
              <Line
                type="monotone"
                dataKey="probability"
                stroke="#7829B0"
                strokeWidth={2}
                dot={false}
                name="Fall Probability"
                isAnimationActive={false} // Disable animation for smoother updates
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default FallProbabilityChart;
