package com.example.librarybackend.repository;

import com.example.librarybackend.domain.BorrowingRecord;
import com.example.librarybackend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BorrowingRecordRepository extends JpaRepository<BorrowingRecord, Long> {

    // Check how many books user is currently borrowing (not returned)
    long countByUserAndReturnedFalse(User user);

    // Check if user has already borrowed a specific book and not returned it
    boolean existsByUserAndBookIdAndReturnedFalse(User user, String bookId);

    // Find active borrowing record for a user and book (for returning)
    Optional<BorrowingRecord> findByUserAndBookIdAndReturnedFalse(User user, String bookId);

    List<BorrowingRecord> findByUserAndReturnedFalse(User user);

    List<BorrowingRecord> findByUserIdAndReturnedFalse(Long userId);
}
