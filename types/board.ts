interface AuthorLite {
    id: number | null;
    userId: string | null;
    userName: string | null;
}

export interface BoardItem {
    id: number;
    title: string;
    content: string;
    attachments: string[] | null;
    imageUrls?: string[] | null;
    createdAt: string;
    author: AuthorLite | null;
    comments: CommentItem[] | null;
}

export interface CommentItem {
    id: number;
    content: string;
    attachments: string[] | null;
    imageUrls?: string[] | null;
    createdAt: string;
    author: AuthorLite | null;
}