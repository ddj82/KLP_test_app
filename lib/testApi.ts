import { api } from './api';

export const rootTest = async () => {
    try {
        const res = await api.get(`/root`);
        const data = res.data;

        return { success: true, data: data };
    } catch (e: any) {
        console.error('rootTest API error:', e);
        return {
            success: false,
            error: e.response?.data?.message ?? 'root-health error'
        };
    }
};