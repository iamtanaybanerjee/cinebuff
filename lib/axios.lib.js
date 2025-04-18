const axios = require("axios");
require("dotenv").config();

const axiosInstance = axios.create({
  baseURL: process.env.MICROSERVICE_BASE_URL,
  params: {
    api_key: process.env.API_KEY,
  },
});

module.exports = axiosInstance;
