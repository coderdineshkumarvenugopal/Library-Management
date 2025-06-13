import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useGetBooksQuery, useCreateBookMutation, useUpdateBookMutation, useDeleteBookMutation } from '../../store/api/booksApi';
import { Book, BookFormData, BookFilters as BookFiltersType } from '../../types/book';
import { filterBooks, getUniqueGenres, paginateBooks, calculateBookStats } from '../../utils/bookUtils';
import { exportToCSV } from '../../utils/csvExport';
import BookTable from '../Books/BookTable';
import BookModal from '../Books/BookModal';
import ConfirmationModal from '../Books/ConfirmationModal';
import BookFilters from '../Books/BookFilters';
import Pagination from '../Books/Pagination';
import LoadingSkeleton from '../Layout/LoadingSkeleton';
import AnalyticsDashboard from '../Analytics/AnalyticsDashboard';

const Dashboard: React.FC = () => {
  const [filters, setFilters] = useState<BookFiltersType>({
    search: '',
    genre: '',
    status: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [bookToDelete, setBookToDelete] = useState<string | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const itemsPerPage = 10;

  const { data: books = [], isLoading, error } = useGetBooksQuery();
  const [createBook, { isLoading: isCreating }] = useCreateBookMutation();
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();
  const [deleteBook, { isLoading: isDeleting }] = useDeleteBookMutation();

  const filteredBooks = useMemo(() => filterBooks(books, filters), [books, filters]);
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const paginatedBooks = useMemo(
    () => paginateBooks(filteredBooks, currentPage, itemsPerPage),
    [filteredBooks, currentPage, itemsPerPage]
  );
  const genres = useMemo(() => getUniqueGenres(books), [books]);
  const bookStats = useMemo(() => calculateBookStats(filteredBooks), [filteredBooks]);

  const handleAddBook = () => {
    setSelectedBook(null);
    setIsModalOpen(true);
  };

  const handleEditBook = (book: Book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleDeleteBook = (bookId: string) => {
    setBookToDelete(bookId);
    setIsDeleteModalOpen(true);
  };

  const handleSubmitBook = async (data: BookFormData) => {
    try {
      if (selectedBook) {
        await updateBook({ id: selectedBook._id, book: data }).unwrap();
        toast.success('Book updated successfully!');
      } else {
        await createBook(data).unwrap();
        toast.success('Book added successfully!');
      }
      setIsModalOpen(false);
      setSelectedBook(null);
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!bookToDelete) return;

    try {
      await deleteBook(bookToDelete).unwrap();
      toast.success('Book deleted successfully!');
      setIsDeleteModalOpen(false);
      setBookToDelete(null);
    } catch (error) {
      toast.error('Failed to delete book. Please try again.');
    }
  };

  const handleExportCSV = () => {
    exportToCSV(filteredBooks, 'books');
    toast.success('Books exported to CSV!');
  };

  const handleFiltersChange = (newFilters: BookFiltersType) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Error Loading Books
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please check your connection and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Book Management Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your book collection with ease
          </p>
        </div>
        <button
          onClick={handleAddBook}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Book
        </button>
      </div>

      <BookFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        genres={genres}
        onExportCSV={handleExportCSV}
        onToggleAnalytics={() => setShowAnalytics(!showAnalytics)}
        showAnalytics={showAnalytics}
      />

      {showAnalytics && <AnalyticsDashboard stats={bookStats} />}

      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <>
          <BookTable
            books={paginatedBooks}
            onEdit={handleEditBook}
            onDelete={handleDeleteBook}
            loading={isLoading}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={filteredBooks.length}
          />
        </>
      )}

      <BookModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBook(null);
        }}
        onSubmit={handleSubmitBook}
        book={selectedBook}
        loading={isCreating || isUpdating}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setBookToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Book"
        message="Are you sure you want to delete this book? This action cannot be undone."
        loading={isDeleting}
      />
    </div>
  );
};

export default Dashboard;