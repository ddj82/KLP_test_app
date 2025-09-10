import { Alert } from 'react-native';

export const confirmAlert = (title: string, message: string) => {
    return new Promise((resolve) => {
        Alert.alert(
            title,
            message,
            [
                { text: '취소', onPress: () => resolve(false) },
                { text: '확인', onPress: () => resolve(true) }
            ]
        );
    });
};