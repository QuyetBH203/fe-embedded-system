import { IHearResponse, ITempResponse } from '@/types/device';
import { axiosInstance } from '@/utils/axios';

export const getHearRate = async () => {
  const response = await axiosInstance.get<IHearResponse>(`/iot-data/vitals`);
  // Đảm bảo luôn trả về một mảng, ngay cả khi response.data.data là undefined
  console.log('Response data:', response.data);
  return response;
};

export const getTemp = async () => {
  const response = await axiosInstance.get<ITempResponse>(`/iot-data/temperature`);
  return response;
};

export const getMotion = async () => {
  const response = await axiosInstance.get(`/iot-data/motion`);
  return response;
};

export const getMotionCount = async () => {
  const response = await axiosInstance.get(`/iot-data/motion-count`);
  return response;
};
