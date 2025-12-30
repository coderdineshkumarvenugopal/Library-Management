package com.example.librarybackend.controller;

import com.example.librarybackend.domain.Book;
import com.example.librarybackend.service.LibraryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "http://localhost:5173") // Allow Frontend
@RequiredArgsConstructor
public class BookController {

    private final LibraryService libraryService;

    @GetMapping
    public List<Book> getAllBooks() {
        return libraryService.getAllBooks();
    }

    @GetMapping("/search")
    public List<Book> searchBooks(@RequestParam(required = false) String query) {
        return libraryService.searchBooks(query);
    }

    @GetMapping("/recommendations/{userId}")
    public List<Book> getRecommendations(@PathVariable Long userId) {
        return libraryService.getRecommendations(userId);
    }

    @GetMapping("/random")
    public Book getRandomBook(@RequestParam(required = false) String mood) {
        return libraryService.getRandomBookByGenre(mood);
    }

    @PostMapping
    public Book addBook(@RequestBody Book book) {
        return libraryService.addBook(book);
    }
}
