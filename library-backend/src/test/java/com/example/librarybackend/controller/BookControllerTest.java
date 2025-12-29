package com.example.librarybackend.controller;

import com.example.librarybackend.domain.Book;
import com.example.librarybackend.service.LibraryService;
import com.example.librarybackend.security.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(BookController.class)
class BookControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private LibraryService libraryService;

    @MockBean
    private JwtService jwtService;

    @Test
    @WithMockUser
    void shouldReturnAllBooks() throws Exception {
        Book book = new Book("Title", "Author", "123456", 5, "Fiction");
        List<Book> books = Arrays.asList(book);

        given(libraryService.getAllBooks()).willReturn(books);

        mockMvc.perform(get("/api/books"))
                .andExpect(status().isOk())
                .andExpect(content().json("[{'title':'Title'}]"));
    }
}
