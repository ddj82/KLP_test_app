import { Stack } from 'expo-router';

export default function BoardLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="index"
                options={{ title: '게시판' }}
            />
            {/*<Stack.Screen*/}
            {/*    name="[id]"*/}
            {/*    options={{ title: '게시글' }}*/}
            {/*/>*/}
            {/*<Stack.Screen*/}
            {/*    name="write"*/}
            {/*    options={{ title: '글쓰기' }}*/}
            {/*/>*/}
        </Stack>
    );
}