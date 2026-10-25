import { api } from './api.js';

export const login = async (datos) => (await api.post('/login', datos)).data;

export const registrar = async (datos) => (await api.post('/usuarios', datos)).data;

export const mensajeDeError = (error) => {
    const data = error.response?.data;
    if (data?.errores?.length) return data.errores.join('. ');
    return data?.mensaje ?? 'No se pudo conectar con el servidor';
};