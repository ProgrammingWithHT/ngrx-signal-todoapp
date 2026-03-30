export const DEFAULT_TODO_CATEGORY = 'General';

export type TodoAttachment = {
    id: string;
    name: string;
    mimeType: string;
    size: number;
    url: string;
    kind: 'image' | 'file';
}

export type Todo = {
    id: string;
    title: string;
    completed: boolean;
    category: string;
    tags: string[];
    attachments: TodoAttachment[];
}
