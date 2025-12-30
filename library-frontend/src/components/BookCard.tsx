
import type { Book } from '../types';
import { motion } from 'framer-motion';

interface BookCardProps {
    book: Book;
    actionType: 'borrow' | 'return';
    onAction: () => void;
    disabled?: boolean;
}

const BookCard = ({ book, actionType, onAction, disabled }: BookCardProps) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="flex flex-col bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-blue-500/30 transition-all duration-300 group"
        >
            <div className="h-64 bg-gray-100 dark:bg-gradient-to-br dark:from-gray-700 dark:to-gray-900 flex items-center justify-center relative overflow-hidden">
                {book.coverImage ? (
                    <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <>
                        {/* Fallback pattern if no image */}
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400 via-gray-900 to-black"></div>
                        <h3 className="text-4xl font-serif text-gray-400 dark:text-gray-600 opacity-20 select-none group-hover:scale-110 transition-transform duration-500">
                            {book.title.substring(0, 1)}
                        </h3>
                    </>
                )}

                <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-widest bg-black/50 text-white backdrop-blur-md border border-white/10">
                        {book.genre}
                    </span>
                </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-1" title={book.title}>
                    {book.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs mb-4">{book.author}</p>

                <div className="mt-auto">
                    <div className="flex justify-between items-center text-xs text-gray-500 mb-4 h-6">
                        {actionType === 'borrow' && (
                            <span className={`px-2 py-1 rounded-md ${book.availableCopies > 0
                                ? 'bg-green-900/30 text-green-400 border border-green-500/30'
                                : 'bg-red-900/30 text-red-400 border border-red-500/30'
                                }`}>
                                {book.availableCopies > 0 ? `${book.availableCopies} Available` : 'Out of Stock'}
                            </span>
                        )}
                    </div>

                    <button
                        onClick={onAction}
                        disabled={disabled || (actionType === 'borrow' && book.availableCopies === 0)}
                        className={`w-full py-2.5 rounded-lg font-medium transition-all duration-200 ${actionType === 'borrow'
                            ? disabled || book.availableCopies === 0
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                            : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/25'
                            }`}
                    >
                        {actionType === 'borrow' ? 'Borrow Book' : 'Return Book'}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default BookCard;
