package com.example.socialmessaging.controller;

import com.example.socialmessaging.model.FriendRequest;
import com.example.socialmessaging.model.User;
import com.example.socialmessaging.service.FriendRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/friends")
@CrossOrigin(origins = "*")
public class FriendRequestController {

    @Autowired
    private FriendRequestService friendRequestService;

    @PostMapping("/request/{senderId}/{receiverId}")
    public ResponseEntity<?> sendRequest(@PathVariable Long senderId, @PathVariable Long receiverId) {
        try {
            FriendRequest request = friendRequestService.sendRequest(senderId, receiverId);
            return ResponseEntity.ok(request);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/respond/{requestId}")
    public ResponseEntity<?> respondToRequest(@PathVariable Long requestId, @RequestParam boolean accept) {
        try {
            friendRequestService.respondToRequest(requestId, accept);
            return ResponseEntity.ok("Request " + (accept ? "accepted" : "rejected"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/pending/{userId}")
    public List<FriendRequest> getPendingRequests(@PathVariable Long userId) {
        return friendRequestService.getPendingRequests(userId);
    }

    @GetMapping("/list/{userId}")
    public List<User> getFriends(@PathVariable Long userId) {
        return friendRequestService.getFriends(userId);
    }
}
