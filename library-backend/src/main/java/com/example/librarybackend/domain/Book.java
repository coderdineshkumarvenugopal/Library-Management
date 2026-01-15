package com.example.librarybackend.domain;

import javax.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "books")
public class Book {
    @Id
    private String id;

    private String title;
    private String author;

    @Column(unique = true)
    private String isbn;

    private int totalCopies;
    private int availableCopies;
    private String genre;
    private int borrowCount;

    // Additional metadata
    private String coverImage;
    @Column(length = 2000)
    private String description;

    @PrePersist
    public void generateId() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
    }

    public Book() {
    }

    public Book(String title, String author, String isbn, int totalCopies, String genre) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.totalCopies = totalCopies;
        this.availableCopies = totalCopies;
        this.genre = genre;
        this.borrowCount = 0;
    }

    public Book(String id, String title, String author, String isbn, int totalCopies, int availableCopies) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.totalCopies = totalCopies;
        this.availableCopies = availableCopies;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public int getTotalCopies() {
        return totalCopies;
    }

    public void setTotalCopies(int totalCopies) {
        this.totalCopies = totalCopies;
    }

    public int getAvailableCopies() {
        return availableCopies;
    }

    public void setAvailableCopies(int availableCopies) {
        this.availableCopies = availableCopies;
    }

    public String getCoverImage() {
        return coverImage;
    }

    public void setCoverImage(String coverImage) {
        this.coverImage = coverImage;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public int getBorrowCount() {
        return borrowCount;
    }

    public void setBorrowCount(int borrowCount) {
        this.borrowCount = borrowCount;
    }

    public void incrementBorrowCount() {
        this.borrowCount++;
    }
}
