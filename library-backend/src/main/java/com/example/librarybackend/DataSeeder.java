package com.example.librarybackend;

import com.example.librarybackend.domain.Book;
import com.example.librarybackend.domain.User;
import com.example.librarybackend.domain.Role;
import com.example.librarybackend.repository.BookRepository;
import com.example.librarybackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initDatabase() {
        return args -> {
            if (bookRepository.count() == 0) {
                bookRepository.save(new Book("The Great Gatsby", "F. Scott Fitzgerald", "9780743273565", 5, "Classic"));
                bookRepository.save(new Book("1984", "George Orwell", "9780451524935", 3, "Dystopian"));
                bookRepository.save(new Book("To Kill a Mockingbird", "Harper Lee", "9780061120084", 2, "Classic"));
                bookRepository.save(new Book("Pride and Prejudice", "Jane Austen", "9781503290563", 4, "Romance"));
                bookRepository.save(new Book("The Catcher in the Rye", "J.D. Salinger", "9780316769488", 3, "Classic"));
            }

            if (userRepository.count() == 0) {
                // Admin User
                User admin = new User();
                admin.setName("Admin User");
                admin.setEmail("admin@library.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(Role.ADMIN);
                userRepository.save(admin);

                // Normal User
                User user = new User();
                user.setName("John Doe");
                user.setEmail("user@library.com");
                user.setPassword(passwordEncoder.encode("user123"));
                user.setRole(Role.USER);
                userRepository.save(user);
            }
        };
    }
}
