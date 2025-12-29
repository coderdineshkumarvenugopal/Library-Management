package com.example.librarybackend.controller;

import com.example.librarybackend.domain.User;
import com.example.librarybackend.service.LibraryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class UserController {

    private final LibraryService libraryService;

    @PostMapping
    public User createUser(@RequestBody User user) {
        return libraryService.createUser(user);
    }

    @PostMapping("/{userId}/borrow/{bookId}")
    public ResponseEntity<String> borrowBook(@PathVariable Long userId, @PathVariable String bookId) {
        try {
            libraryService.borrowBook(userId, bookId);
            return ResponseEntity.ok("Book borrowed successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{userId}/return/{bookId}")
    public ResponseEntity<String> returnBook(@PathVariable Long userId, @PathVariable String bookId) {
        try {
            libraryService.returnBook(userId, bookId);
            return ResponseEntity.ok("Book returned successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{userId}/borrowed")
    public java.util.List<com.example.librarybackend.domain.Book> getBorrowedBooks(@PathVariable Long userId) {
        return libraryService.getBorrowedBooks(userId);
    }
}
