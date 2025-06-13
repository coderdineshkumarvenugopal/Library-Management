import React from 'react';
import { Edit, Trash2, Calendar, User, BookOpen, Tag } from 'lucide-react';
import { Book } from '../../types/book';
import StatusBadge from './StatusBadge';

interface BookTableProps {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (bookId: string) => void;
  loading?: boolean;
}

const BookTable: React.FC<BookTableProps> = ({ books, onEdit, onDelete, loading }) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="animate-pulse p-4">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-4"></div>
          {[...Array(10)].map((_, index) => (
            <div key={index} className="h-12 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
          ))}
        </div>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400 text-lg">No books found</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
          Try adjusting your search criteria or add a new book
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Book Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Genre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Year
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {books.map((book) => (
              <tr key={book._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {book.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        {book.author}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900 dark:text-white">
                    <Tag className="w-4 h-4 mr-2 text-gray-400" />
                    {book.genre}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900 dark:text-white">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {book.publishedYear}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={book.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onEdit(book)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors"
                      title="Edit book"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(book._id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors"
                      title="Delete book"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookTable;