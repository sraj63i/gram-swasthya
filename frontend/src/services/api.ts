import axios from 'axios';

const API_BASE_URL = 'https://gram-swasthya-api.onrender.com/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getDoctors = () => api.get('/doctors/');
export const getMedicines = () => api.get('/medicines/');
export const getAppointments = () => api.get('/appointments/');
export const getSymptoms = () => api.get('/symptoms/');
export const getAttendance = () => api.get('/attendance/');
export const getGrievances = () => api.get('/grievances/');
export const getAbhaRecords = () => api.get('/abha/');

export const createSymptomLog = (data: any) => api.post('/symptoms/', data);
export const createGrievance = (data: any) => api.post('/grievances/', data);
export const createAppointment = (data: any) => api.post('/appointments/', data);