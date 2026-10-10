import axios from "axios";

const CONTACT_API = "http://ec2-16-4-75-40.ap-south-1.compute.amazonaws.com:9000";


// attach JWT automatically
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token && !config.url.includes("/auth")) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


// CONTACT APIs
export const saveContact = (contact) => {
    return axios.post(CONTACT_API, contact);
};

export const getContacts = (page = 0, size = 10) => {
    return axios.get(`${CONTACT_API}?page=${page}&size=${size}`);
};

export const searchContacts = (query, page = 0, size = 10) => {
    return axios.get(`${CONTACT_API}/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}`);
};

export const getContact = (id) => {
    return axios.get(`${CONTACT_API}/${id}`);
};

export const updateContact = (contact) => {
    return axios.put(CONTACT_API, contact);
};

export const updatePhoto = (formData) => {
    return axios.put(`${CONTACT_API}/photo`, formData);
};

export const deleteContact = (id) => {
    return axios.delete(`${CONTACT_API}/${id}`);
};
