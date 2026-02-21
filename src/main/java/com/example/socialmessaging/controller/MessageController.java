package com.example.socialmessaging.controller;

import com.example.socialmessaging.model.Message;
import com.example.socialmessaging.model.User;
import com.example.socialmessaging.repository.MessageRepository;
import com.example.socialmessaging.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class MessageController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    // ─── REST: Fetch private chat history ─────────────────────────────────────
    @GetMapping("/messages/history")
    public ResponseEntity<List<Message>> getMessageHistory(
            @RequestParam Long userId,
            @RequestParam Long friendId) {

        User user   = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User friend = userRepository.findById(friendId)
                .orElseThrow(() -> new RuntimeException("Friend not found"));

        List<Message> messages = messageRepository
                .findBySenderAndReceiverOrReceiverAndSenderOrderByTimestampAsc(
                        user, friend, user, friend);

        return ResponseEntity.ok(messages);
    }

    // ─── REST: Fetch group message history ────────────────────────────────────
    @GetMapping("/messages/group/{groupId}")
    public ResponseEntity<List<Message>> getGroupHistory(@PathVariable Long groupId) {
        List<Message> messages = messageRepository.findByGroupIdOrderByTimestampAsc(groupId);
        return ResponseEntity.ok(messages);
    }

    // ─── REST: Edit a message ──────────────────────────────────────────────────
    @PutMapping("/messages/edit/{messageId}")
    public ResponseEntity<?> editMessage(@PathVariable Long messageId, @RequestBody Map<String, String> payload) {
        try {
            Message message = messageRepository.findById(messageId)
                    .orElseThrow(() -> new RuntimeException("Message not found"));
            message.setContent(payload.get("content"));
            message.setEdited(true);
            message.setEditedAt(LocalDateTime.now());
            messageRepository.save(message);
            return ResponseEntity.ok(message);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error editing message: " + e.getMessage());
        }
    }

    // ─── REST: Delete a single message ────────────────────────────────────────
    @DeleteMapping("/messages/{messageId}")
    public ResponseEntity<?> deleteMessage(@PathVariable Long messageId) {
        try {
            Message message = messageRepository.findById(messageId)
                    .orElseThrow(() -> new RuntimeException("Message not found"));
            messageRepository.delete(message);
            return ResponseEntity.ok(Map.of("deleted", messageId));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting message: " + e.getMessage());
        }
    }

    // ─── REST: Delete private chat history ────────────────────────────────────
    @DeleteMapping("/messages/delete/private")
    public ResponseEntity<?> deletePrivateChat(@RequestParam Long userId, @RequestParam Long friendId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            User friend = userRepository.findById(friendId)
                    .orElseThrow(() -> new RuntimeException("Friend not found"));

            List<Message> messages = messageRepository
                    .findBySenderAndReceiverOrReceiverAndSenderOrderByTimestampAsc(
                            user, friend, user, friend);
            
            messageRepository.deleteAll(messages);
            return ResponseEntity.ok("Chat deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting chat: " + e.getMessage());
        }
    }

    // ─── REST: Mark message as delivered ───────────────────────────────────────
    @PutMapping("/messages/delivered/{messageId}")
    public ResponseEntity<?> markAsDelivered(@PathVariable Long messageId) {
        try {
            Message message = messageRepository.findById(messageId)
                    .orElseThrow(() -> new RuntimeException("Message not found"));
            
            if (message.getDeliveredAt() == null) {
                message.setDeliveredAt(java.time.LocalDateTime.now());
                messageRepository.save(message);
            }
            
            return ResponseEntity.ok(message);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating message: " + e.getMessage());
        }
    }

    // ─── REST: Mark message as read ────────────────────────────────────────────
    @PutMapping("/messages/read/{messageId}")
    public ResponseEntity<?> markAsRead(@PathVariable Long messageId) {
        try {
            Message message = messageRepository.findById(messageId)
                    .orElseThrow(() -> new RuntimeException("Message not found"));
            
            if (message.getReadAt() == null) {
                message.setReadAt(java.time.LocalDateTime.now());
                if (message.getDeliveredAt() == null) {
                    message.setDeliveredAt(java.time.LocalDateTime.now());
                }
                messageRepository.save(message);
            }
            
            return ResponseEntity.ok(message);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating message: " + e.getMessage());
        }
    }

    // ─── REST: Mark all messages as read ───────────────────────────────────────
    @PutMapping("/messages/read-all")
    public ResponseEntity<?> markAllAsRead(@RequestParam Long userId, @RequestParam Long senderId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            User sender = userRepository.findById(senderId)
                    .orElseThrow(() -> new RuntimeException("Sender not found"));

            List<Message> messages = messageRepository
                    .findBySenderAndReceiverOrderByTimestampAsc(sender, user);
            
            java.time.LocalDateTime now = java.time.LocalDateTime.now();
            for (Message message : messages) {
                if (message.getReadAt() == null) {
                    message.setReadAt(now);
                    if (message.getDeliveredAt() == null) {
                        message.setDeliveredAt(now);
                    }
                }
            }
            
            messageRepository.saveAll(messages);
            return ResponseEntity.ok("Messages marked as read");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating messages: " + e.getMessage());
        }
    }

    // ─── WebSocket: Send private message ──────────────────────────────────────
    @MessageMapping("/private.send")
    public void sendPrivateMessage(@Payload Map<String, String> payload) {
        try {
            System.out.println("=== RECEIVED PRIVATE MESSAGE ===");
            System.out.println("Payload: " + payload);
            
            String senderUsername   = payload.get("sender");
            String receiverUsername = payload.get("receiver");
            String content          = payload.get("content");

            System.out.println("Sender: " + senderUsername);
            System.out.println("Receiver: " + receiverUsername);
            System.out.println("Content: " + content);

            User sender   = userRepository.findByUsername(senderUsername)
                    .orElseThrow(() -> new RuntimeException("Sender not found: " + senderUsername));
            User receiver = userRepository.findByUsername(receiverUsername)
                    .orElseThrow(() -> new RuntimeException("Receiver not found: " + receiverUsername));

            System.out.println("Found sender ID: " + sender.getId());
            System.out.println("Found receiver ID: " + receiver.getId());

            Message message = new Message(sender, receiver, content);
            // Save reply metadata if present
            String replyToIdStr = payload.get("replyToId");
            if (replyToIdStr != null && !replyToIdStr.isEmpty()) {
                message.setReplyToId(Long.valueOf(replyToIdStr));
                message.setReplyPreview(payload.get("replyPreview"));
                message.setReplySenderName(payload.get("replySenderName"));
            }
            messageRepository.save(message);

            System.out.println("Message saved with ID: " + message.getId());
            System.out.println("Sending to receiver: " + receiverUsername);
            
            // Deliver to receiver
            messagingTemplate.convertAndSendToUser(receiverUsername, "/queue/messages", message);
            // Echo back to sender so they see their own message immediately
            messagingTemplate.convertAndSendToUser(senderUsername, "/queue/messages", message);
            
            System.out.println("=== MESSAGE SENT SUCCESSFULLY ===");
        } catch (Exception e) {
            System.err.println("=== ERROR SENDING MESSAGE ===");
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // ─── WebSocket: Send group message ────────────────────────────────────────
    @MessageMapping("/group.send")
    public void sendGroupMessage(@Payload Map<String, Object> payload) {
        String senderUsername = (String) payload.get("sender");
        Long   groupId        = Long.valueOf(payload.get("groupId").toString());
        String content        = (String) payload.get("content");

        User sender = userRepository.findByUsername(senderUsername)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        Message message = new Message();
        message.setSender(sender);
        message.setGroupId(groupId);
        message.setContent(content);
        // Save reply metadata if present
        String replyToIdStr = payload.containsKey("replyToId") ? payload.get("replyToId").toString() : "";
        if (!replyToIdStr.isEmpty()) {
            message.setReplyToId(Long.valueOf(replyToIdStr));
            message.setReplyPreview(payload.containsKey("replyPreview") ? payload.get("replyPreview").toString() : "");
            message.setReplySenderName(payload.containsKey("replySenderName") ? payload.get("replySenderName").toString() : "");
        }
        messageRepository.save(message);

        messagingTemplate.convertAndSend("/topic/group/" + groupId, message);
    }
    // ─── WebSocket: Typing indicator ──────────────────────────────────────────
    @MessageMapping("/typing")
    public void handleTyping(@Payload Map<String, String> payload) {
        String senderUsername   = payload.get("sender");
        String receiverUsername = payload.get("receiver");
        String groupId          = payload.get("groupId");
        boolean isTyping = Boolean.parseBoolean(payload.getOrDefault("typing", "true"));

        Map<String, Object> typingEvent = Map.of(
            "sender", senderUsername,
            "typing", isTyping
        );

        if (groupId != null && !groupId.isEmpty()) {
            messagingTemplate.convertAndSend("/topic/typing/group/" + groupId, typingEvent);
        } else if (receiverUsername != null) {
            messagingTemplate.convertAndSendToUser(receiverUsername, "/queue/typing", typingEvent);
        }
    }
}
