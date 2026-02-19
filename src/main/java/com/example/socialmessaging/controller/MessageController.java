package com.example.socialmessaging.controller;

import com.example.socialmessaging.model.Message;
import com.example.socialmessaging.model.User;
import com.example.socialmessaging.repository.MessageRepository;
import com.example.socialmessaging.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class MessageController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @MessageMapping("/private.send")
    public void sendPrivateMessage(@Payload Map<String, String> payload) {
        String senderUsername = payload.get("sender");
        String receiverUsername = payload.get("receiver");
        String content = payload.get("content");

        User sender = userRepository.findByUsername(senderUsername)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findByUsername(receiverUsername)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Message message = new Message(sender, receiver, content);
        messageRepository.save(message);

        // Send to receiver
        messagingTemplate.convertAndSendToUser(receiverUsername, "/queue/messages", message);
        
        // Also send back to sender so they see their own message in chat
        messagingTemplate.convertAndSendToUser(senderUsername, "/queue/messages", message);
    }

    @MessageMapping("/group.send")
    public void sendGroupMessage(@Payload Map<String, Object> payload) {
        String senderUsername = (String) payload.get("sender");
        Long groupId = Long.valueOf(payload.get("groupId").toString());
        String content = (String) payload.get("content");

        User sender = userRepository.findByUsername(senderUsername)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        
        // In a real app, validate that sender is a member of the group here

        Message message = new Message();
        message.setSender(sender);
        message.setGroupId(groupId);
        message.setContent(content);
        messageRepository.save(message);

        // Broadcast to group topic
        messagingTemplate.convertAndSend("/topic/group/" + groupId, message);
    }
}
