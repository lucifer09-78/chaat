package com.example.socialmessaging.controller;

import com.example.socialmessaging.model.Group;
import com.example.socialmessaging.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/groups")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class GroupController {

    @Autowired
    private GroupService groupService;

    @PostMapping("/create")
    public ResponseEntity<?> createGroup(@RequestBody Map<String, Object> payload) {
        try {
            String name = (String) payload.get("name");
            Long createdById = Long.valueOf(payload.get("createdBy").toString());
            Group group = groupService.createGroup(name, createdById);
            return ResponseEntity.ok(group);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/add-member")
    public ResponseEntity<?> addMember(@RequestBody Map<String, Object> payload) {
        try {
            Long groupId = Long.valueOf(payload.get("groupId").toString());
            Long userId = Long.valueOf(payload.get("userId").toString());
            Group group = groupService.addMember(groupId, userId);
            return ResponseEntity.ok(group);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/list/{userId}")
    public List<Group> getUserGroups(@PathVariable Long userId) {
        return groupService.getUserGroups(userId);
    }

    @PutMapping("/update/{groupId}")
    public ResponseEntity<?> updateGroup(@PathVariable Long groupId, @RequestBody Map<String, String> payload) {
        try {
            String newName = payload.get("name");
            Group group = groupService.updateGroupName(groupId, newName);
            return ResponseEntity.ok(group);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/leave/{groupId}/{userId}")
    public ResponseEntity<?> leaveGroup(@PathVariable Long groupId, @PathVariable Long userId) {
        try {
            groupService.removeMember(groupId, userId);
            return ResponseEntity.ok("Left group successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/delete/{groupId}")
    public ResponseEntity<?> deleteGroup(@PathVariable Long groupId) {
        try {
            groupService.deleteGroup(groupId);
            return ResponseEntity.ok("Group deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
