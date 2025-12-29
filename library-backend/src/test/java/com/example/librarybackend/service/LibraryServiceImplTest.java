package com.example.librarybackend.service;

import com.example.librarybackend.domain.Book;
import com.example.librarybackend.domain.BorrowingRecord;
import com.example.librarybackend.domain.User;
import com.example.librarybackend.repository.BookRepository;
import com.example.librarybackend.repository.BorrowingRecordRepository;
import com.example.librarybackend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LibraryServiceImplTest {

    @Mock
    private BookRepository bookRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private BorrowingRecordRepository borrowingRecordRepository;

    @InjectMocks
    private LibraryServiceImpl libraryService;

    private User user;
    private Book book;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setName("John Doe");

        book = new Book("Test Book", "Author", "12345", 5);
        book.setId("book1");
    }

    @Test
    void borrowBook_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(bookRepository.findById("book1")).thenReturn(Optional.of(book));
        when(borrowingRecordRepository.countByUserAndIsReturnedFalse(user)).thenReturn(0L);
        when(borrowingRecordRepository.existsByUserAndBookIdAndIsReturnedFalse(user, "book1")).thenReturn(false);

        libraryService.borrowBook(1L, "book1");

        verify(bookRepository).save(book);
        verify(borrowingRecordRepository).save(any(BorrowingRecord.class));
        assertEquals(4, book.getAvailableCopies());
    }

    @Test
    void borrowBook_Fail_NoStock() {
        book.setAvailableCopies(0);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(bookRepository.findById("book1")).thenReturn(Optional.of(book));

        assertThrows(RuntimeException.class, () -> libraryService.borrowBook(1L, "book1"));

        verify(bookRepository, never()).save(any());
        verify(borrowingRecordRepository, never()).save(any());
    }

    @Test
    void borrowBook_Fail_LimitExceeded() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(bookRepository.findById("book1")).thenReturn(Optional.of(book));
        when(borrowingRecordRepository.countByUserAndIsReturnedFalse(user)).thenReturn(2L);

        assertThrows(RuntimeException.class, () -> libraryService.borrowBook(1L, "book1"));
    }

    @Test
    void borrowBook_Fail_AlreadyBorrowed() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(bookRepository.findById("book1")).thenReturn(Optional.of(book));
        when(borrowingRecordRepository.countByUserAndIsReturnedFalse(user)).thenReturn(1L);
        when(borrowingRecordRepository.existsByUserAndBookIdAndIsReturnedFalse(user, "book1")).thenReturn(true);

        assertThrows(RuntimeException.class, () -> libraryService.borrowBook(1L, "book1"));
    }

    @Test
    void returnBook_Success() {
        book.setAvailableCopies(4);
        BorrowingRecord record = new BorrowingRecord(user, "book1", LocalDateTime.now());

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(bookRepository.findById("book1")).thenReturn(Optional.of(book));
        when(borrowingRecordRepository.findByUserAndBookIdAndIsReturnedFalse(user, "book1"))
                .thenReturn(Optional.of(record));

        libraryService.returnBook(1L, "book1");

        assertTrue(record.isReturned());
        assertNotNull(record.getReturnedAt());
        assertEquals(5, book.getAvailableCopies());
        verify(bookRepository).save(book);
    }
}
