import axios from 'axios';// eslint-disable-line

const { REACT_APP_API_Scheme, REACT_APP_API_Host } = process.env;

const MyAexios = axios.create({
  baseURL: `${REACT_APP_API_Scheme}${REACT_APP_API_Host}/api`, // eslint-disable-line
  timeout: 5000,
  header: {
    Accept: 'application/vnd.event+json', // eslint-disable-line
  },
});

export default MyAexios;
