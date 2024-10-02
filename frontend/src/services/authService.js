import axios from 'axios';
import { API_URL } from '../utils';

const apiUrl = `${API_URL}/api/auth/`;

const register = (username, password, role) => {
  return axios.post(apiUrl + 'register', { username, password, role });
};

const login = (username, password) => {
  return axios.post(apiUrl + 'login', { username, password });
};

export default { register, login };

// https://vendor.yandex.ru/history?places=2068119_2068124_2254419_2256923_2521334_2521341_2521348_2521355_2521397_2521411_2521432_2521439_2587540_2587547_2587554_2587561_2587568_2587575_2587582_2587589_2657361_2657368_2657375_2657382_2657410_2657417_2657424_2657438_2657452_2657473_2701692_2701699_2701706_2701713_2756123_2756130_2756137_2756144_2756151_2756158_2756165_2756172_2756179_2756186_2767206_2767213_2767220_2767227_2767234_2767241_2767248_2767255_2770454_2770489&search=&dateTo=2024-09-02T18%3A59%3A59.999Z&dateFrom=2024-09-01T19%3A00%3A00.000Z