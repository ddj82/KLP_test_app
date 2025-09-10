import axios from 'axios';
import { getBaseUrl } from './getBaseUrl';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from 'react-native';

export const api = axios.create({
    baseURL: getBaseUrl(),
    timeout: 10000,
});

// 요청 인터셉터: 토큰 자동 첨부
api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
        config.headers = config.headers ?? {};
        (config.headers as any).Authorization = `Bearer ${token}`;
    }
    return config;
});


const ORIGIN =
    api.defaults.baseURL?.replace(/\/api\/?$/, '') ?? (Platform.OS === 'android' ? 'http://10.0.2.2:7979' : 'http://localhost:7979');

export const DEFAULT_THUMB = require('@/assets/images/splash-icon.png');

export function toImageUrl(path: string): string {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path; // 이미 절대 URL이면 그대로
    const clean = path.replace(/\\/g, '/'); // 역슬래시 → 슬래시
    return `${ORIGIN}${clean.startsWith('/') ? '' : '/'}${clean}`;
}

export function normalizeAttachments(att: unknown): string[] {
    if (Array.isArray(att)) return att;
    if (typeof att === 'string') {
        try {
            const parsed = JSON.parse(att); // 문자열로 올 수도 있으니 파싱
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return att ? [att] : [];
        }
    }
    return [];
}