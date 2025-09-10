import {Alert, FlatList, Text, TouchableOpacity, View, Image} from "react-native";
import {useEffect, useState} from "react";
import {boardFindAll} from "@/lib/boardApi";
import {router} from 'expo-router';
import dayjs from 'dayjs';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {useAuthStore} from "@/stores/authStore";
import CustomButton from "@/components/CustomButton";
import {BoardItem} from "@/types/board";
import {DEFAULT_THUMB} from "@/lib/api";



export default function BoardList() {
    const [boardList, setBoardList] = useState<BoardItem[]>([]);
    const { isLoggedIn } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBoards = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await boardFindAll();

                if (res.success && res.data?.items) {
                    setBoardList(res.data.items as BoardItem[]);
                } else {
                    setError(res.error ?? '게시글을 불러올 수 없습니다.');
                }
            } catch (e) {
                console.error('게시글 로딩 에러:', e);
                setError('예기치 못한 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchBoards();
    }, []);

    const handleAddPress = () => {
        // 글 작성 페이지로 이동
        if (!isLoggedIn) {
            Alert.alert('알림', "로그인 후 가능합니다.", [
                { text: '확인', onPress: () => router.push("/login") }
            ]);
            return;
        }
        router.push('/boardCreate');
    };

    const handleBoardDetail = (id: number) => {
        router.push({ pathname: '/boardDetail', params: { id: String(id) } });
    };

    const renderItem = ({ item: b }: { item: BoardItem }) => {
        const thumbSrc = b.imageUrls?.[0] ? { uri: b.imageUrls[0] } : DEFAULT_THUMB;

        return (
            <TouchableOpacity
                onPress={() => handleBoardDetail(b.id)}
                activeOpacity={1}
            >
                <View className="p-5 border-b border-gray-300" key={b.id}>
                    <Text className={"text-lg font-bold mb-2"}>{b.title}</Text>
                    <Text numberOfLines={1} className={"text-sm font-semibold mb-3"}>{b.content}</Text>
                    {b.imageUrls && (
                        <Image
                            source={thumbSrc}
                            className="w-full h-[180px] rounded-lg mb-2"
                            resizeMode="cover"
                        />
                    )}
                    <View className={"flex-row gap-1 justify-end px-1"}>
                        <Text className={""}>{dayjs(b.createdAt).format("YYYY-MM-DD")}</Text>
                    </View>
                    {/*<View className={"flex-row gap-2 justify-between px-1"}>*/}
                    {/*    <Text className={""}>{b.author?.userName ?? b.author?.userId}</Text>*/}
                    {/*    <Text className={""}>{dayjs(b.createdAt).format("YYYY-MM-DD")}</Text>*/}
                    {/*</View>*/}
                </View>
            </TouchableOpacity>
        );
    }

    if (loading) {
        return (
            <View className="flex-1 bg-white justify-center items-center">
                <Text className={"font-bold text-lg"}>로딩 중...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 bg-white justify-center items-center py-5">
                <Text className="text-red-500 text-center mb-4">{error}</Text>
                <CustomButton
                    title={"다시 시도"}
                    onPress={() => {setError(null)}}
                    addClass={"p-4"}
                    bgColor={"bg-blue-500"}
                />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white py-5">
            <Text className="text-xl font-bold mb-5 text-center">목록</Text>
            <FlatList
                data={boardList}
                keyExtractor={(b) => String(b.id)}
                renderItem={renderItem}
                ListEmptyComponent={<Text className="justify-center">게시글이 없습니다.</Text>}
                contentContainerStyle={{ paddingBottom: 40 }}
            />

            <TouchableOpacity
                className="absolute bottom-5 right-5 w-14 h-14 rounded-full bg-blue-500 justify-center items-center shadow-lg"
                onPress={handleAddPress}
                activeOpacity={0.8}
            >
                <FontAwesome name="plus" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
};
