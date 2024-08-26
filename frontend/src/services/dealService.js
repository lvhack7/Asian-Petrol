import axios from 'axios';

const API_URL = 'http://localhost:5501/api/deals/';

const createDeal = (deal) => {
  return axios.post(API_URL, deal, { headers: { Authorization: localStorage.getItem('token') } });
};

const updateDeal = (deal) => {
  return axios.put(API_URL, deal, { headers: { Authorization: localStorage.getItem('token') } });
};

const getDeals = () => {
  return axios.get(API_URL, { headers: { Authorization: localStorage.getItem('token') } });
};

export default { createDeal, updateDeal, getDeals };