import { Book, BookStats } from '../types/book';

export const calculateBookStats = (books: Book[]): BookStats => {
  const totalBooks = books.length;
  const availableBooks = books.filter(book => book.status === 'Available').length;
  const issuedBooks = books.filter(book => book.status === 'Issued').length;

  // Genre distribution
  const genreMap = new Map<string, number>();
  books.forEach(book => {
    genreMap.set(book.genre, (genreMap.get(book.genre) || 0) + 1);
  });
  const genreDistribution = Array.from(genreMap.entries()).map(([genre, count]) => ({
    genre,
    count,
  }));

  // Year distribution
  const yearMap = new Map<number, number>();
  books.forEach(book => {
    yearMap.set(book.publishedYear, (yearMap.get(book.publishedYear) || 0) + 1);
  });
  const yearDistribution = Array.from(yearMap.entries())
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => a.year - b.year);

  return {
    totalBooks,
    availableBooks,
    issuedBooks,
    genreDistribution,
    yearDistribution,
  };
};

export const filterBooks = (books: Book[], filters: { search: string; genre: string; status: string }): Book[] => {
  return books.filter(book => {
    const matchesSearch = !filters.search || 
      book.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      book.author.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesGenre = !filters.genre || book.genre === filters.genre;
    const matchesStatus = !filters.status || book.status === filters.status;

    return matchesSearch && matchesGenre && matchesStatus;
  });
};

export const getUniqueGenres = (books: Book[]): string[] => {
  const genres = new Set(books.map(book => book.genre));
  return Array.from(genres).sort();
};

export const paginateBooks = (books: Book[], page: number, itemsPerPage: number) => {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return books.slice(startIndex, endIndex);
};