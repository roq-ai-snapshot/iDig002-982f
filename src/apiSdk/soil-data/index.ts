import axios from 'axios';
import queryString from 'query-string';
import { SoilDataInterface } from 'interfaces/soil-data';
import { GetQueryInterface } from '../../interfaces';

export const getSoilData = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/soil-data${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createSoilData = async (soilData: SoilDataInterface) => {
  const response = await axios.post('/api/soil-data', soilData);
  return response.data;
};

export const updateSoilDataById = async (id: string, soilData: SoilDataInterface) => {
  const response = await axios.put(`/api/soil-data/${id}`, soilData);
  return response.data;
};

export const getSoilDataById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/soil-data/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteSoilDataById = async (id: string) => {
  const response = await axios.delete(`/api/soil-data/${id}`);
  return response.data;
};
