
import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DataVisualizerProps {
  data: any;
}

const DataVisualizer = ({ data }: DataVisualizerProps) => {
  const chartData = useMemo(() => {
    if (Array.isArray(data)) {
      // If data is an array, try to find numeric values to visualize
      return data.map((item, index) => {
        const numericValues = Object.entries(item).reduce(
          (acc: any, [key, value]) => {
            if (typeof value === "number") {
              acc[key] = value;
            }
            return acc;
          },
          { name: `Item ${index + 1}` }
        );
        return numericValues;
      });
    } else {
      // If data is an object, create a single entry
      const numericValues = Object.entries(data).reduce(
        (acc: any, [key, value]) => {
          if (typeof value === "number") {
            acc[key] = value;
          }
          return acc;
        },
        { name: "Data" }
      );
      return [numericValues];
    }
  }, [data]);

  const dataKeys = Object.keys(chartData[0] || {}).filter(
    (key) => key !== "name"
  );

  return (
    <Card className="bg-white/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Data Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              {dataKeys.map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={`hsl(${(index * 360) / dataKeys.length}, 70%, 50%)`}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataVisualizer;
