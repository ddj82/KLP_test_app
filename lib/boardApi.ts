import {api, normalizeAttachments, toImageUrl} from './api';

interface SelectedImage {
    uri: string; // content://이면 사전에 file://로 변환(캐시 복사) 또는 Blob 방식 사용
    name: string; // 확장자 포함 (필수)
    type: string; // 정확한 MIME (필수)
    size?: number; // 있으면 좋음(선택)
}

export const boardFindAll = async () => {
    try {
        const res = await api.get('/boards');
        const data = res.data;
        const items = (data.items ?? []).map((b: any) => {
            const attachments = normalizeAttachments(b.attachments);
            const imageUrls = attachments.map(toImageUrl);
            return { ...b, attachments, imageUrls }; // ← 화면은 imageUrls만 쓰면 됨
        });

        return { success: true, data: { items } };
    } catch (e: any) {
        console.error('boardFindAll API error:', e);
        return {
            success: false,
            error: e.response?.data?.message ?? '게시글을 불러오는데 실패했습니다.'
        };
    }
};

export const boardFindOne = async (id: number) => {
    try {
        const res = await api.get(`/boards/${id}`);
        const data = res.data;
        const attachments = normalizeAttachments(data.attachments);
        const imageUrls = attachments.map(toImageUrl);

        return { success: true, data: { ...data, attachments, imageUrls } };
    } catch (e: any) {
        console.error('boardFindOne API error:', e);
        return {
            success: false,
            error: e.response?.data?.message ?? '게시글 상세를 불러오는데 실패했습니다.'
        };
    }
};

export const boardCreate = async (title: string, content: string, images: SelectedImage[]) => {
    try {
        const formData = new FormData();

        // 필수 데이터 추가
        formData.append('title', title);
        formData.append('content', content);

        // 이미지 파일들 추가 (있을 경우에만)
        if (images && images.length > 0) {
            images.forEach((image: SelectedImage): void => {
                const file = {
                    uri: image.uri,
                    type: image.type,
                    name: image.name,
                } as any;

                formData.append('files', file);
            });
        }
        console.log('formData',formData);
        const res = await api.post('/boards', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            transformRequest: (data) => data,
        });
        return { success: true, data: res.data };
    } catch (e: any) {
        console.error('boardCreate API error:', e);
        return {
            success: false,
            error: e.response?.data?.message ?? '게시글 등록에 실패했습니다.'
        };
    }
};