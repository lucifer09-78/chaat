package com.example.socialmessaging.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
@Data
@NoArgsConstructor
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id")
    private User receiver; // Nullable for group messages

    @Column(name = "group_id")
    private Long groupId; // Nullable for private messages

    @Column(nullable = false)
    private String content;

    @CreationTimestamp
    private LocalDateTime timestamp;

    private LocalDateTime deliveredAt;

    private LocalDateTime readAt;

    @Column(name = "reply_to_id")
    private Long replyToId;             // ID of the message being replied to

    @Column(name = "reply_preview")
    private String replyPreview;        // Short preview of the quoted message

    @Column(name = "reply_sender_name")
    private String replySenderName;     // Username of the person who sent the quoted msg

    @Column(name = "edited", nullable = false, columnDefinition = "boolean default false")
    private boolean edited = false;     // Was this message edited?

    private LocalDateTime editedAt;

    public Message(User sender, User receiver, String content) {
        this.sender = sender;
        this.receiver = receiver;
        this.content = content;
    }
    
    @JsonProperty("status")
    public String getStatus() {
        if (readAt != null) return "read";
        if (deliveredAt != null) return "delivered";
        return "sent";
    }
}
