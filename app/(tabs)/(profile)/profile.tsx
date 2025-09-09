import {View, Text, ActivityIndicator} from "react-native";
import {useAuthStore} from "@/stores/authStore";
import {useRouter} from "expo-router";
import CustomButton from "@/components/CustomButton";
import {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UserInfoProps {
    id: number;
    userId: string;
    name: string;
}

export default function ProfileScreen() {
    const router = useRouter();
    const { handleLogout } = useAuthStore();
    const [user, setUser] = useState<UserInfoProps | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const getUserInfo = async () => {
            console.log(await AsyncStorage.getItem("user"));
            try {
                const userStored = await AsyncStorage.getItem("user");
                if (userStored) {
                    const userParsed: UserInfoProps = JSON.parse(userStored);
                    setUser(userParsed);
                }
            } catch (e) {
                console.error("유저 정보 불러오기 실패:", e);
            }
        };
        getUserInfo();
    }, []);



    const handleLogoutBtn = async () => {
        try {
            setSubmitting(true);
            await new Promise((r) => setTimeout(r, 500));
            await handleLogout();
            router.replace('/');
        } catch (error) {
            console.error('로그아웃 실패:', error);
        }finally {
            setSubmitting(false);
        }
    };

    return (
        <View className="flex-1 bg-white justify-center p-5">
            <Text className="text-xl font-bold mb-5 text-center">
                {user && user.name}님 환영합니다!
            </Text>
            <CustomButton
                title={"로그아웃"}
                onPress={handleLogoutBtn}
                bgColor={!submitting ? "bg-blue-500" : "bg-gray-300"}
                disabled={submitting}
                RightIcon={submitting ? <ActivityIndicator /> : null}
            />
        </View>
    );
}