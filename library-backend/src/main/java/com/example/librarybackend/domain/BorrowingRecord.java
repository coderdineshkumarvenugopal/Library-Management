package com.example.librarybackend.domain;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
public class BorrowingRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String bookId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDateTime borrowedAt;
    private LocalDateTime returnedAt;

    private boolean returned;

    public BorrowingRecord() {
    }

    public BorrowingRecord(User user, String bookId, LocalDateTime borrowedAt) {
        this.user = user;
        this.bookId = bookId;
        this.borrowedAt = borrowedAt;
        this.returned = false;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBookId() {
        return bookId;
    }

    public void setBookId(String bookId) {
        this.bookId = bookId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDateTime getBorrowedAt() {
        return borrowedAt;
    }

    public void setBorrowedAt(LocalDateTime borrowedAt) {
        this.borrowedAt = borrowedAt;
    }

    public LocalDateTime getReturnedAt() {
        return returnedAt;
    }

    public void setReturnedAt(LocalDateTime returnedAt) {
        this.returnedAt = returnedAt;
    }

    public boolean isReturned() {
        return returned;
    }

    public void setReturned(boolean returned) {
        this.returned = returned;
    }
}
