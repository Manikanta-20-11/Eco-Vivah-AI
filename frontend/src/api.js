import axios from 'axios'
const BASE = 'http://localhost:8000'
export const analyzeWedding = (data) => axios.post(`${BASE}/analyze`, data)
export const getVendors = () => axios.get(`${BASE}/vendors`)
export const getHistory = (userId) => axios.get(`${BASE}/history?user_id=${userId}`)