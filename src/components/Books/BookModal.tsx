import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { Book, BookFormData } from '../../types/book';

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BookFormData) => void;
  book?: Book | null;
  loading?: boolean;
}

const BookModal: React.FC<BookModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  book,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookFormData>();

  useEffect(() => {
    if (book) {
      reset({
        title: book.title,
        author: book.author,
        genre: book.genre,
        publishedYear: book.publishedYear,
        status: book.status,
      });
    } else {
      reset({
        title: '',
        author: '',
        genre: '',
        publishedYear: new Date().getFullYear(),
        status: 'Available',
      });
    }
  }, [book, reset]);

  const handleFormSubmit = (data: BookFormData) => {
    onSubmit(data);
    if (!book) {
      reset();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {book ? 'Edit Book' : 'Add New Book'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              {...register('title', { required: 'Title is required' })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter book title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Author *
            </label>
            <input
              type="text"
              {...register('author', { required: 'Author is required' })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter author name"
            />
            {errors.author && (
              <p className="text-red-500 text-sm mt-1">{errors.author.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Genre *
            </label>
            <input
              type="text"
              {...register('genre', { required: 'Genre is required' })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter genre"
            />
            {errors.genre && (
              <p className="text-red-500 text-sm mt-1">{errors.genre.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Published Year *
            </label>
            <input
              type="number"
              {...register('publishedYear', {
                required: 'Published year is required',
                min: { value: 1000, message: 'Year must be at least 1000' },
                max: { value: new Date().getFullYear(), message: 'Year cannot be in the future' },
              })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter publication year"
            />
            {errors.publishedYear && (
              <p className="text-red-500 text-sm mt-1">{errors.publishedYear.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status *
            </label>
            <select
              {...register('status', { required: 'Status is required' })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="Available">Available</option>
              <option value="Issued">Issued</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : book ? 'Update Book' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookModal;