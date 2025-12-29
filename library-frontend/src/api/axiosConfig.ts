import axios from 'axios';
import type { Book } from '../types';
import { store } from '../store/store';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const state = store.getState();
    const token = state.auth.token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getBooks = async (): Promise<Book[]> => {
    const response = await api.get('/books');
    return response.data;
};

export const borrowBook = async (userId: number, bookId: string): Promise<void> => {
    await api.post(`/users/${userId}/borrow/${bookId}`);
};

export const returnBook = async (userId: number, bookId: string): Promise<void> => {
    await api.post(`/users/${userId}/return/${bookId}`);
};

export const getBorrowedBooks = async (userId: number): Promise<Book[]> => {
    const response = await api.get(`/users/${userId}/borrowed`);
    return response.data;
};

export default api;
