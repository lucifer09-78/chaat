package com.example.socialmessaging.service;

import com.example.socialmessaging.model.FriendRequest;
import com.example.socialmessaging.model.FriendRequestStatus;
import com.example.socialmessaging.model.User;
import com.example.socialmessaging.repository.FriendRequestRepository;
import com.example.socialmessaging.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FriendRequestService {

    @Autowired
    private FriendRequestRepository friendRequestRepository;

    @Autowired
    private UserRepository userRepository;

    public FriendRequest sendRequest(Long senderId, Long receiverId) {
        User sender = userRepository.findById(senderId).orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(receiverId).orElseThrow(() -> new RuntimeException("Receiver not found"));

        if (friendRequestRepository.findBySenderAndReceiver(sender, receiver).isPresent()) {
            throw new RuntimeException("Request already sent");
        }

        FriendRequest request = new FriendRequest(sender, receiver);
        return friendRequestRepository.save(request);
    }

    public void respondToRequest(Long requestId, boolean accept) {
        FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (request.getStatus() != FriendRequestStatus.PENDING) {
            throw new RuntimeException("Request already processed");
        }

        request.setStatus(accept ? FriendRequestStatus.ACCEPTED : FriendRequestStatus.REJECTED);
        friendRequestRepository.save(request);
    }

    public List<FriendRequest> getPendingRequests(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return friendRequestRepository.findByReceiverAndStatus(user, FriendRequestStatus.PENDING);
    }

    public List<User> getFriends(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        List<FriendRequest> received = friendRequestRepository.findByReceiverAndStatus(user, FriendRequestStatus.ACCEPTED);
        List<FriendRequest> sent = friendRequestRepository.findBySenderAndStatus(user, FriendRequestStatus.ACCEPTED);
        
        List<User> friends = new java.util.ArrayList<>();
        for (FriendRequest req : received) {
            friends.add(req.getSender());
        }
        for (FriendRequest req : sent) {
            friends.add(req.getReceiver());
        }
        return friends;
    }
}
