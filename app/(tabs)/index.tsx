import {View, Text} from 'react-native';
import {useEffect, useState} from "react";
import {getBaseUrl} from "@/lib/getBaseUrl";

export default function HomeScreen() {
    const [base, setBase] = useState<string>('');
    // const [ping, setPing] = useState<string>('pending');

    useEffect(() => {
        const b = getBaseUrl();
        setBase(b);

        // 간단 헬스체크 (엔드포인트는 프로젝트에 맞게)
        // const ctrl = new AbortController();
        // const timer = setTimeout(() => ctrl.abort(), 5000);
        //
        // fetch(`${b}/health`, { signal: ctrl.signal })
        //     .then((r) => setPing(`${r.status} ${r.ok ? 'OK' : 'FAIL'}`))
        //     .catch((e) => setPing(`ERR: ${e?.message || e}`))
        //     .finally(() => clearTimeout(timer));
    }, []);
  return (
    <View className="flex-1 bg-white justify-center p-5">
      <Text className="text-xl font-bold mb-5 text-center">메인</Text>
      <Text className="text-xl font-bold mb-5 text-center">
          BASE: {base || '(empty)'}
      </Text>
    </View>
  );
}
