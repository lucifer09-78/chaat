package com.example.socialmessaging.repository;

import com.example.socialmessaging.model.Group;
import com.example.socialmessaging.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GroupRepository extends JpaRepository<Group, Long> {
    List<Group> findByMembersContaining(User user);
}
