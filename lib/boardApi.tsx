import { api } from './api';

export const boardFindAll = async () => {
    const res = await api.get('/boards');
    return res.data;
};