import axios from 'axios';

const streamerApi = axios.create({
  baseURL: 'http://192.168.4.57:8080',
});

export default streamerApi;
