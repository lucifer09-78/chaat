package com.example.socialmessaging.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    @JsonIgnore
    private String password;

    @CreationTimestamp
    private LocalDateTime createdAt;

    private LocalDateTime lastSeen;

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }
    
    // Getter for password (needed for authentication)
    public String getPassword() {
        return password;
    }

    @JsonProperty("isOnline")
    public boolean isOnline() {
        if (lastSeen == null) return false;
        // Consider user online if last seen within 10 minutes (UTC)
        return lastSeen.isAfter(LocalDateTime.now(ZoneOffset.UTC).minusMinutes(10));
    }
}
