package com.example.librarybackend.dto;

public class JwtResponse {
    private String token;
    private Long id;
    private String name;
    private String email;
    private String role;

    public JwtResponse() {
    }

    public JwtResponse(String token, Long id, String name, String email, String role) {
        this.token = token;
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    public static JwtResponseBuilder builder() {
        return new JwtResponseBuilder();
    }

    public static class JwtResponseBuilder {
        private String token;
        private Long id;
        private String name;
        private String email;
        private String role;

        public JwtResponseBuilder token(String token) {
            this.token = token;
            return this;
        }

        public JwtResponseBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public JwtResponseBuilder name(String name) {
            this.name = name;
            return this;
        }

        public JwtResponseBuilder email(String email) {
            this.email = email;
            return this;
        }

        public JwtResponseBuilder role(String role) {
            this.role = role;
            return this;
        }

        public JwtResponse build() {
            return new JwtResponse(token, id, name, email, role);
        }
    }

    // Getters
    public String getToken() {
        return token;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }
}
