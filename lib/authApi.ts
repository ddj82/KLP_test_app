import { api } from './api';

export type SignupBody = { userId: string; password: string; name: string };
export type LoginBody = { userId: string; password: string };

export const signUp = (body: SignupBody) => api.post('/users/signup', body);

export const login = (body: LoginBody) => api.post('/auth/login', body);

export const me = () => api.get('/users/me');
