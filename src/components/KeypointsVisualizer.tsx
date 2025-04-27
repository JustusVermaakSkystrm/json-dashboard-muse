
import { useMemo } from "react";
import { DataPoint, Keypoint } from "@/types/chart";

interface KeypointsVisualizerProps {
  data: DataPoint[];
}

const calculateMovingAverage = (data: DataPoint[], periods: number) => {
  return data.map((item, index) => {
    if (!item.keypoints || !Array.isArray(item.keypoints)) {
      console.log("Missing keypoints for item:", item);
      return item;
    }

    const start = Math.max(0, index - periods + 1);
    const points = data.slice(start, index + 1)
      .filter(point => point.keypoints && Array.isArray(point.keypoints));
    
    if (points.length === 0) {
      console.log("No valid points found for moving average");
      return item;
    }

    const averagedKeypoints = item.keypoints.map((_, keypointIndex) => {
      const sum = points.reduce((acc, point) => {
        const keypoint = point.keypoints ? point.keypoints[keypointIndex] : null;
        if (!keypoint) return acc;
        
        return {
          x: acc.x + (keypoint.x || 0),
          y: acc.y + (keypoint.y || 0),
          z: acc.z + (keypoint.z || 0),
          index: keypointIndex
        };
      }, { x: 0, y: 0, z: 0, index: keypointIndex });

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

const connections = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 0],
  
  [11, 12], // shoulders
  [11, 23], // right hip
  [12, 24], // left hip
  [23, 24], // hips
  
  [11, 13], // upper arm
  [13, 15], // forearm
  [15, 17], // hand
  
  [12, 14], // upper arm
  [14, 16], // forearm
  [16, 18], // hand
  
  [23, 25], // thigh
  [25, 27], // shin
  [27, 29], // foot
  [29, 31], // toe
  
  [24, 26], // thigh
  [26, 28], // shin
  [28, 30], // foot
  [30, 32], // toe
];

const normalizeKeypoints = (keypoints: Keypoint[]) => {
  if (!keypoints || keypoints.length === 0) {
    console.log("No keypoints to normalize");
    return [];
  }
  
  const leftShoulder = keypoints.find(k => k.index === 11);
  const rightShoulder = keypoints.find(k => k.index === 12);
  
  if (!leftShoulder || !rightShoulder) {
    console.log("Could not find shoulder keypoints:", { leftShoulder, rightShoulder });
    return keypoints;
  }

  const shoulderWidth = Math.sqrt(
    Math.pow(rightShoulder.x - leftShoulder.x, 2) +
    Math.pow(rightShoulder.y - leftShoulder.y, 2)
  );

  if (shoulderWidth === 0) {
    console.log("Invalid shoulder width (zero)");
    return keypoints;
  }

  const targetWidth = 0.15;
  const scale = targetWidth / shoulderWidth;

  const centerX = (leftShoulder.x + rightShoulder.x) / 2;
  const centerY = (leftShoulder.y + rightShoulder.y) / 2;

  return keypoints.map(keypoint => ({
    ...keypoint,
    x: ((keypoint.x - centerX) * scale) + 0.5,
    y: ((keypoint.y - centerY) * scale) + 0.5,
  }));
};

const KeypointsVisualizer = ({ data }: KeypointsVisualizerProps) => {
  const latestData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      console.log("KeypointsVisualizer: No data available");
      return null;
    }
    
    console.log("KeypointsVisualizer: Processing", data.length, "data points");
    
    // Take the most recent data point
    const latest = data[0];
    console.log("KeypointsVisualizer: Latest data timestamp:", new Date(latest.timestamp * 1000).toLocaleString());
    
    if (!latest.keypoints || !Array.isArray(latest.keypoints)) {
      console.log("KeypointsVisualizer: No keypoint data found in the latest datapoint");
      return null;
    }

    console.log("KeypointsVisualizer: Found", latest.keypoints.length, "keypoints");
    
    // Changed to 2-period moving average if possible
    if (data.length >= 2) {
      console.log("KeypointsVisualizer: Applying 2-period moving average");
      const dataToSmooth = data.slice(0, 2);
      const smoothedData = calculateMovingAverage(dataToSmooth, 2);
      const result = smoothedData[0];
      
      if (result?.keypoints) {
        result.keypoints = normalizeKeypoints(result.keypoints);
      }
      
      return result;
    }

    console.log("KeypointsVisualizer: Using single data point");
    latest.keypoints = normalizeKeypoints(latest.keypoints);
    return latest;
  }, [data]);

  if (!latestData || !latestData.keypoints || latestData.keypoints.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 bg-white/5 rounded-lg">
        <p className="text-white">No keypoint data available</p>
      </div>
    );
  }

  // Reduced dimensions for a smaller visualization
  const width = 300;
  const height = 400;
  
  const scaleX = width * 0.8;
  const scaleY = height * 0.8;
  const offsetX = width * 0.1;
  const offsetY = height * 0.1;

  return (
    <div className="relative bg-white/5 rounded-lg p-4">
      <h3 className="text-white mb-2 text-lg font-medium">Body Pose Visualization (Real-time)</h3>
      <svg width={width} height={height} className="mx-auto">
        {connections.map(([start, end], index) => {
          const startPoint = latestData.keypoints.find(k => k.index === start);
          const endPoint = latestData.keypoints.find(k => k.index === end);
          
          if (!startPoint || !endPoint) {
            return null;
          }
          
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
      </svg>
    </div>
  );
};

export default KeypointsVisualizer;
