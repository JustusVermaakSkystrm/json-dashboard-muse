
export interface DataPoint {
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

export interface ChartDataPoint {
  name: string;
  probability: number;
  position: number;
  timestamp: Date;
}
