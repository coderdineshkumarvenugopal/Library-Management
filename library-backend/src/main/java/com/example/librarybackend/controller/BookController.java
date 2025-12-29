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

    @PostMapping
    public Book addBook(@RequestBody Book book) {
        return libraryService.addBook(book);
    }
}
