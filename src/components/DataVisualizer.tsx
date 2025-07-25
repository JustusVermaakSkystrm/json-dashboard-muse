
import { useMemo } from "react";
import { format, subHours } from "date-fns";
import { DataPoint } from "@/types/chart";
import FallProbabilityChart from "./charts/FallProbabilityChart";
import GaugeChart from "./charts/GaugeChart";
import { PersonStanding, ArrowDownToLine } from "lucide-react";

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
    
    const sortedData = [...data].sort((a, b) => a.timestamp - b.timestamp);
    
    const baseData = sortedData.map((item) => {
      const fallProbability = item.fall_probability / 100;
      // Make sure we multiply by 100 to convert from 0-1 to 0-100 percentage
      const sitProbability = (item.sit_probability || 0) * 100; 
      const standProbability = (item.stand_probability || 0) * 100; 
      const timestamp = item.timestamp;

      return {
        name: format(new Date(timestamp * 1000), 'HH:mm:ss'),
        probability: Number(fallProbability),
        sitProbability,
        standProbability,
        timestamp: new Date(timestamp * 1000)
      };
    });

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

  const currentValues = useMemo(() => {
    if (chartData.length === 0) return { probability: 0, isStanding: false };
    const latest = chartData[chartData.length - 1]; // Use the last item in the array
    const isStanding = (latest.standProbability || 0) > (latest.sitProbability || 0);
    return {
      probability: latest.probability,
      isStanding
    };
  }, [chartData]);

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="flex justify-center items-center gap-4">
        <GaugeChart 
          value={currentValues.probability}
          title="Status" 
        />
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center justify-center w-[200px] h-[200px]">
          {currentValues.isStanding ? (
            <>
              <PersonStanding className="w-24 h-24 text-green-400" />
              <span className="text-white mt-2">Standing</span>
            </>
          ) : (
            <>
              <ArrowDownToLine className="w-24 h-24 text-blue-400" />
              <span className="text-white mt-2">Sitting</span>
            </>
          )}
        </div>
      </div>
      <FallProbabilityChart 
        data={lastHourData} 
        title="Fall Probability (Last Hour)" 
      />
    </div>
  );
};

export default DataVisualizer;
