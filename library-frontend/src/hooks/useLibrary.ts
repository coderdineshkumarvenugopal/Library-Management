import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBooks, getBorrowedBooks, borrowBook, returnBook } from '../api/axiosConfig';

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
