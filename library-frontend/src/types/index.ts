export interface Book {
    id: string;
    title: string;
    author: string;
    isbn: string;
    totalCopies: number;
    availableCopies: number;
    genre: string;
    borrowCount: number;
    coverImage?: string;
    description?: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
}
