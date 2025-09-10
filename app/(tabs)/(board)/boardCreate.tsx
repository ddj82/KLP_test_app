import {
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
    ActivityIndicator,
    Linking
} from "react-native";
import {useState} from "react";
import {router} from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import CustomButton from "@/components/CustomButton";
import {boardCreate} from "@/lib/boardApi";

interface SelectedImage {
    uri: string; // content://이면 사전에 file://로 변환(캐시 복사) 또는 Blob 방식 사용
    name: string; // 확장자 포함 (필수)
    type: string; // 정확한 MIME (필수)
    size?: number; // 있으면 좋음(선택)
}

export default function BoardCreate() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
    const [submitting, setSubmitting] = useState(false);

    // 이미지 선택
    const pickImages = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    '권한 필요',
                    '이미지를 선택하려면 갤러리 접근 권한이 필요합니다.\n설정에서 권한을 허용해주세요.',
                    [
                        { text: '취소', style: 'cancel' },
                        {
                            text: '설정으로 이동',
                            onPress: () => Linking.openSettings()
                        }
                    ]
                );
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsMultipleSelection: true,
                quality: 0.8,
                selectionLimit: 10 - selectedImages.length, // 최대 10개까지
            });

            if (!result.canceled) {
                const newImages = result.assets.map(asset => ({
                    uri: asset.uri,
                    name: asset.fileName ?? `image_${Date.now()}.jpg`,
                    type: asset.mimeType ?? 'image/jpeg',
                    size: asset.fileSize,
                }));

                setSelectedImages(prev => [...prev, ...newImages]);
            }
        } catch (error) {
            console.error('Image picker error:', error);
            Alert.alert('오류', '이미지 선택 중 오류가 발생했습니다.');
        }
    };

    // 이미지 제거
    const removeImage = (index: number) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
    };

    // 글 작성 제출
    const handleSubmit = async () => {
        if (!title.trim()) {
            Alert.alert('알림', '제목을 입력해주세요.');
            return;
        }
        if (!content.trim()) {
            Alert.alert('알림', '내용을 입력해주세요.');
            return;
        }

        try {
            setSubmitting(true);
            await new Promise((r) => setTimeout(r, 600));

            const res = await boardCreate(title, content, selectedImages);

            if (res.success) {
                Alert.alert('성공', '게시글이 작성되었습니다.', [
                    { text: '확인', onPress: () => router.push("/") }
                ]);
            } else {
                Alert.alert('오류', res.error ?? '게시글 등록에 실패했습니다.');
            }

        } catch (e: any) {
            console.error('Submit error:', e);
            Alert.alert('오류', e?.response?.data?.message ?? String(e));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ScrollView className="flex-1 bg-white">
            <View className="p-5">
                <Text className="text-xl font-bold mb-5 text-center">글 추가</Text>

                {/* 제목 입력 */}
                <View className="mb-4">
                    <Text className="mb-2 font-medium">제목</Text>
                    <TextInput
                        className="border border-gray-300 p-3 rounded-lg"
                        placeholder="제목을 입력하세요"
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                {/* 내용 입력 */}
                <View className="mb-4">
                    <Text className="mb-2 font-medium">내용</Text>
                    <TextInput
                        className="border border-gray-300 p-3 rounded-lg h-32"
                        placeholder="내용을 입력하세요"
                        value={content}
                        onChangeText={setContent}
                        multiline
                        textAlignVertical="top"
                    />
                </View>

                {/* 이미지 업로드 버튼 */}
                <View className="mb-4">
                    <Text className="mb-2 font-medium">첨부 이미지 ({selectedImages.length}/10)</Text>
                    <TouchableOpacity
                        className={`p-4 rounded-lg border-2 border-dashed flex-row justify-center items-center ${
                            selectedImages.length >= 10 ? 'border-gray-300 bg-gray-100' : 'border-blue-300 bg-blue-50'
                        }`}
                        onPress={pickImages}
                        disabled={selectedImages.length >= 10}
                    >
                        <FontAwesome
                            name="camera"
                            size={20}
                            color={selectedImages.length >= 10 ? '#9CA3AF' : '#3B82F6'}
                        />
                        <Text className={`ml-2 font-medium ${
                            selectedImages.length >= 10 ? 'text-gray-400' : 'text-blue-600'
                        }`}>
                            이미지 선택 (최대 10장)
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* 선택된 이미지 목록 */}
                {selectedImages.length > 0 && (
                    <View className="mb-4">
                        <Text className="mb-3 font-medium">선택된 이미지</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View className="flex-row gap-3">
                                {selectedImages.map((image, index) => (
                                    <View key={index} className="relative">
                                        <Image
                                            source={{ uri: image.uri }}
                                            className="w-24 h-24 rounded-lg"
                                        />
                                        <TouchableOpacity
                                            className="absolute top-1 right-1 bg-red-500 w-5 h-5 rounded-full justify-center items-center"
                                            onPress={() => removeImage(index)}
                                        >
                                            <FontAwesome name="times" size={10} color="white" />
                                        </TouchableOpacity>
                                        <Text className="text-xs text-gray-500 mt-1 text-center w-24" numberOfLines={1}>
                                            {image.size ? `${(image.size / 1024).toFixed(0)}KB` : ''}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                )}

                {/* 제출 버튼 */}
                <View className="flex-row gap-2 mt-6">
                    <CustomButton
                        title={"취소"}
                        onPress={() => router.back()}
                        addClass={"flex-1 p-4"}
                        bgColor={!submitting ? "bg-gray-500" : "bg-gray-300"}
                        disabled={submitting}
                    />
                    <CustomButton
                        title={"등록"}
                        onPress={handleSubmit}
                        addClass={"flex-1 p-4"}
                        bgColor={!submitting ? "bg-blue-500" : "bg-gray-300"}
                        disabled={submitting}
                        RightIcon={submitting ? <ActivityIndicator /> : null}
                    />
                </View>
            </View>
        </ScrollView>
    );
};
