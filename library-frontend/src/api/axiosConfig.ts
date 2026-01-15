import axios from 'axios';
import type { Book } from '../types';
import { store } from '../store/store';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
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
    const response = await api.get('/api/books');
    return response.data;
};

export const borrowBook = async (userId: number, bookId: string): Promise<void> => {
    await api.post(`/api/users/${userId}/borrow/${bookId}`);
};

export const returnBook = async (userId: number, bookId: string): Promise<void> => {
    await api.post(`/api/users/${userId}/return/${bookId}`);
};

export const getBorrowedBooks = async (userId: number): Promise<Book[]> => {
    const response = await api.get(`/api/users/${userId}/borrowed`);
    return response.data;
};

export const getTrendingBooks = async (): Promise<Book[]> => {
    const response = await api.get('/api/analytics/trending');
    return response.data;
};

export const getAnalyticsStats = async (): Promise<any> => {
    const response = await api.get('/api/analytics/stats');
    return response.data;
};

export const getRecommendations = async (userId: number): Promise<Book[]> => {
    const response = await api.get(`/api/analytics/recommendations/${userId}`);
    return response.data;
};

export const getAnalyticsTrends = async (): Promise<any[]> => {
    const response = await api.get('/api/analytics/trends');
    return response.data;
};

export const getTopUsers = async (): Promise<any[]> => {
    const response = await api.get('/api/analytics/top-users');
    return response.data;
};

export const getRecentActivity = async (): Promise<any[]> => {
    const response = await api.get('/api/analytics/activity');
    return response.data;
};

export const searchBooks = async (query: string): Promise<Book[]> => {
    const response = await api.get(`/api/books/search?query=${encodeURIComponent(query)}`);
    return response.data;
};

export const getRandomBook = async (mood: string): Promise<Book | null> => {
    const response = await api.get(`/api/books/random?mood=${encodeURIComponent(mood)}`);
    return response.data;
};

export default api;
