
import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, subHours } from "date-fns";

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

    return [...data]
      .sort((a, b) => b.timestamp - a.timestamp) // Sort descending (newest first)
      .reverse() // Reverse to get ascending order (oldest first)
      .map((item) => {
        const fallProbability = item.fall_probability / 100;
        const positionValue = item.stand_probability;
        const timestamp = item.timestamp;

        return {
          name: format(new Date(timestamp * 1000), 'HH:mm:ss'),
          probability: Number(fallProbability),
          position: Number(positionValue),
          timestamp: new Date(timestamp * 1000)
        };
      });
  }, [data]);

  const last24HoursData = useMemo(() => {
    const cutoffTime = subHours(new Date(), 24);
    return chartData.filter(item => item.timestamp > cutoffTime);
  }, [chartData]);

  const lastHourData = useMemo(() => {
    const cutoffTime = subHours(new Date(), 1);
    return chartData.filter(item => item.timestamp > cutoffTime);
  }, [chartData]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Fall Probability (24 Hours)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={last24HoursData}>
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
                <Line
                  type="monotone"
                  dataKey="probability"
                  stroke="#7829B0"
                  strokeWidth={2}
                  dot={false}
                  name="Fall Probability"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Fall Probability (Last Hour)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lastHourData}>
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
                <Line
                  type="monotone"
                  dataKey="probability"
                  stroke="#7829B0"
                  strokeWidth={2}
                  dot={false}
                  name="Fall Probability"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Position (24 Hours)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={last24HoursData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis 
                  domain={[0, 1]}
                  ticks={[0, 1]}
                  tickFormatter={(value) => value === 1 ? 'Standing' : 'Sitting'}
                />
                <Tooltip 
                  formatter={(value: number) => value === 1 ? 'Standing' : 'Sitting'}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="position"
                  stroke="#7829B0"
                  strokeWidth={2}
                  dot={false}
                  name="Position"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Position (Last Hour)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lastHourData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis 
                  domain={[0, 1]}
                  ticks={[0, 1]}
                  tickFormatter={(value) => value === 1 ? 'Standing' : 'Sitting'}
                />
                <Tooltip 
                  formatter={(value: number) => value === 1 ? 'Standing' : 'Sitting'}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="position"
                  stroke="#7829B0"
                  strokeWidth={2}
                  dot={false}
                  name="Position"
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
