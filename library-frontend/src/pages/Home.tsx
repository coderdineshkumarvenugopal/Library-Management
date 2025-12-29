
import Navbar from '../components/Navbar';
import BookCard from '../components/BookCard';
import { useBooks, useBorrowedBooks, useBorrowBook, useReturnBook } from '../hooks/useLibrary';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setActiveTab } from '../store/uiSlice';
import { motion } from 'framer-motion';
import { FaBookOpen, FaClipboardList } from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';

const Home = () => {
  const dispatch = useAppDispatch();
  const { activeTab } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);

  // Hooks
  const userId = user?.id || 0;
  const { data: books, isLoading: loadingBooks } = useBooks();
  const { data: borrowedBooks, isLoading: loadingBorrowed } = useBorrowedBooks(userId);
  const borrowMutation = useBorrowBook();
  const returnMutation = useReturnBook();

  const handleBorrow = (bookId: string) => {
    borrowMutation.mutate({ userId, bookId }, {
      onSuccess: () => toast.success('Book borrowed successfully!'),
      onError: (err: any) => toast.error(err.response?.data || 'Failed to borrow book')
    });
  };

  const handleReturn = (bookId: string) => {
    returnMutation.mutate({ userId, bookId }, {
      onSuccess: () => toast.success('Book returned successfully!'),
      onError: (_err: any) => toast.error('Failed to return book')
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-purple-500/30">
      <Toaster position="top-right" />
      <Navbar />

      <main className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient">
            Discover Your Next Adventure
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Access thousands of books instantly from our premium library collection.
          </p>
        </header>

        {/* Tabs */}
        <div className="flex justify-center mb-10 space-x-4">
          <button
            onClick={() => dispatch(setActiveTab('catalog'))}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 font-medium ${activeTab === 'catalog'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/25 scale-105'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
          >
            <FaBookOpen />
            <span>Library Collection</span>
          </button>
          <button
            onClick={() => dispatch(setActiveTab('my-books'))}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 font-medium ${activeTab === 'my-books'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/25 scale-105'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
          >
            <FaClipboardList />
            <span>My Borrowings</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          {activeTab === 'catalog' ? (
            loadingBooks ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {books?.map((book: any) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    actionType="borrow"
                    onAction={() => handleBorrow(book.id)}
                    disabled={borrowMutation.isPending || book.availableCopies === 0}
                  />
                ))}
              </motion.div>
            )
          ) : (
            loadingBorrowed ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : borrowedBooks?.length === 0 ? (
              <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-gray-800">
                <FaBookOpen className="mx-auto text-4xl text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-300">No books borrowed yet</h3>
                <p className="text-gray-500 mt-2">Explore the collection to start reading.</p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {borrowedBooks?.map((book: any) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    actionType="return"
                    onAction={() => handleReturn(book.id)}
                    disabled={returnMutation.isPending}
                  />
                ))}
              </motion.div>
            )
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
