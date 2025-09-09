// app/(tabs)/profile/_layout.tsx
import { Stack } from 'expo-router';

export default function ProfileStack() {
    return (
        <Stack screenOptions={{ headerShown: false, headerTitle: '마이페이지' }}>
            <Stack.Screen
                name="index"
                options={{
                    title: '마이페이지',
                    headerShown: false  // 탭에서 이미 헤더가 있으므로
                }}
            />
        </Stack>
    );
}
