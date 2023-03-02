import axios from "axios";

const API = axios.create({
    baseURL: "",
    headers: {
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    "Content-type": "application/json"
  }

});

export default API;

