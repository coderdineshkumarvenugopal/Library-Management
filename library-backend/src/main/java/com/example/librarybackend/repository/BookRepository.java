package com.example.librarybackend.repository;

import com.example.librarybackend.domain.Book;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BookRepository extends MongoRepository<Book, String> {
    Optional<Book> findByIsbn(String isbn);

    java.util.List<Book> findAllByGenreOrderByBorrowCountDesc(String genre);

    java.util.List<Book> findByTitleContainingIgnoreCase(String title);

    java.util.List<Book> findByAuthorContainingIgnoreCase(String author);

    java.util.List<Book> findByGenreContainingIgnoreCase(String genre);
}
