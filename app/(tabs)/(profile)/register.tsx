import {View, Text, TextInput, Alert, ActivityIndicator} from "react-native";
import {useRouter} from "expo-router";
import {useMemo, useState} from "react";
import CustomButton from "@/components/CustomButton";
import {signUp} from "@/lib/authApi";

const USERID_MIN = 4;
const USERID_MAX = 40;
const PASSWORD_MIN = 4;
const NAME_MAX = 50;

type Errors = {
    userId?: string;
    password?: string;
    name?: string;
};

export default function RegisterScreen() {
    const router = useRouter();
    const [userId, setUserId] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
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
    const validateName = (v: string) => {
        const value = v.trim();
        if (!value) return "이름을 입력해 주세요.";
        if (value.length > NAME_MAX) return `이름은 최대 ${NAME_MAX}자입니다.`;
        return undefined;
    };

    // 전체 검증
    const validateAll = (state?: { userId: string; password: string; name: string }): Errors => {
        const u = state?.userId ?? userId;
        const p = state?.password ?? password;
        const n = state?.name ?? name;
        return {
            userId: validateUserId(u),
            password: validatePassword(p),
            name: validateName(n),
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
    const onChangeName = (v: string) => {
        setName(v);
        setErrors((e) => ({ ...e, name: validateName(v) }));
    };

    const isFormValid = useMemo(() => {
        const e = validateAll();
        return !e.userId && !e.password && !e.name;
    }, [userId, password, name]);

    const handleSignUpBtn = async () => {
        const currentErrors = validateAll();
        setErrors(currentErrors);
        if (currentErrors.userId || currentErrors.password || currentErrors.name) return;

        try {
            setSubmitting(true);
            await new Promise((r) => setTimeout(r, 600));
            await signUp({
                userId: userId.trim(),
                password,
                name: name.trim()
            });
            Alert.alert("회원가입 완료", "로그인 화면으로 이동합니다.");
            router.replace('/login');
        } catch (e: any) {
            Alert.alert("회원가입 실패", e?.response?.data?.message ?? String(e));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View className="flex-1 bg-white justify-center p-5">
            <Text className="text-xl font-bold mb-5 text-center">회원가입 화면</Text>
            <TextInput
                className="border border-gray-300 p-2.5 rounded"
                placeholder="아이디 (4~40자)"
                value={userId}
                onChangeText={onChangeUserId}
                autoCapitalize="none"
                autoCorrect={false}
            />
            {errors.userId ? <Text className="text-red-500 mb-2">{errors.userId}</Text> : null}

            <TextInput
                className="border border-gray-300 mt-2.5 p-2.5 rounded"
                placeholder="비밀번호 (4자 이상)"
                secureTextEntry
                value={password}
                onChangeText={onChangePassword}
            />
            {errors.password ? <Text className="text-red-500 mb-2">{errors.password}</Text> : null}

            <TextInput
                className="border border-gray-300 mt-2.5 p-2.5 rounded"
                placeholder="이름"
                value={name}
                onChangeText={onChangeName}
            />
            {errors.name ? <Text className="text-red-500">{errors.name}</Text> : null}

            <View className="mt-2.5">
                <CustomButton
                    title={submitting ? "" : "회원가입"}
                    onPress={handleSignUpBtn}
                    bgColor={isFormValid && !submitting ? "bg-blue-500" : "bg-gray-300"}
                    disabled={!isFormValid || submitting}
                    RightIcon={submitting ? <ActivityIndicator /> : null}
                />
            </View>
        </View>
    );
}