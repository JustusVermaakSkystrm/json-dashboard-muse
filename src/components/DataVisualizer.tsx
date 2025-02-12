
import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface DataPoint {
  timestamp: number;
  com: { x: number; y: number };
  velocity: { x: number; y: number };
  acceleration: { x: number; y: number };
  trunk_angle: number;
  fall_probability: number;
  hip_angle: number;
  sit_probability: number;
  stand_probability: number;
  landmarks: any[];
}

interface DataVisualizerProps {
  data: DataPoint[];
}

const DataVisualizer = ({ data }: DataVisualizerProps) => {
  const chartData = useMemo(() => {
    if (!Array.isArray(data)) return [];

    return data.map((item) => {
      // Ensure we're using the exact field names from the Python script
      const fallProbability = item.fall_probability / 100; // Convert to decimal
      const hipAngle = item.hip_angle;
      const timestamp = item.timestamp;

      return {
        name: format(new Date(timestamp * 1000), 'HH:mm:ss'),
        probability: Number(fallProbability),
        hipAngle: Number(hipAngle),
        trunkAngle: Number(item.trunk_angle),
        sitProbability: Number(item.sit_probability) / 100,
        standProbability: Number(item.stand_probability) / 100,
        timestamp
      };
    });
  }, [data]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Fall Probability Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
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
                <Line
                  type="monotone"
                  dataKey="probability"
                  stroke="#7829B0"
                  strokeWidth={2}
                  dot={{ fill: "#7829B0" }}
                  name="Fall Probability"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Hip Angle Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="hipAngle"
                  stroke="#7829B0"
                  strokeWidth={2}
                  dot={{ fill: "#7829B0" }}
                  name="Hip Angle"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataVisualizer;
