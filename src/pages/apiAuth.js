import axios from "axios";

const apiAuth = axios.create({
  withCredentials: true
});

export default apiAuth;