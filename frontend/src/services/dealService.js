import axios from 'axios';
import { API_URL } from '../utils';


const apiUrl = `${API_URL}/api/deals/`;

const createDeal = (deal) => {
  return axios.post(apiUrl, deal, { headers: { Authorization: localStorage.getItem('token') } });
};

const updateDeal = (deal) => {
  return axios.put(apiUrl, deal, { headers: { Authorization: localStorage.getItem('token') } });
};

const getDeals = () => {
  return axios.get(apiUrl, { headers: { Authorization: localStorage.getItem('token') } });
};

const deleteDeal = (id) => {
  return axios.delete(apiUrl+`${id}`, { headers: { Authorization: localStorage.getItem('token') } });
};

export default { createDeal, updateDeal, getDeals, deleteDeal };