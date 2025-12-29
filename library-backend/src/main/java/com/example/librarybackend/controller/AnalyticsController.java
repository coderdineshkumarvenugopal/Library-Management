package com.example.librarybackend.controller;

import com.example.librarybackend.domain.Book;
import com.example.librarybackend.repository.BookRepository;
import com.example.librarybackend.repository.UserRepository;
import com.example.librarybackend.service.LibraryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AnalyticsController {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final LibraryService libraryService;

    @GetMapping("/trending")
    public List<Book> getTrendingBooks() {
        return bookRepository.findAll().stream()
                .sorted((b1, b2) -> Integer.compare(b2.getBorrowCount(), b1.getBorrowCount()))
                .limit(5)
                .collect(Collectors.toList());
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalBooks", bookRepository.count());
        stats.put("totalUsers", userRepository.count());

        Map<String, Long> genreDistribution = bookRepository.findAll().stream()
                .map(b -> b.getGenre() == null ? "Uncategorized" : b.getGenre())
                .collect(Collectors.groupingBy(g -> g, Collectors.counting()));
        stats.put("genreDistribution", genreDistribution);

        return stats;
    }

    @GetMapping("/recommendations/{userId}")
    public List<Book> getRecommendations(@PathVariable Long userId) {
        return libraryService.getRecommendations(userId);
    }

    @GetMapping("/trends")
    public List<Map<String, Object>> getTrends() {
        return libraryService.getAnalyticsTrends();
    }

    @GetMapping("/top-users")
    public List<Map<String, Object>> getTopUsers() {
        return libraryService.getTopUsers();
    }

    @GetMapping("/activity")
    public List<Map<String, Object>> getRecentActivity() {
        return libraryService.getRecentActivity();
    }
}
