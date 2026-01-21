import axios from 'axios';
import { MRRMetric, ChurnMetric, Summary, UsersPlan } from '../types/metrics';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getMRR = async (startDate?: string, endDate?: string): Promise<MRRMetric[]> => {
  const params = new URLSearchParams();
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);
  
  const response = await api.get(`/metrics/mrr?${params.toString()}`);
  return response.data;
};

export const getChurn = async (startDate?: string, endDate?: string): Promise<ChurnMetric[]> => {
  const params = new URLSearchParams();
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);
  
  const response = await api.get(`/metrics/churn?${params.toString()}`);
  return response.data;
};

export const getSummary = async (): Promise<Summary> => {
  const response = await api.get('/metrics/summary');
  return response.data;
};

export const getUsers = async (): Promise<UsersPlan []> =>{
  const response = await api.get('/metrics/users-by-plan');
  return response.data;
}

export const healthCheck = async (): Promise<any> => {
  const response = await api.get('/health');
  return response.data;
};