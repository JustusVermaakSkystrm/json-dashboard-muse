
import { useMemo } from "react";
import { format, subHours } from "date-fns";
import { DataPoint } from "@/types/chart";
import FallProbabilityChart from "./charts/FallProbabilityChart";
import PositionChart from "./charts/PositionChart";

interface DataVisualizerProps {
  data: DataPoint[];
}

const calculateMovingAverage = (data: any[], periods: number, key: string) => {
  return data.map((item, index) => {
    const start = Math.max(0, index - periods + 1);
    const values = data.slice(start, index + 1).map(d => d[key]);
    const sum = values.reduce((acc, val) => acc + val, 0);
    const average = values.length > 0 ? sum / values.length : 0;
    return {
      ...item,
      [key]: average
    };
  });
};

const DataVisualizer = ({ data }: DataVisualizerProps) => {
  const chartData = useMemo(() => {
    if (!Array.isArray(data)) return [];

    // First, create the base data points
    const baseData = [...data]
      .sort((a, b) => b.timestamp - a.timestamp)
      .reverse()
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

    // Apply moving averages
    return calculateMovingAverage(
      calculateMovingAverage(baseData, 20, 'probability'),
      20,
      'position'
    );
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
      <FallProbabilityChart 
        data={last24HoursData} 
        title="Fall Probability (24 Hours)" 
      />
      <FallProbabilityChart 
        data={lastHourData} 
        title="Fall Probability (Last Hour)" 
      />
      <PositionChart 
        data={last24HoursData} 
        title="Position (24 Hours)" 
      />
      <PositionChart 
        data={lastHourData} 
        title="Position (Last Hour)" 
      />
    </div>
  );
};

export default DataVisualizer;
