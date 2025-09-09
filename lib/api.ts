import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { getBaseUrl } from './getBaseUrl';

export const api = axios.create({
    baseURL: getBaseUrl(),
    timeout: 10000,
});

// 요청 인터셉터: 토큰 자동 첨부
api.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync('access_token');
    if (token) {
        config.headers = config.headers ?? {};
        (config.headers as any).Authorization = `Bearer ${token}`;
    }
    return config;
});
