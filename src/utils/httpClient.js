import axios from "axios";
import config from "../config/config";

const HTTP = axios.create({
  baseURL: config.baseURL,
  // headers: {
  //   "Access-Control-Allow-Origin": "*",
  //   'Content-Type': 'application/json', // Adjust the content type as needed
  //   'Accept': 'application/json',
  // },
});

export default HTTP;
