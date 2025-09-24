import {View, Text} from 'react-native';
import {useEffect, useState} from "react";
import {getBaseUrl} from "@/lib/getBaseUrl";
import CustomButton from "@/components/CustomButton";
import {rootTest} from "@/lib/testApi";
import dayjs from "dayjs";

interface RootTestResponse {
    ok: boolean;
    message: string;
    timestamp: string; // ISO 날짜 문자열
    version: string;
}


export default function HomeScreen() {
    const [base, setBase] = useState<string>('');
    const [testApiData, setTestApiData] = useState<RootTestResponse | null>(null);

    useEffect(() => {
        const b = getBaseUrl();
        setBase(b);
    }, []);

    const handleTestApiBtn = async (on: boolean) => {
        if (!on) {
            setTestApiData(null);
            return;
        }
        try {
            const res = await rootTest();
            const data: RootTestResponse = res.data;
            setTestApiData(data);
        } catch (e) {
            console.warn('rootTest 실패', e);
            setTestApiData(null);
        }
    };

    return (
        <View className="flex-1 bg-white justify-center p-5">
            <Text className="text-xl font-bold mb-5 text-center">
                메인 페이지
            </Text>
            <Text className="text-xl mb-5 text-center">
                BASE: {base || '(empty)'}
            </Text>
            {testApiData ? (
                <CustomButton
                    title={"초기화"}
                    onPress={() => handleTestApiBtn(false)}
                    addClass={"p-4"}
                    bgColor={"bg-blue-500"}
                />
            ) : (
                <CustomButton
                    title={"api 테스트"}
                    onPress={() => handleTestApiBtn(true)}
                    addClass={"p-4"}
                    bgColor={"bg-blue-500"}
                />
            )}

            <View className="text-xl my-5 text-center">
                {testApiData ? (
                    <View className="justify-center p-5">
                        <Text>{testApiData.message}</Text>
                        <Text>{testApiData.version}</Text>
                        <Text>{dayjs(testApiData.timestamp).format("YYYY-MM-DD HH:mm")}</Text>
                    </View>
                ) : <Text>버튼을 클릭하세요.</Text>}
            </View>
        </View>
    );
}
