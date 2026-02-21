# Online/Offline Status System

## Implementation Complete!

I've implemented a real-time online/offline status system similar to Telegram.

## How It Works:

### Backend:
1. **User Model** - Added `lastSeen` field to track when user was last active
2. **Login** - Updates `lastSeen` timestamp when user logs in
3. **Heartbeat** - New endpoint `/users/heartbeat/{userId}` to update presence
4. **isOnline()** - Method that returns true if user was active within last 5 minutes

### Frontend:
1. **Heartbeat Timer** - Sends presence update every 2 minutes while user is active
2. **Status Display** - Shows green dot for online, gray dot for offline
3. **Last Seen** - Shows "Last seen Xm/h/d ago" for offline users
4. **Real-time Updates** - Status updates when friends list refreshes

## Features:

### In Sidebar (Friends List):
- ✅ Green pulsing dot = Online (active within 5 minutes)
- ✅ Gray dot = Offline
- ✅ "Online" text for online users
- ✅ "Last seen Xm ago" for offline users
- ✅ Formatted timestamps (5m ago, 2h ago, 3d ago, etc.)

### In Chat Header:
- ✅ Green pulsing dot = Online
- ✅ Gray dot = Offline
- ✅ "Online" status with animated indicator
- ✅ "Last seen" timestamp for offline users

## Backend Changes:

### 1. User Model (`User.java`)
```java
private LocalDateTime lastSeen;

@JsonProperty("isOnline")
public boolean isOnline() {
    if (lastSeen == null) return false;
    return lastSeen.isAfter(LocalDateTime.now().minusMinutes(5));
}
```

### 2. UserService (`UserService.java`)
```java
public User loginUser(String username, String password) {
    // ... existing code ...
    user.setLastSeen(LocalDateTime.now());
    userRepository.save(user);
    return user;
}

public void updateLastSeen(Long userId) {
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
    user.setLastSeen(LocalDateTime.now());
    userRepository.save(user);
}
```

### 3. UserController (`UserController.java`)
```java
@PostMapping("/heartbeat/{userId}")
public ResponseEntity<?> updatePresence(@PathVariable Long userId) {
    try {
        userService.updateLastSeen(userId);
        return ResponseEntity.ok("Presence updated");
    } catch (RuntimeException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
```

## Frontend Changes:

### 1. API Service (`api.js`)
```javascript
updatePresence: (userId) =>
  api.post(`/users/heartbeat/${userId}`),
```

### 2. Chat Component (`Chat.jsx`)
```javascript
// Send heartbeat every 2 minutes
const heartbeatInterval = setInterval(() => {
  userAPI.updatePresence(user.id).catch(err => {
    console.error('Failed to update presence:', err);
  });
}, 120000);
```

### 3. Sidebar Component (`Sidebar.jsx`)
```javascript
{friend.isOnline ? (
  <div className="... bg-green-500 ..."></div>
) : (
  <div className="... bg-slate-500 ..."></div>
)}

<p className="...">
  {friend.isOnline ? 'Online' : 
   friend.lastSeen ? `Last seen ${formatLastSeen(friend.lastSeen)}` : 
   'Offline'}
</p>
```

### 4. PrivateChat Component (`PrivateChat.jsx`)
```javascript
{friend.isOnline ? (
  <>
    <span className="... bg-green-500 animate-pulse"></span>
    <span className="...">Online</span>
  </>
) : (
  <span className="...">
    {friend.lastSeen ? `Last seen ${formatLastSeen(friend.lastSeen)}` : 'Offline'}
  </span>
)}
```

## How to Apply:

### Backend:
```bash
cd social-messaging-platform
docker-compose down
docker-compose up --build
```

### Frontend:
The changes are already applied. Just refresh your browser!

## Testing:

### Test 1: Online Status
1. Login as user "aman"
2. Check sidebar - should show green dot and "Online"
3. Open chat with a friend - header should show "Online"

### Test 2: Offline Status
1. Login as user "aman" in one browser
2. Login as user "titan" in another browser (incognito)
3. Close "titan" browser
4. Wait 6 minutes
5. In "aman" browser, refresh friends list
6. "titan" should show gray dot and "Last seen Xm ago"

### Test 3: Heartbeat
1. Login and stay active
2. Check browser console - should see heartbeat requests every 2 minutes
3. Check backend logs - should see presence updates

### Test 4: Last Seen Format
- Just logged out: "Last seen just now"
- 5 minutes ago: "Last seen 5m ago"
- 2 hours ago: "Last seen 2h ago"
- 3 days ago: "Last seen 3d ago"
- 1 week ago: Shows date (e.g., "1/15/2024")

## Configuration:

### Online Threshold (Backend):
Change in `User.java`:
```java
// Currently: 5 minutes
return lastSeen.isAfter(LocalDateTime.now().minusMinutes(5));

// To change to 3 minutes:
return lastSeen.isAfter(LocalDateTime.now().minusMinutes(3));
```

### Heartbeat Interval (Frontend):
Change in `Chat.jsx`:
```javascript
// Currently: 2 minutes (120000 ms)
setInterval(() => { ... }, 120000);

// To change to 1 minute:
setInterval(() => { ... }, 60000);
```

## Summary:

The online/offline status system is now fully functional:
- ✅ Real-time presence tracking
- ✅ Heartbeat system to keep status updated
- ✅ Visual indicators (green/gray dots)
- ✅ "Last seen" timestamps
- ✅ Formatted time display
- ✅ Works in sidebar and chat header

Users are considered online if they were active within the last 5 minutes. The frontend sends a heartbeat every 2 minutes to keep the status updated.
