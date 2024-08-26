import axios from 'axios';

const API_URL = 'http://localhost:5501/api/reference';

const createRef = (ref) => {
  return axios.post(API_URL, ref, { headers: { Authorization: localStorage.getItem('token') } });
};

const deleteRef = (id) => {
  return axios.delete(`${API_URL}/${id}`, { headers: { Authorization: localStorage.getItem('token') } });
};

const getRef = (name) => {
    return axios.get(API_URL, { params: {name}, headers: { Authorization: localStorage.getItem('token') } });
}; 

export default { createRef, deleteRef, getRef };