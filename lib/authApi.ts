import { api } from './api';

export type SignupBody = { userId: string; password: string; name: string };
export type LoginBody = { userId: string; password: string };

export const signUp = (body: SignupBody) =>
    api.post('/users/signup', body);

export const login = (body: LoginBody) =>
    api.post('/auth/login', body); // { access_token, user }

export const me = () => api.get('/users/me'); // JWT 가드가 걸린 예시라면 경로 맞춰 수정
