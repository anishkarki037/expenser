import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const registerUser = async (user) => {
  const response = await axios.post(`${API_URL}/register`, user);
  return response.data;
};

export const loginUser = async (user) => {
  const response = await axios.post(`${API_URL}/login`, user);
  return response.data;
};

export const addTransaction = async (transaction) => {
  const response = await axios.post(`${API_URL}/transaction`, transaction);
  return response.data;
};

export const getTransactions = async (userId) => {
  const response = await axios.get(`${API_URL}/transactions`, { params: { userId } });
  return response.data;
};

export const getSummary = async (userId) => {
  const response = await axios.get(`${API_URL}/summary`, { params: { userId } });
  return response.data;
};
