import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Book, BookFormData } from '../../types/book';
import { mockBooks, generateId, getCurrentTimestamp } from '../../data/mockBooks';

// Using a mock API endpoint - replace with your actual API
const API_BASE_URL = 'https://crudcrud.com/api/2d2e7c8b12f44e8c9e5d4f3a8b9c1d2e';

// Mock data store for development
let mockDataStore = [...mockBooks];

// Transform function to ensure consistent data structure
const transformBookResponse = (data: any): Book => {
  return {
    _id: data._id || data.id || generateId(),
    title: data.title || '',
    author: data.author || '',
    genre: data.genre || '',
    publishedYear: data.publishedYear || new Date().getFullYear(),
    status: data.status || 'Available',
    createdAt: data.createdAt || getCurrentTimestamp(),
    updatedAt: data.updatedAt || getCurrentTimestamp(),
  };
};

export const booksApi = createApi({
  reducerPath: 'booksApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    timeout: 5000, // 5 second timeout
  }),
  tagTypes: ['Book'],
  endpoints: (builder) => ({
    getBooks: builder.query<Book[], void>({
      queryFn: async (arg, api, extraOptions, baseQuery) => {
        try {
          const result = await baseQuery('/books');
          
          // If API call succeeds and returns data
          if (!result.error && result.data) {
            const response = result.data as any[];
            if (Array.isArray(response) && response.length > 0) {
              return { data: response.map(transformBookResponse) };
            }
          }
          
          // Fallback to mock data if API fails or returns empty data
          console.log('Using mock data fallback for getBooks');
          return { data: mockDataStore.map(transformBookResponse) };
        } catch (error) {
          // Return mock data on any error
          console.log('API error, using mock data:', error);
          return { data: mockDataStore.map(transformBookResponse) };
        }
      },
      providesTags: ['Book'],
    }),
    
    getBook: builder.query<Book, string>({
      queryFn: async (id, api, extraOptions, baseQuery) => {
        try {
          const result = await baseQuery(`/books/${id}`);
          
          if (!result.error && result.data) {
            return { data: transformBookResponse(result.data) };
          }
          
          // Fallback to mock data
          const mockBook = mockDataStore.find(book => book._id === id);
          if (mockBook) {
            return { data: transformBookResponse(mockBook) };
          }
          
          return { error: { status: 404, data: 'Book not found' } };
        } catch (error) {
          const mockBook = mockDataStore.find(book => book._id === id);
          if (mockBook) {
            return { data: transformBookResponse(mockBook) };
          }
          return { error: { status: 404, data: 'Book not found' } };
        }
      },
      providesTags: ['Book'],
    }),
    
    createBook: builder.mutation<Book, BookFormData>({
      queryFn: async (book, api, extraOptions, baseQuery) => {
        try {
          const result = await baseQuery({
            url: '/books',
            method: 'POST',
            body: book,
          });
          
          if (!result.error && result.data) {
            const createdBook = transformBookResponse(result.data);
            // Also add to mock store for consistency
            mockDataStore.push(createdBook);
            return { data: createdBook };
          }
          
          // Fallback: create in mock store
          const newBook: Book = {
            _id: generateId(),
            ...book,
            createdAt: getCurrentTimestamp(),
            updatedAt: getCurrentTimestamp(),
          };
          mockDataStore.push(newBook);
          return { data: newBook };
        } catch (error) {
          // Create in mock store on error
          const newBook: Book = {
            _id: generateId(),
            ...book,
            createdAt: getCurrentTimestamp(),
            updatedAt: getCurrentTimestamp(),
          };
          mockDataStore.push(newBook);
          return { data: newBook };
        }
      },
      invalidatesTags: ['Book'],
    }),
    
    updateBook: builder.mutation<Book, { id: string; book: BookFormData }>({
      queryFn: async ({ id, book }, api, extraOptions, baseQuery) => {
        try {
          const result = await baseQuery({
            url: `/books/${id}`,
            method: 'PUT',
            body: book,
          });
          
          if (!result.error && result.data) {
            const updatedBook = transformBookResponse(result.data);
            // Also update mock store for consistency
            const bookIndex = mockDataStore.findIndex(b => b._id === id);
            if (bookIndex !== -1) {
              mockDataStore[bookIndex] = updatedBook;
            }
            return { data: updatedBook };
          }
          
          // Fallback: update in mock store
          const bookIndex = mockDataStore.findIndex(b => b._id === id);
          if (bookIndex !== -1) {
            const updatedBook: Book = {
              ...mockDataStore[bookIndex],
              ...book,
              updatedAt: getCurrentTimestamp(),
            };
            mockDataStore[bookIndex] = updatedBook;
            return { data: updatedBook };
          }
          
          return { error: { status: 404, data: 'Book not found' } };
        } catch (error) {
          // Update in mock store on error
          const bookIndex = mockDataStore.findIndex(b => b._id === id);
          if (bookIndex !== -1) {
            const updatedBook: Book = {
              ...mockDataStore[bookIndex],
              ...book,
              updatedAt: getCurrentTimestamp(),
            };
            mockDataStore[bookIndex] = updatedBook;
            return { data: updatedBook };
          }
          return { error: { status: 404, data: 'Book not found' } };
        }
      },
      invalidatesTags: ['Book'],
    }),
    
    deleteBook: builder.mutation<void, string>({
      queryFn: async (id, api, extraOptions, baseQuery) => {
        try {
          const result = await baseQuery({
            url: `/books/${id}`,
            method: 'DELETE',
          });
          
          if (!result.error) {
            // Also delete from mock store for consistency
            const bookIndex = mockDataStore.findIndex(book => book._id === id);
            if (bookIndex !== -1) {
              mockDataStore.splice(bookIndex, 1);
            }
            return { data: undefined };
          }
          
          // Fallback: delete from mock store
          const bookIndex = mockDataStore.findIndex(book => book._id === id);
          if (bookIndex !== -1) {
            mockDataStore.splice(bookIndex, 1);
            return { data: undefined };
          }
          
          return { error: { status: 404, data: 'Book not found' } };
        } catch (error) {
          // Delete from mock store on error
          const bookIndex = mockDataStore.findIndex(book => book._id === id);
          if (bookIndex !== -1) {
            mockDataStore.splice(bookIndex, 1);
            return { data: undefined };
          }
          return { error: { status: 404, data: 'Book not found' } };
        }
      },
      invalidatesTags: ['Book'],
    }),
  }),
});

export const {
  useGetBooksQuery,
  useGetBookQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
} = booksApi;