
import { useMemo } from "react";
import { format, subHours } from "date-fns";
import { DataPoint } from "@/types/chart";
import FallProbabilityChart from "./charts/FallProbabilityChart";
import PositionChart from "./charts/PositionChart";

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
