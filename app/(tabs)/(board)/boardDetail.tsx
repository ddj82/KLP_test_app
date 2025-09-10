import {RefreshControl, Text, View, Image, TextInput, ActivityIndicator, Alert} from "react-native";
import {router, useLocalSearchParams} from "expo-router";
import {useCallback, useEffect, useState} from "react";
import {BoardItem} from "@/types/board";
import {addComment, boardFindOne} from "@/lib/boardApi";
import dayjs from "dayjs";
import {DEFAULT_THUMB} from "@/lib/api";
import {useAuthStore} from "@/stores/authStore";
import CustomButton from "@/components/CustomButton";
import PagerView from "react-native-pager-view";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

export default function BoardDetail() {
    const { id } = useLocalSearchParams<{ id?: string }>();
    const [loading, setLoading] = useState(true);
    const [board, setBoard] = useState<BoardItem | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);

    const { isLoggedIn } = useAuthStore();
    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);

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

    const handleAddComment = async () => {
        if (!content.trim()) {
            Alert.alert('알림', '내용을 입력해주세요.');
            return;
        }

        try {
            setSubmitting(true);

            await new Promise((r) => setTimeout(r, 500));

            const res = await addComment(Number(id), content);

            if (res.success) {
                Alert.alert('성공', '댓글이 등록되었습니다.', [
                    { text: '확인', onPress: addCommentSuccess }
                ]);
            } else {
                Alert.alert('오류', res.error ?? '댓글 등록에 실패했습니다.');
            }

        } catch (e: any) {
            Alert.alert('오류', e?.response?.data?.message ?? String(e));
        } finally {
            setSubmitting(false);
        }
    };

    const addCommentSuccess = async () => {
        setContent("");
        await load();
    };

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
        <KeyboardAwareScrollView
            className="flex-1 bg-white"
            contentContainerStyle={{ paddingBottom: 40 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            resetScrollToCoords={{ x: 0, y: 0 }}
            scrollEnabled={true}
            enableOnAndroid={true}
            extraHeight={75} // 댓글 입력창과 키보드 사이 여백
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
                    <View>
                        <PagerView
                            style={{ height: 280 }}
                            initialPage={0}
                            onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
                        >
                            {imgs.map((item, index) => (
                                <View key={`${item}-${index}`}>
                                    <Image
                                        source={{ uri: item }}
                                        className="w-full h-full rounded-xl"
                                        resizeMode="cover"
                                        onError={(e) => {
                                            console.warn('image error', item, e.nativeEvent.error);
                                        }}
                                    />
                                </View>
                            ))}
                        </PagerView>
                        {/* 페이지 인디케이터 */}
                        <View className="flex-row justify-center mt-2">
                            {imgs.map((_, index) => (
                                <View
                                    key={index}
                                    className={`w-2 h-2 rounded-full mx-1 ${
                                        index === currentPage ? 'bg-blue-500' : 'bg-gray-300'
                                    }`}
                                />
                            ))}
                        </View>
                    </View>
                ) : (
                    <Image
                        source={DEFAULT_THUMB}
                        className="w-full h-[280px] rounded-xl mb-3"
                        resizeMode="cover"
                    />
                )}
            </View>

            {/* 본문 */}
            <View className="px-5 pt-5 pb-10">
                <Text className="text-lg leading-6">{board.content}</Text>
            </View>


            {/* 댓글 */}
            <View className="px-5 pt-5">
                <View className="flex-row items-center gap-1 mb-2">
                    <Text className="text-xl font-bold items-center">
                        댓글
                    </Text>
                    {board.comments && (board.comments?.length > 0) && (
                        <Text className="text-base font-normal">{board.comments?.length}</Text>
                    )}
                </View>

                {/* 내용 입력 */}
                <View className="pt-1">
                    <TextInput
                        className={`border p-3 rounded-lg h-24 mb-2 ${
                            isLoggedIn
                                ? 'border-gray-300 bg-white'
                                : 'border-gray-200 bg-gray-50 text-gray-400'
                        }`}
                        placeholder={isLoggedIn ? "댓글을 입력하세요" : "로그인이 필요합니다"}
                        value={content}
                        onChangeText={setContent}
                        multiline
                        textAlignVertical="top"
                        editable={isLoggedIn}
                    />
                    {content !== "" && (
                        <View className="flex-1 items-end">
                            <CustomButton
                                title={"작성"}
                                onPress={handleAddComment}
                                addClass={"p-2 px-4 mb-2"}
                                bgColor={!submitting ? "bg-blue-500" : "bg-gray-300"}
                                disabled={submitting}
                                RightIcon={submitting ? <ActivityIndicator /> : null}
                            />
                        </View>
                    )}
                </View>

                {board.comments && (board.comments?.length > 0) ? (
                    <View className="pt-2 gap-2">
                        {board.comments.map((c) => (
                            <View key={c.id} className="gap-1 border-b border-gray-300 pb-2">
                                <Text>{c.content}</Text>
                                <View className="flex-row gap-2 justify-between">
                                    <Text className="text-sm text-gray-700">{c.author?.userName ?? c.author?.userId}</Text>
                                    <Text className="text-sm text-gray-500">{dayjs(c.createdAt).format("YYYY-MM-DD HH:mm")}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                ) : (
                    <View className="flex-1 justify-center items-center">
                        <Text className="pt-10">댓글이 없습니다.</Text>
                    </View>
                )}
            </View>
        </KeyboardAwareScrollView>
    );
};
