
import { useMemo } from "react";
import { format, subHours } from "date-fns";
import { DataPoint } from "@/types/chart";
import FallProbabilityChart from "./charts/FallProbabilityChart";
import GaugeChart from "./charts/GaugeChart";
import PositionChart from "./charts/PositionChart"; // Import PositionChart

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
    if (!Array.isArray(data) || data.length === 0) {
      console.log("DataVisualizer: No data available for chart");
      return [];
    }

    console.log("DataVisualizer processing", data.length, "data points");
    console.log("First data point timestamp:", new Date(data[0].timestamp * 1000).toLocaleString());
    
    // Process data in reverse chronological order (newest first)
    // We'll use the raw data instead of relying on sorting from the parent component
    const sortedData = [...data].sort((a, b) => b.timestamp - a.timestamp);
    
    // First, create the base data points
    const baseData = sortedData.map((item) => {
      const fallProbability = item.fall_probability / 100;
      const standProbability = item.stand_probability ? item.stand_probability / 100 : 0;
      const timestamp = item.timestamp;

      return {
        name: format(new Date(timestamp * 1000), 'HH:mm:ss'),
        probability: Number(fallProbability),
        position: standProbability > 0.5 ? 1 : 0, // 1 for standing, 0 for sitting
        timestamp: new Date(timestamp * 1000)
      };
    });

    // Apply moving averages with 5 period window
    return calculateMovingAverage(baseData, 5, 'probability');
  }, [data]);

  const lastHourData = useMemo(() => {
    if (chartData.length === 0) return [];
    
    const cutoffTime = subHours(new Date(), 1);
    const filtered = chartData.filter(item => item.timestamp > cutoffTime);
    console.log("DataVisualizer: Last hour data points:", filtered.length);
    
    if (filtered.length > 0) {
      console.log("Newest chart point:", filtered[0].name, "with probability:", filtered[0].probability);
    }
    
    return filtered;
  }, [chartData]);

  // Calculate current values (last value from 5-period moving average)
  const currentValues = useMemo(() => {
    if (chartData.length === 0) return { probability: 0 };
    const latest = chartData[0]; // Use the first item as it's the newest after sorting
    return {
      probability: latest.probability
    };
  }, [chartData]);

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="flex justify-center">
        <GaugeChart 
          value={currentValues.probability}
          title="Status" 
        />
      </div>
      <FallProbabilityChart 
        data={lastHourData} 
        title="Fall Probability (Last Hour)" 
      />
      <PositionChart 
        data={lastHourData}
        title="Position (1=Standing, 0=Sitting)"
      />
    </div>
  );
};

export default DataVisualizer;
