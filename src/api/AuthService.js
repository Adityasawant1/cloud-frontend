import axios from "axios";

const AUTH_API = "http://ec2-16-4-75-40.ap-south-1.compute.amazonaws.com:9000";

export const registerUser = (data) => {
    return axios.post(`${AUTH_API}/register`, data);
};

export const loginUser = async (data) => {
    const res = await axios.post(`${AUTH_API}/login`, data);
    localStorage.setItem("token", res.data);
    
    return res;
};

export const logout = () => {
    localStorage.removeItem("token");
};
