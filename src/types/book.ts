export interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  publishedYear: number;
  status: 'Available' | 'Issued';
  createdAt?: string;
  updatedAt?: string;
}

export interface BookFormData {
  title: string;
  author: string;
  genre: string;
  publishedYear: number;
  status: 'Available' | 'Issued';
}

export interface BookFilters {
  search: string;
  genre: string;
  status: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface BookStats {
  totalBooks: number;
  availableBooks: number;
  issuedBooks: number;
  genreDistribution: Array<{ genre: string; count: number }>;
  yearDistribution: Array<{ year: number; count: number }>;
}