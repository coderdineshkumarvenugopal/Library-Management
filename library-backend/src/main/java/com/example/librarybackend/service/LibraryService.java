package com.example.librarybackend.service;

import com.example.librarybackend.domain.Book;
import com.example.librarybackend.domain.User;

import java.util.List;

public interface LibraryService {
    List<Book> getAllBooks();

    Book addBook(Book book);

    User createUser(User user);

    void borrowBook(Long userId, String bookId);

    void returnBook(Long userId, String bookId);

    List<Book> getBorrowedBooks(Long userId);

    List<Book> getRecommendations(Long userId);

    java.util.List<java.util.Map<String, Object>> getAnalyticsTrends();

    java.util.List<java.util.Map<String, Object>> getTopUsers();

    java.util.List<java.util.Map<String, Object>> getRecentActivity();
}
