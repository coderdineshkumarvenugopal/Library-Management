package com.example.librarybackend.service;

import com.example.librarybackend.domain.Book;
import com.example.librarybackend.domain.BorrowingRecord;
import com.example.librarybackend.domain.User;
import com.example.librarybackend.repository.BookRepository;
import com.example.librarybackend.repository.BorrowingRecordRepository;
import com.example.librarybackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LibraryServiceImpl implements LibraryService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final BorrowingRecordRepository borrowingRecordRepository;

    @Override
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    @Override
    public Book addBook(Book book) {
        return bookRepository.save(book);
    }

    @Override
    public User createUser(User user) {
        return userRepository.save(user);
    }

    @Override
    @Transactional
    public void borrowBook(Long userId, String bookId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        // 1. Check borrowing limit
        long borrowedCount = borrowingRecordRepository.countByUserAndReturnedFalse(user);
        if (borrowedCount >= 2) {
            throw new RuntimeException("User has reached borrowing limit");
        }

        // 2. Check if user already borrowed this book
        if (borrowingRecordRepository.existsByUserAndBookIdAndReturnedFalse(user, bookId)) {
            throw new RuntimeException("User already has a copy of this book");
        }

        // 3. Check stock
        if (book.getAvailableCopies() <= 0) {
            throw new RuntimeException("Book out of stock");
        }

        // 4. Update book copies
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        // 5. Create borrowing record
        BorrowingRecord record = new BorrowingRecord(user, bookId, java.time.LocalDateTime.now());
        borrowingRecordRepository.save(record);
    }

    @Override
    @Transactional
    public void returnBook(Long userId, String bookId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        BorrowingRecord record = borrowingRecordRepository.findByUserAndBookIdAndReturnedFalse(user, bookId)
                .orElseThrow(() -> new RuntimeException("No active borrowing record found"));

        // 1. Mark as returned
        record.setReturned(true);
        record.setReturnedAt(java.time.LocalDateTime.now());
        borrowingRecordRepository.save(record);

        // 2. Update stock
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);
    }

    @Override
    public List<Book> getBorrowedBooks(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<BorrowingRecord> records = borrowingRecordRepository.findByUserAndReturnedFalse(user);

        // This is not efficient (N+1), but OK for KISS/small scale
        return records.stream()
                .map(record -> bookRepository.findById(record.getBookId()).orElse(null))
                .filter(java.util.Objects::nonNull)
                .collect(java.util.stream.Collectors.toList());
    }
}
