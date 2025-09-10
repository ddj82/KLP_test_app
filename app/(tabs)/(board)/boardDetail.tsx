import {RefreshControl, ScrollView, Text, View, Image} from "react-native";
import {router, useLocalSearchParams} from "expo-router";
import {useCallback, useEffect, useState} from "react";
import {BoardItem} from "@/types/board";
import {boardFindOne} from "@/lib/boardApi";
import dayjs from "dayjs";
import {DEFAULT_THUMB} from "@/lib/api";

export default function BoardDetail() {
    const { id } = useLocalSearchParams<{ id?: string }>();
    const [loading, setLoading] = useState(true);
    const [board, setBoard] = useState<BoardItem | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const load = useCallback(async () => {
        if (!id) {
            setError('잘못된 접근입니다. (id 누락)');
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setError(null);

            const res = await boardFindOne(Number(id));

            console.log('디테일',res);
            console.log('디테일',Number(id));

            if (res.success && res.data) {
                setBoard(res.data as BoardItem);
            } else {
                setError(res.error ?? '게시글을 불러올 수 없습니다.');
            }
        } catch (e) {
            console.error('게시글 로딩 에러:', e);
            setError('예기치 못한 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        load();
    }, [load]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await load();
        setRefreshing(false);
    }, [load]);

    if (loading) {
        return (
            <View className="flex-1 bg-white justify-center items-center">
                <Text className="font-bold text-lg">로딩 중...</Text>
            </View>
        );
    }

    if (error || !board) {
        return (
            <View className="flex-1 bg-white justify-center items-center p-6">
                <Text className="font-bold text-lg text-center mb-4">{error ?? '데이터가 없습니다.'}</Text>
                <Text className="text-blue-600" onPress={() => router.back()}>뒤로가기</Text>
            </View>
        );
    }

    const imgs = board.imageUrls && board.imageUrls.length > 0 ? board.imageUrls : [];

    return (
        <ScrollView
            className="flex-1 bg-white"
            contentContainerStyle={{ paddingBottom: 40 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            {/* 헤더 영역 */}
            <View className="px-5 pt-5">
                <Text className="text-2xl font-bold mb-2">{board.title}</Text>
                <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-gray-700">
                        {board.author?.userName ?? board.author?.userId ?? '익명'}
                    </Text>
                    <Text className="text-gray-500">
                        {dayjs(board.createdAt).format('YYYY-MM-DD HH:mm')}
                    </Text>
                </View>
            </View>

            {/* 이미지 영역 */}
            <View className="px-5">
                {imgs.length > 0 ? (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
                        {imgs.map((u, i) => (
                            <Image
                                key={`${u}-${i}`}
                                source={{ uri: u }}
                                className="w-[280px] h-[220px] rounded-xl mr-3"
                                resizeMode="cover"
                                onError={(e) => {
                                    // 깨진 URL 대비: 로컬 기본 이미지로 교체하고 싶다면 별도 컴포넌트로 상태 처리
                                    console.warn('image error', u, e.nativeEvent.error);
                                }}
                            />
                        ))}
                    </ScrollView>
                ) : (
                    <Image
                        source={DEFAULT_THUMB}
                        className="w-full h-[220px] rounded-xl mb-3"
                        resizeMode="cover"
                    />
                )}
            </View>

            {/* 본문 */}
            <View className="px-5">
                <Text className="text-base leading-6">{board.content}</Text>
            </View>
        </ScrollView>
    );
};
