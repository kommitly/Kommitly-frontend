import axios from "axios";

// Global Axios configuration
axios.defaults.withCredentials = true;
axios.defaults.headers.common["Content-Type"] = "application/json";

export default axios;
