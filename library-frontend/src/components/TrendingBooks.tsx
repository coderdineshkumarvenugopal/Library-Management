import React from 'react';
import { useTrendingBooks, useBorrowBook } from '../hooks/useLibrary';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import BookCard from './BookCard';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FaFire } from 'react-icons/fa';

const TrendingBooks: React.FC = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const userId = user?.id || 0;
    const { data: trending, isLoading } = useTrendingBooks();
    const borrowMutation = useBorrowBook();

    const handleBorrow = (bookId: string) => {
        if (!userId) {
            toast.error('Please login to borrow books');
            return;
        }
        borrowMutation.mutate({ userId, bookId }, {
            onSuccess: () => toast.success('Book borrowed successfully!'),
            onError: (err: any) => toast.error(err.response?.data || 'Failed to borrow book')
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!trending || trending.length === 0) {
        return null;
    }

    return (
        <section className="my-12">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <FaFire className="text-orange-500" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500">
                        Trending Now
                    </span>
                </h2>
                <div className="h-px flex-grow mx-6 bg-gray-800"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            >
                {trending.map((book, index) => (
                    <motion.div
                        key={book.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <BookCard
                            book={book}
                            actionType="borrow"
                            onAction={() => handleBorrow(book.id)}
                            disabled={borrowMutation.isPending || book.availableCopies === 0}
                        />
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
};

export default TrendingBooks;
