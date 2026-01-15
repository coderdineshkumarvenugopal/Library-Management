import { useState, useEffect } from 'react';
import BookCard from '../components/BookCard';
import { useBooks, useBorrowedBooks, useBorrowBook, useReturnBook, useSearchBooks } from '../hooks/useLibrary';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setActiveTab } from '../store/uiSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBookOpen, FaClipboardList, FaSearch, FaFilter, FaCompass } from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';
import Recommendations from '../components/Recommendations';
import TrendingBooks from '../components/TrendingBooks';
import SurpriseMe from '../components/SurpriseMe';

const Home = () => {
  const dispatch = useAppDispatch();
  const { activeTab } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Hooks
  const userId = user?.id || 0;
  const { data: allBooks, isLoading: loadingBooks } = useBooks();
  const { data: searchResults } = useSearchBooks(debouncedSearch);
  const { data: borrowedBooks, isLoading: loadingBorrowed } = useBorrowedBooks(userId);
  const borrowMutation = useBorrowBook();
  const returnMutation = useReturnBook();

  // Mood filtering logic
  const moods = [
    { name: 'Happy', emoji: '😊', genre: 'Self-Help' },
    { name: 'Adventurous', emoji: '🏹', genre: 'Sci-Fi' },
    { name: 'Thoughtful', emoji: '🤔', genre: 'Classic' },
    { name: 'Learning', emoji: '🧠', genre: 'Technology' },
  ];

  const handleBorrow = (bookId: string) => {
    borrowMutation.mutate({ userId: Number(userId), bookId }, {
      onSuccess: () => toast.success('Book borrowed successfully!'),
      onError: (err: any) => toast.error(err.response?.data || 'Failed to borrow book')
    });
  };

  const handleReturn = (bookId: string) => {
    returnMutation.mutate({ userId: Number(userId), bookId }, {
      onSuccess: () => toast.success('Book returned successfully!'),
      onError: (_err: any) => toast.error('Failed to return book')
    });
  };

  // Determine which books to display
  const getDisplayBooks = () => {
    if (debouncedSearch.length >= 2) return searchResults;
    if (selectedMood) {
      const moodGenre = moods.find(m => m.name === selectedMood)?.genre;
      return allBooks?.filter(b => b.genre === moodGenre);
    }
    return allBooks;
  };

  const displayBooks = getDisplayBooks();
  const isSearching = debouncedSearch.length >= 2;

  return (
    <div className="selection:bg-blue-500/30 pb-20">
      <Toaster position="top-right" />
      <SurpriseMe />

      <main className="">
        {/* Hero Section */}
        <header className="mb-12 text-center relative pt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-500 dark:to-pink-500 animate-gradient">
              Discover Your Next Adventure
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Access a galaxy of knowledge instantly. Explore thousands of books curated just for you.
            </p>
          </motion.div>

          {/* Premium Search Bar */}
          <div className="max-w-2xl mx-auto px-4 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000 group-focus-within:duration-200"></div>
            <div className="relative flex items-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden p-1">
              <div className="pl-4 text-gray-400">
                <FaSearch className="text-xl" />
              </div>
              <input
                type="text"
                placeholder="Search by title, author, or genre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 py-4 px-4 text-gray-900 dark:text-white placeholder-gray-500 text-lg"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="pr-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Mood Picker */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {moods.map((mood) => (
              <button
                key={mood.name}
                onClick={() => setSelectedMood(selectedMood === mood.name ? null : mood.name)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-all duration-300 ${selectedMood === mood.name
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-blue-400 dark:hover:border-blue-500'
                  }`}
              >
                <span>{mood.emoji}</span>
                <span className="font-medium">{mood.name}</span>
              </button>
            ))}
            {selectedMood && (
              <button
                onClick={() => setSelectedMood(null)}
                className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Reset Filter
              </button>
            )}
          </div>
        </header>

        {/* Tabs */}
        <div className="flex justify-center mb-10 space-x-6 border-b border-gray-200 dark:border-gray-800 pb-2">
          <button
            onClick={() => dispatch(setActiveTab('catalog'))}
            className={`flex items-center space-x-2 px-8 py-4 transition-all duration-300 font-bold text-lg relative ${activeTab === 'catalog'
              ? 'text-blue-600 dark:text-blue-500'
              : 'text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400'
              }`}
          >
            <FaCompass />
            <span>Browse Library</span>
            {activeTab === 'catalog' && (
              <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => dispatch(setActiveTab('my-books'))}
            className={`flex items-center space-x-2 px-8 py-4 transition-all duration-300 font-bold text-lg relative ${activeTab === 'my-books'
              ? 'text-blue-600 dark:text-blue-500'
              : 'text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400'
              }`}
          >
            <FaClipboardList />
            <span>My Collection</span>
            {activeTab === 'my-books' && (
              <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-500 rounded-full" />
            )}
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
              <>
                {!isSearching && !selectedMood && (
                  <>
                    <Recommendations />
                    <TrendingBooks />
                  </>
                )}

                <div className="flex items-center justify-between mb-8 mt-16">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <FaBookOpen className="text-blue-600 dark:text-blue-500" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500">
                      {isSearching ? `Search Results for "${debouncedSearch}"` : selectedMood ? `${selectedMood} Vibes` : 'Explore All Books'}
                    </span>
                  </h2>
                  <div className="h-px flex-grow mx-6 bg-gray-200 dark:bg-gray-800"></div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                >
                  <AnimatePresence mode="popLayout">
                    {displayBooks?.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="col-span-full py-20 text-center"
                      >
                        <div className="bg-gray-100 dark:bg-gray-800/50 rounded-3xl p-12 border border-dashed border-gray-300 dark:border-gray-700 max-w-md mx-auto">
                          <FaFilter className="mx-auto text-4xl text-gray-400 mb-4" />
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">No books found</h3>
                          <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your search or filter to find what you're looking for.</p>
                        </div>
                      </motion.div>
                    ) : (
                      displayBooks?.map((book: any) => (
                        <motion.div
                          key={book.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                        >
                          <BookCard
                            book={book}
                            actionType="borrow"
                            onAction={() => handleBorrow(book.id)}
                            disabled={borrowMutation.isPending || book.availableCopies === 0}
                          />
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </motion.div>
              </>
            )
          ) : (
            loadingBorrowed ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : borrowedBooks?.length === 0 ? (
              <div className="text-center py-24 bg-gray-100 dark:bg-gray-900/50 rounded-[32px] border border-gray-200 dark:border-gray-800">
                <FaBookOpen className="mx-auto text-5xl text-gray-400 mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">No books borrowed yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Your personal collection start here. Go ahead and pick a book!</p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
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
