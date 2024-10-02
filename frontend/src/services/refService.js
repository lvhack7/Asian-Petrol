import axios from 'axios';
import { API_URL } from '../utils';

const apiUrl = `${API_URL}/api/reference`;

const createRef = (ref) => {
  return axios.post(apiUrl, ref, { headers: { Authorization: localStorage.getItem('token') } });
};

const deleteRef = (id) => {
  return axios.delete(`${apiUrl}/${id}`, { headers: { Authorization: localStorage.getItem('token') } });
};

const getRef = (name) => {
    return axios.get(apiUrl, { params: {name}, headers: { Authorization: localStorage.getItem('token') } });
}; 

export default { createRef, deleteRef, getRef };