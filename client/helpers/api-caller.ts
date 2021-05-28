import axios from 'axios';

const streamerApi = axios.create({
  baseURL: 'http://localhost:8080',
});

export default streamerApi;
