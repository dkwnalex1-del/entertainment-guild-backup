import axios from "axios";

const api = axios.create({
  baseURL: "/api/inft3050",
  headers: {
    "xc-token": "sPi8tSXBw3BgursDPmfAJz8B3mPaHA6FQ9PWZYJZ"
  }
});

export default api;