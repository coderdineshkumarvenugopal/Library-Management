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

        // 4. Update book copies and borrow count
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        book.incrementBorrowCount();
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

    @Override
    public List<Book> getRecommendations(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<BorrowingRecord> history = borrowingRecordRepository.findByUser(user);

        if (history.isEmpty()) {
            // If no history, just return top books overall
            return bookRepository.findAll().stream()
                    .sorted((b1, b2) -> Integer.compare(b2.getBorrowCount(), b1.getBorrowCount()))
                    .limit(5)
                    .collect(java.util.stream.Collectors.toList());
        }

        // 1. Find most borrowed genre
        java.util.Map<String, Long> genreCounts = history.stream()
                .map(record -> bookRepository.findById(record.getBookId()).orElse(null))
                .filter(java.util.Objects::nonNull)
                .map(b -> b.getGenre() == null ? "Fiction" : b.getGenre())
                .collect(
                        java.util.stream.Collectors.groupingBy(g -> g, java.util.stream.Collectors.counting()));

        String favoriteGenre = genreCounts.entrySet().stream()
                .max(java.util.Map.Entry.comparingByValue())
                .map(java.util.Map.Entry::getKey)
                .orElse("Fiction"); // Fallback

        // 2. Recommend top books in that genre that the user has NOT borrowed yet
        java.util.Set<String> borrowedBookIds = history.stream()
                .map(BorrowingRecord::getBookId)
                .collect(java.util.stream.Collectors.toSet());

        return bookRepository.findAllByGenreOrderByBorrowCountDesc(favoriteGenre).stream()
                .filter(book -> !borrowedBookIds.contains(book.getId()))
                .limit(5)
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public java.util.List<java.util.Map<String, Object>> getAnalyticsTrends() {
        java.util.List<BorrowingRecord> allRecords = borrowingRecordRepository.findAll();
        java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");

        java.util.Map<String, java.util.Map<String, Long>> dailyStats = new java.util.HashMap<>();

        for (BorrowingRecord record : allRecords) {
            if (record.getBorrowedAt() != null) {
                String borrowDate = record.getBorrowedAt().format(formatter);
                dailyStats.putIfAbsent(borrowDate, new java.util.HashMap<>());
                java.util.Map<String, Long> stats = dailyStats.get(borrowDate);
                stats.put("borrows", stats.getOrDefault("borrows", 0L) + 1);
            }

            if (record.isReturned() && record.getReturnedAt() != null) {
                String returnDate = record.getReturnedAt().format(formatter);
                dailyStats.putIfAbsent(returnDate, new java.util.HashMap<>());
                java.util.Map<String, Long> rStats = dailyStats.get(returnDate);
                rStats.put("returns", rStats.getOrDefault("returns", 0L) + 1);
            }
        }

        return dailyStats.entrySet().stream()
                .sorted(java.util.Map.Entry.comparingByKey())
                .map(entry -> {
                    java.util.Map<String, Object> map = new java.util.HashMap<>();
                    map.put("date", entry.getKey());
                    map.put("borrows", entry.getValue().getOrDefault("borrows", 0L));
                    map.put("returns", entry.getValue().getOrDefault("returns", 0L));
                    return map;
                })
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public java.util.List<java.util.Map<String, Object>> getTopUsers() {
        java.util.List<BorrowingRecord> allRecords = borrowingRecordRepository.findAll();

        java.util.Map<Long, Long> userBorrowCounts = allRecords.stream()
                .filter(r -> r.getUser() != null)
                .collect(java.util.stream.Collectors.groupingBy(r -> r.getUser().getId(),
                        java.util.stream.Collectors.counting()));

        return userBorrowCounts.entrySet().stream()
                .sorted(java.util.Map.Entry.<Long, Long>comparingByValue().reversed())
                .limit(5)
                .map(entry -> {
                    User user = userRepository.findById(entry.getKey()).orElse(null);
                    java.util.Map<String, Object> map = new java.util.HashMap<>();
                    map.put("userId", entry.getKey());
                    map.put("userName", user != null ? user.getName() : "Unknown");
                    map.put("borrowCount", entry.getValue());
                    return map;
                })
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public java.util.List<java.util.Map<String, Object>> getRecentActivity() {
        return borrowingRecordRepository.findAllByOrderByBorrowedAtDesc().stream()
                .limit(15)
                .map(record -> {
                    Book book = bookRepository.findById(record.getBookId()).orElse(null);
                    java.util.Map<String, Object> map = new java.util.HashMap<>();
                    map.put("id", record.getId());
                    map.put("userName", record.getUser() != null ? record.getUser().getName() : "Unknown");
                    map.put("bookTitle", book != null ? book.getTitle() : "Unknown Book");
                    map.put("type", record.isReturned() ? "RETURN" : "BORROW");
                    map.put("timestamp", record.isReturned() ? record.getReturnedAt() : record.getBorrowedAt());
                    return map;
                })
                .collect(java.util.stream.Collectors.toList());
    }
}
