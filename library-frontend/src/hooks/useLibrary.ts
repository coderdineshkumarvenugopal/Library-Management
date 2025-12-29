import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBooks, getBorrowedBooks, borrowBook, returnBook, getTrendingBooks, getAnalyticsStats, getRecommendations, getAnalyticsTrends, getTopUsers, getRecentActivity } from '../api/axiosConfig';

export const useBooks = () => {
    return useQuery({
        queryKey: ['books'],
        queryFn: getBooks,
    });
};

export const useBorrowedBooks = (userId: number) => {
    return useQuery({
        queryKey: ['borrowedBooks', userId],
        queryFn: () => getBorrowedBooks(userId),
    });
};

export const useTrendingBooks = () => {
    return useQuery({
        queryKey: ['trendingBooks'],
        queryFn: getTrendingBooks,
    });
};

export const useAnalyticsStats = () => {
    return useQuery({
        queryKey: ['analyticsStats'],
        queryFn: getAnalyticsStats,
    });
};

export const useAnalyticsTrends = () => {
    return useQuery({
        queryKey: ['analyticsTrends'],
        queryFn: getAnalyticsTrends,
    });
};

export const useTopUsers = () => {
    return useQuery({
        queryKey: ['topUsers'],
        queryFn: getTopUsers,
    });
};

export const useRecentActivity = () => {
    return useQuery({
        queryKey: ['recentActivity'],
        queryFn: getRecentActivity,
    });
};

export const useRecommendations = (userId: number | null) => {
    return useQuery({
        queryKey: ['recommendations', userId],
        queryFn: () => getRecommendations(userId!),
        enabled: !!userId,
    });
};

export const useBorrowBook = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, bookId }: { userId: number; bookId: string }) => borrowBook(userId, bookId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['books'] });
            queryClient.invalidateQueries({ queryKey: ['borrowedBooks', variables.userId] });
        },
    });
};

export const useReturnBook = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, bookId }: { userId: number; bookId: string }) => returnBook(userId, bookId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['books'] });
            queryClient.invalidateQueries({ queryKey: ['borrowedBooks', variables.userId] });
        },
    });
};
