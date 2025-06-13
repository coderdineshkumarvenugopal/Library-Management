import { Book } from '../types/book';

export const exportToCSV = (books: Book[], filename: string = 'books') => {
  const headers = ['Title', 'Author', 'Genre', 'Published Year', 'Status'];
  const csvContent = [
    headers.join(','),
    ...books.map(book => [
      `"${book.title}"`,
      `"${book.author}"`,
      `"${book.genre}"`,
      book.publishedYear.toString(),
      `"${book.status}"`
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};