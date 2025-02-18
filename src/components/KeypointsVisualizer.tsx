
import { useMemo } from "react";
import { DataPoint } from "@/types/chart";

interface KeypointsVisualizerProps {
  data: DataPoint[];
}

const calculateMovingAverage = (data: any[], periods: number) => {
  return data.map((item, index) => {
    // Add null check for keypoints
    if (!item.keypoints || !Array.isArray(item.keypoints)) {
      return item;
    }

    const start = Math.max(0, index - periods + 1);
    const points = data.slice(start, index + 1)
      .filter(point => point.keypoints && Array.isArray(point.keypoints));
    
    if (points.length === 0) return item;

    // Calculate average for each keypoint
    const averagedKeypoints = item.keypoints.map((_, keypointIndex) => {
      const sum = points.reduce((acc, point) => {
        const keypoint = point.keypoints[keypointIndex];
        if (!keypoint) return acc;
        
        return {
          x: acc.x + (keypoint.x || 0),
          y: acc.y + (keypoint.y || 0),
          z: acc.z + (keypoint.z || 0),
          index: keypointIndex
        };
      }, { x: 0, y: 0, z: 0, index: 0 });

      return {
        x: sum.x / points.length,
        y: sum.y / points.length,
        z: sum.z / points.length,
        index: sum.index
      };
    });

    return {
      ...item,
      keypoints: averagedKeypoints
    };
  });
};

// Define connections between keypoints to draw the stick figure
const connections = [
  // Torso
  [11, 12], // shoulders
  [11, 23], // right hip
  [12, 24], // left hip
  [23, 24], // hips
  
  // Right arm
  [11, 13], // upper arm
  [13, 15], // forearm
  [15, 17], // hand
  
  // Left arm
  [12, 14], // upper arm
  [14, 16], // forearm
  [16, 18], // hand
  
  // Right leg
  [23, 25], // thigh
  [25, 27], // shin
  [27, 29], // foot
  [29, 31], // toe
  
  // Left leg
  [24, 26], // thigh
  [26, 28], // shin
  [28, 30], // foot
  [30, 32], // toe
];

const KeypointsVisualizer = ({ data }: KeypointsVisualizerProps) => {
  const latestData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return null;
    
    // Check if any data point has keypoints
    const hasKeypoints = data.some(item => item.keypoints && Array.isArray(item.keypoints));
    if (!hasKeypoints) {
      console.log("No keypoint data found in the dataset");
      return null;
    }

    // Apply 5-period moving average
    const smoothedData = calculateMovingAverage(data, 5);
    return smoothedData[smoothedData.length - 1];
  }, [data]);

  if (!latestData || !latestData.keypoints) {
    return (
      <div className="flex items-center justify-center h-64 bg-white/5 rounded-lg">
        <p className="text-white">No keypoint data available</p>
      </div>
    );
  }

  // Canvas dimensions
  const width = 400;
  const height = 600;
  
  // Scale factors to fit the visualization in our canvas
  const scaleX = width * 0.8;
  const scaleY = height * 0.8;
  const offsetX = width * 0.1;
  const offsetY = height * 0.1;

  return (
    <div className="relative bg-white/5 rounded-lg p-4">
      <h3 className="text-white mb-4 text-lg font-medium">Body Pose Visualization (5-period MA)</h3>
      <svg width={width} height={height} className="mx-auto">
        {/* Draw connections (stick figure lines) */}
        {connections.map(([start, end], index) => {
          const startPoint = latestData.keypoints.find(k => k.index === start);
          const endPoint = latestData.keypoints.find(k => k.index === end);
          
          if (!startPoint || !endPoint) return null;
          
          return (
            <line
              key={`connection-${index}`}
              x1={startPoint.x * scaleX + offsetX}
              y1={startPoint.y * scaleY + offsetY}
              x2={endPoint.x * scaleX + offsetX}
              y2={endPoint.y * scaleY + offsetY}
              stroke="white"
              strokeWidth="2"
            />
          );
        })}
        
        {/* Draw keypoints */}
        {latestData.keypoints.map((point, index) => (
          <circle
            key={`point-${index}`}
            cx={point.x * scaleX + offsetX}
            cy={point.y * scaleY + offsetY}
            r="4"
            fill="#FF800A"
          />
        ))}
      </svg>
    </div>
  );
};

export default KeypointsVisualizer;
