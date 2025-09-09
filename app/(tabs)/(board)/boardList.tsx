import {FlatList, Text, View} from "react-native";
import {useEffect, useState} from "react";
import {boardFindAll} from "@/lib/boardApi";

interface AuthorLite {
    id: number | null;
    userId: string | null;
    userName: string | null;
}

interface BoardItem {
    id: number;
    title: string;
    content: string;
    attachments: string[] | null;
    createdAt: string;
    author: AuthorLite | null;
}

export default function BoardList() {
    const [boardList, setBoardList] = useState<BoardItem[]>([]);

    useEffect(() => {
        (async () => {
            const res = await boardFindAll();
            if (res?.items) setBoardList(res.items as BoardItem[]);
        })();
    }, []);

    const renderItem = ({ item: b }: { item: BoardItem }) => (
        <View className="mb-4" key={b.id}>
            <Text>id: {b.id}</Text>
            <Text>제목: {b.title}</Text>
            <Text>내용: {b.content}</Text>
            <Text>작성일: {b.createdAt}</Text>
            <Text>작성자: {b.author?.userName ?? b.author?.userId}</Text>
        </View>
    );

    return (
        <View className="flex-1 bg-white p-5">
            <Text className="text-xl font-bold mb-5 text-center">목록</Text>
            <FlatList
                data={boardList}
                keyExtractor={(b) => String(b.id)}
                renderItem={renderItem}
                ListEmptyComponent={<Text>게시글이 없습니다.</Text>}
            />
        </View>
    );
};
