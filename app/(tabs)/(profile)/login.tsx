import {View, Text, TextInput, Alert, ActivityIndicator} from 'react-native';
import {useRouter} from "expo-router";
import {useMemo, useState} from "react";
import {useAuthStore} from "@/stores/authStore";
import CustomButton from "@/components/CustomButton"
import {login} from "@/lib/authApi";

const USERID_MIN = 4;
const USERID_MAX = 40;
const PASSWORD_MIN = 4;

type Errors = {
    userId?: string;
    password?: string;
};

export default function LoginScreen() {
    const router = useRouter();
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const { handleLogin } = useAuthStore();
    const [errors, setErrors] = useState<Errors>({});
    const [submitting, setSubmitting] = useState(false);

    const validateUserId = (v: string) => {
        const value = v.trim();
        if (!value) return "아이디를 입력해 주세요.";
        if (value.length < USERID_MIN) return `아이디는 최소 ${USERID_MIN}자 이상입니다.`;
        if (value.length > USERID_MAX) return `아이디는 최대 ${USERID_MAX}자입니다.`;
        return undefined;
    };
    const validatePassword = (v: string) => {
        if (!v) return "비밀번호를 입력해 주세요.";
        if (v.length < PASSWORD_MIN) return `비밀번호는 최소 ${PASSWORD_MIN}자 이상입니다.`;
        return undefined;
    };

    // 전체 검증
    const validateAll = (state?: { userId: string; password: string }): Errors => {
        const u = state?.userId ?? userId;
        const p = state?.password ?? password;
        return {
            userId: validateUserId(u),
            password: validatePassword(p),
        };
    };

    // 입력 시 즉시 검증
    const onChangeUserId = (v: string) => {
        setUserId(v);
        setErrors((e) => ({ ...e, userId: validateUserId(v) }));
    };
    const onChangePassword = (v: string) => {
        setPassword(v);
        setErrors((e) => ({ ...e, password: validatePassword(v) }));
    };

    const isFormValid = useMemo(() => {
        const e = validateAll();
        return !e.userId && !e.password;
    }, [userId, password]);


    const handleLoginBtn = async () => {
        const currentErrors = validateAll();
        setErrors(currentErrors);
        if (currentErrors.userId || currentErrors.password) return;

        try {
            setSubmitting(true);

            await new Promise((r) => setTimeout(r, 500));

            const { data } = await login({ userId, password });
            const { access_token, user } = data;
            await handleLogin(access_token, user);
            router.replace('/');
        } catch (e: any) {
            Alert.alert('로그인 실패', e?.response?.data?.message ?? String(e));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View className="flex-1 bg-white justify-center p-5">
            <Text className="text-xl font-bold mb-5 text-center">로그인</Text>
            <TextInput
                className="border border-gray-300 p-2.5 rounded"
                placeholder="아이디"
                value={userId}
                onChangeText={onChangeUserId}
            />
            {errors.userId ? <Text className="text-red-500 mb-2">{errors.userId}</Text> : null}

            <TextInput
                className="border border-gray-300 mt-2.5 p-2.5 rounded"
                placeholder="비밀번호"
                secureTextEntry
                value={password}
                onChangeText={onChangePassword}
            />
            {errors.password ? <Text className="text-red-500 mb-2">{errors.password}</Text> : null}

            <View className="flex-row items-center justify-center mt-2.5 mb-4">
                <Text>계정이 없으신가요? </Text>
                <Text
                    className="text-blue-500"
                    onPress={() => router.push('./register')}
                >
                    회원가입
                </Text>
            </View>
            <CustomButton
                title={"로그인"}
                onPress={handleLoginBtn}
                bgColor={isFormValid && !submitting ? "bg-blue-500" : "bg-gray-300"}
                disabled={!isFormValid || submitting}
                RightIcon={submitting ? <ActivityIndicator /> : null}
            />
        </View>
    );
};