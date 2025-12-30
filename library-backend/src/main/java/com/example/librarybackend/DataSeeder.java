package com.example.librarybackend;

import com.example.librarybackend.domain.Book;
import com.example.librarybackend.domain.BorrowingRecord;
import com.example.librarybackend.domain.Role;
import com.example.librarybackend.domain.User;
import com.example.librarybackend.repository.BookRepository;
import com.example.librarybackend.repository.BorrowingRecordRepository;
import com.example.librarybackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Configuration
public class DataSeeder {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BorrowingRecordRepository borrowingRecordRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initDatabase() {
        return args -> {
            // 1. Seed Books if the collection is empty
            if (bookRepository.count() == 0) {
                seedBooks();
            }

            // 2. Seed Users if the table is empty
            if (userRepository.count() == 0) {
                seedUsers();
            }

            // 3. Seed Borrowing History if empty (Essential for Analytics to work)
            if (borrowingRecordRepository.count() == 0) {
                seedBorrowingHistory();
            }
        };
    }

    private void seedBooks() {
        List<Book> books = Arrays.asList(
            createBook("The Great Gatsby", "F. Scott Fitzgerald", "9780743273565", 5, "Classic",
                    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
                    "The story of the fabulously wealthy Jay Gatsby and his new love for the beautiful Daisy Buchanan."),
            
            createBook("Clean Code", "Robert C. Martin", "9780132350884", 5, "Technology",
                    "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800",
                    "A Handbook of Agile Software Craftsmanship."),

            createBook("Dune", "Frank Herbert", "9780441172719", 3, "Sci-Fi",
                    "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800",
                    "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides."),

            createBook("1984", "George Orwell", "9780451524935", 4, "Dystopian",
                    "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&q=80&w=800",
                    "Among the seminal texts of the 20th century, Nineteen Eighty-Four is a rare work that grows more haunting as its futuristic purgatory becomes more real."),

            createBook("The Pragmatic Programmer", "Andrew Hunt", "9780201616224", 4, "Technology",
                    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
                    "Your Journey to Mastery."),
            
            createBook("Atomic Habits", "James Clear", "9780735211292", 5, "Self-Help",
                    "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800",
                    "An Easy & Proven Way to Build Good Habits & Break Bad Ones.")
        );

        bookRepository.saveAll(books);
        System.out.println("Books seeded successfully.");
    }

    private Book createBook(String title, String author, String isbn, int copies, String genre, String image, String desc) {
        Book book = new Book(title, author, isbn, copies, genre);
        book.setCoverImage(image);
        book.setDescription(desc);
        return book;
    }

    private void seedUsers() {
        // Admin User
        User admin = new User();
        admin.setName("Admin User");
        admin.setEmail("admin@library.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(Role.ADMIN);
        userRepository.save(admin);

        // Normal User 1
        User user1 = new User();
        user1.setName("John Doe");
        user1.setEmail("user@library.com"); // Kept as per your original file
        user1.setPassword(passwordEncoder.encode("user123"));
        user1.setRole(Role.USER);
        userRepository.save(user1);

        // Normal User 2 (For more interesting analytics)
        User user2 = new User();
        user2.setName("Jane Smith");
        user2.setEmail("jane@library.com");
        user2.setPassword(passwordEncoder.encode("user123"));
        user2.setRole(Role.USER);
        userRepository.save(user2);
        
        System.out.println("Users seeded successfully.");
    }

    @Transactional
    public void seedBorrowingHistory() {
        // Fetch users and books
        User john = userRepository.findByEmail("user@library.com").orElse(null);
        User jane = userRepository.findByEmail("jane@library.com").orElse(null);
        List<Book> books = bookRepository.findAll();

        if (john != null && jane != null && !books.isEmpty()) {
            
            // 1. John borrowed Dune 10 days ago and returned it (History)
            Book dune = findBookByTitle(books, "Dune");
            if (dune != null) {
                createRecord(john, dune.getId(), LocalDateTime.now().minusDays(10), LocalDateTime.now().minusDays(2));
                updateBookStats(dune, false); // Returned, so only increment borrow count
            }
            
            // 2. John borrowed 1984 5 days ago (Active Loan)
            Book george = findBookByTitle(books, "1984");
            if (george != null) {
                createRecord(john, george.getId(), LocalDateTime.now().minusDays(5), null);
                updateBookStats(george, true); // Active, decrement stock
            }
            
            // 3. Jane borrowed Clean Code 15 days ago and returned it (History)
            Book cleanCode = findBookByTitle(books, "Clean Code");
            if (cleanCode != null) {
                createRecord(jane, cleanCode.getId(), LocalDateTime.now().minusDays(15), LocalDateTime.now().minusDays(10));
                updateBookStats(cleanCode, false);
            }
            
            // 4. Jane borrowed Atomic Habits 1 day ago (Active Loan)
            Book habits = findBookByTitle(books, "Atomic Habits");
            if (habits != null) {
                createRecord(jane, habits.getId(), LocalDateTime.now().minusDays(1), null);
                updateBookStats(habits, true);
            }

            System.out.println("Borrowing history seeded successfully.");
        }
    }

    private Book findBookByTitle(List<Book> books, String title) {
        return books.stream().filter(b -> b.getTitle().equals(title)).findFirst().orElse(null);
    }

    private void createRecord(User user, String bookId, LocalDateTime borrowedAt, LocalDateTime returnedAt) {
        BorrowingRecord record = new BorrowingRecord(user, bookId, borrowedAt);
        if (returnedAt != null) {
            record.setReturned(true);
            record.setReturnedAt(returnedAt);
        }
        borrowingRecordRepository.save(record);
    }

    private void updateBookStats(Book book, boolean isActiveLoan) {
        book.incrementBorrowCount();
        if (isActiveLoan) {
            book.setAvailableCopies(book.getAvailableCopies() - 1);
        }
        bookRepository.save(book);
    }
}