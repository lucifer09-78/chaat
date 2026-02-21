package com.example.socialmessaging.controller;

import com.example.socialmessaging.model.User;
import com.example.socialmessaging.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> payload) {
        try {
            System.out.println("=== REGISTRATION ATTEMPT ===");
            System.out.println("Username: " + payload.get("username"));
            
            User user = userService.registerUser(payload.get("username"), payload.get("password"));
            
            System.out.println("Registration successful for user ID: " + user.getId());
            System.out.println("=== REGISTRATION SUCCESS ===");
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            System.err.println("=== REGISTRATION FAILED ===");
            System.err.println("Error: " + e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            System.err.println("=== REGISTRATION ERROR (500) ===");
            System.err.println("Unexpected error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        try {
            System.out.println("=== LOGIN ATTEMPT ===");
            System.out.println("Username: " + payload.get("username"));
            System.out.println("Password provided: " + (payload.get("password") != null ? "yes" : "no"));
            
            User user = userService.loginUser(payload.get("username"), payload.get("password"));
            
            System.out.println("Login successful for user ID: " + user.getId());
            System.out.println("=== LOGIN SUCCESS ===");
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            System.err.println("=== LOGIN FAILED ===");
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(401).body(e.getMessage());
        } catch (Exception e) {
            System.err.println("=== LOGIN ERROR (500) ===");
            System.err.println("Unexpected error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }

    @GetMapping("/search")
    public List<User> search(@RequestParam String username) {
        return userService.searchUsers(username);
    }

    @PutMapping("/update/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable Long userId, @RequestBody Map<String, String> payload) {
        try {
            System.out.println("=== UPDATE USER ===");
            System.out.println("User ID: " + userId);
            System.out.println("New username: " + payload.get("username"));
            
            User user = userService.updateUser(userId, payload.get("username"), payload.get("password"));
            
            System.out.println("User updated successfully");
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            System.err.println("Update failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        try {
            System.out.println("=== DELETE USER ===");
            System.out.println("User ID: " + userId);
            
            userService.deleteUser(userId);
            
            System.out.println("User deleted successfully");
            return ResponseEntity.ok("User deleted successfully");
        } catch (RuntimeException e) {
            System.err.println("Delete failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/heartbeat/{userId}")
    public ResponseEntity<?> updatePresence(@PathVariable Long userId) {
        try {
            userService.updateLastSeen(userId);
            return ResponseEntity.ok("Presence updated");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/online-status/{userId}")
    public ResponseEntity<?> getOnlineStatus(@PathVariable Long userId) {
        try {
            User user = userService.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            return ResponseEntity.ok(Map.of(
                "userId", user.getId(),
                "username", user.getUsername(),
                "isOnline", user.isOnline(),
                "lastSeen", user.getLastSeen()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
