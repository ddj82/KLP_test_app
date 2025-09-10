import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {Tabs} from 'expo-router';
import {useAuthStore} from "@/stores/authStore";

export default function TabLayout() {
    const {isLoggedIn} = useAuthStore();

    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{
                    title: '홈',
                    tabBarIcon: ({ color }) => <FontAwesome name="home" size={20} color={color} />,
                    headerTitleAlign: "center",

                }}
            />
            <Tabs.Screen
                name="(board)"
                options={{
                    title: '게시판',
                    tabBarIcon: ({ color }) => <FontAwesome name="list" size={20} color={color} />,
                    headerTitleAlign: "center",
                }}
            />
            <Tabs.Screen
                name="(profile)"
                options={{
                    title: isLoggedIn ? '마이페이지' : '로그인',
                    tabBarIcon: ({ color }) => <FontAwesome name="user" size={20} color={color} />,
                    headerTitleAlign: "center",
                }}
            />
        </Tabs>
    );
}
