import { BASE_URL } from '@/constants';
import axios from 'axios';

const baseURL = BASE_URL;
const contentType = 'application/json';
const headers = { 'Content-Type': contentType };

export const axiosInstance = axios.create({
  baseURL,
  headers,
});

axiosInstance.interceptors.response.use((response) => response.data);
