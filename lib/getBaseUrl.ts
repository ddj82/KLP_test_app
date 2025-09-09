import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export function getBaseUrl() {
    const extra = Constants.expoConfig?.extra as any;

    if (Platform.OS === 'ios') {
        // 실기기: LAN IP 사용 / 시뮬레이터: localhost 사용
        return Device.isDevice ? extra.API_BASE_URL_LAN : extra.API_BASE_URL_IOS_SIM;
    }
    if (Platform.OS === 'android') {
        // 실기기: LAN IP / 에뮬레이터: 10.0.2.2
        return Device.isDevice ? extra.API_BASE_URL_LAN : extra.API_BASE_URL_ANDROID_EMU;
    }
    // 그 외(웹 등)
    return extra.API_BASE_URL_LAN;
}