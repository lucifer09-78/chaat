package com.example.socialmessaging.service;

import com.example.socialmessaging.model.User;
import com.example.socialmessaging.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(String username, String password) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        User user = new User(username, password);
        return userRepository.save(user);
    }

    public User loginUser(String username, String password) {
        User user = userRepository.findByUsername(username)
                .filter(u -> u.getPassword().equals(password))
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));
        
        // Update last seen timestamp
        user.setLastSeen(LocalDateTime.now());
        userRepository.save(user);
        
        return user;
    }

    public List<User> searchUsers(String query) {
        return userRepository.findByUsernameContainingIgnoreCase(query);
    }
    
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public User updateUser(Long userId, String newUsername, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (newUsername != null && !newUsername.isEmpty()) {
            // Check if username is already taken by another user
            Optional<User> existingUser = userRepository.findByUsername(newUsername);
            if (existingUser.isPresent() && !existingUser.get().getId().equals(userId)) {
                throw new RuntimeException("Username already taken");
            }
            user.setUsername(newUsername);
        }
        
        if (newPassword != null && !newPassword.isEmpty()) {
            user.setPassword(newPassword);
        }
        
        return userRepository.save(user);
    }

    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }

    public void updateLastSeen(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setLastSeen(LocalDateTime.now());
        userRepository.save(user);
    }
}
