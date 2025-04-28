export interface IHearResponse {
  message: string;
  data: IHeartRate[];
}

export interface IHeartRate {
  _id: string;
  heart: number;
  spoe2: number;
  timestamp: string;
}

export interface ITempResponse {
  message: string;
  data: ITemp[];
}

export interface ITemp {
  _id: string;
  temp: number;
  timestamp: string;
}

export interface IMotionResponse {
  message: string;
  data: IMotion[];
}

export interface IMotion {
  _id: string;
  accel_x: number;
  accel_y: number;
  accel_z: number;
  gyro_x: number;
  gyro_y: number;
  gyro_z: number;
  timestamp: string;
}

export interface IMotionCountResponse {
  message: string;
  data: IMotionCount[];
}

export interface IMotionCount {
  _id: string;
  motion_count: number;
  timestamp: string;
}
