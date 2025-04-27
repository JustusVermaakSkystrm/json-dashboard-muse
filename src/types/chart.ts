
export interface Keypoint {
  index: number;
  x: number;
  y: number;
  z: number;
}

export interface DataPoint {
  timestamp: number;
  fall_probability: number;
  trunk_angle: number;
  hip_angle: number;
  sit_probability: number;
  stand_probability: number;
  keypoints: Keypoint[];
  formattedTime?: string;
  fall_probability_percent?: string;
  id?: string;
}

export interface ChartDataPoint {
  name: string;
  probability: number;
  sitProbability?: number;
  standProbability?: number;
  timestamp: Date;
}
