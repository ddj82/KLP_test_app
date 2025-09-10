import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {User} from "@/types/profile";

interface AuthState {
    isLoggedIn: boolean;
    token: string | null;
    user: User | null;
    isLoading: boolean;
    handleLogin: (token: string, user: User) => Promise<void>;
    handleLogout: () => Promise<void>;
    loadAuthState: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    isLoggedIn: false,
    token: null,
    user: null,
    isLoading: true,

    // 로그인
    handleLogin: async (token, user) => {
        try {
            // AsyncStorage에 토큰, 유저 정보 저장
            await AsyncStorage.multiSet([
                ['token', token],
                ['user', JSON.stringify(user)],
            ]);

            // 상태 업데이트
            set({
                isLoggedIn: true,
                token: token,
                isLoading: false,
            });

        } catch (e) {
            console.error('로그인 상태 저장 실패:', e);
        }
    },

    // 로그아웃
    handleLogout: async () => {
        try {
            // AsyncStorage에서 토큰, 유저 정보 제거
            await AsyncStorage.multiRemove(['token', 'user']);

            // 상태 초기화
            set({
                isLoggedIn: false,
                token: null,
                user: null,
                isLoading: false,
            });
        } catch (error) {
            console.error('로그아웃 실패:', error);
        }
    },

    // 앱 시작시 저장된 토큰 불러오기
    loadAuthState: async () => {
        try {
            const [token, userStr] = await AsyncStorage.multiGet(['token', 'user']).then(entries => entries.map(e => e[1]));

            if (token) {
                set({
                    isLoggedIn: true,
                    token,
                    user: userStr ? JSON.parse(userStr) : null,
                    isLoading: false,
                });
            } else {
                set({
                    isLoggedIn: false,
                    token: null,
                    user: null,
                    isLoading: false,
                });
            }
        } catch (error) {
            console.error('인증 상태 불러오기 실패:', error);
            set({
                isLoggedIn: false,
                token: null,
                user: null,
                isLoading: false,
            });
        }
    },
}));