package com.example.socialmessaging.repository;

import com.example.socialmessaging.model.Message;
import com.example.socialmessaging.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findBySenderAndReceiverOrReceiverAndSenderOrderByTimestampAsc(User sender, User receiver, User receiver2, User sender2);
}
