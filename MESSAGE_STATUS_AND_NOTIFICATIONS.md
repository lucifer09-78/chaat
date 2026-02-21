# Message Status & Notification Indicators

## Features Implemented:

### 1. WhatsApp-Style Message Status ✅
**Single Tick (Gray)** - Message sent
**Double Tick (Gray)** - Message delivered
**Double Tick (Blue)** - Message read

### 2. Unread Message Badges ✅
- Blue circular badge with count on sidebar
- Shows number of unread messages per chat
- Clears when you open the chat
- Works for both private chats and groups

## How It Works:

### Message Status Flow:
1. **Sent** - Message created and sent to server
   - Shows single gray tick ✓
   
2. **Delivered** - Message received by recipient's device
   - Shows double gray tick ✓✓
   - Automatically marked when message arrives via WebSocket
   
3. **Read** - Recipient opened the chat and viewed message
   - Shows double blue tick ✓✓ (blue)
   - Marked when recipient opens the chat

### Unread Count Flow:
1. Message arrives → Increment unread count for that chat
2. User opens chat → Clear unread count + mark all messages as read
3. Badge shows on sidebar with count

## Backend Changes:

### 1. Message Model (`Message.java`)
```java
private LocalDateTime deliveredAt;
private LocalDateTime readAt;

@JsonProperty("status")
public String getStatus() {
    if (readAt != null) return "read";
    if (deliveredAt != null) return "delivered";
    return "sent";
}
```

### 2. MessageController (`MessageController.java`)
**New Endpoints:**
- `PUT /messages/delivered/{messageId}` - Mark message as delivered
- `PUT /messages/read/{messageId}` - Mark single message as read
- `PUT /messages/read-all?userId=X&senderId=Y` - Mark all messages as read

### 3. MessageRepository (`MessageRepository.java`)
```java
List<Message> findBySenderAndReceiverOrderByTimestampAsc(User sender, User receiver);
```

## Frontend Changes:

### 1. API Service (`api.js`)
```javascript
markAsDelivered: (messageId) =>
  api.put(`/messages/delivered/${messageId}`),

markAsRead: (messageId) =>
  api.put(`/messages/read/${messageId}`),

markAllAsRead: (userId, senderId) =>
  api.put('/messages/read-all', null, { params: { userId, senderId } }),
```

### 2. Chat Component (`Chat.jsx`)
**Added unread count tracking:**
```javascript
const [unreadCounts, setUnreadCounts] = useState({});
```

**Auto-mark as delivered:**
```javascript
// When message received
if (message.id && message.sender?.id !== user.id) {
  messageAPI.markAsDelivered(message.id);
}
```

**Auto-mark as read:**
```javascript
// When chat opened
await messageAPI.markAllAsRead(user.id, chat.id);
```

**Update unread counts:**
```javascript
// Increment on new message
setUnreadCounts(prev => ({
  ...prev,
  [peerId]: (prev[peerId] || 0) + 1
}));

// Clear when chat opened
setUnreadCounts(prev => ({ ...prev, [chat.id]: 0 }));
```

### 3. Sidebar Component (`Sidebar.jsx`)
**Display unread badges:**
```javascript
{unreadCounts[friend.id] > 0 && (
  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
    <span className="text-xs font-bold text-white">{unreadCounts[friend.id]}</span>
  </div>
)}
```

### 4. PrivateChat Component (`PrivateChat.jsx`)
**Added MessageStatusIcon component:**
```javascript
const MessageStatusIcon = ({ status }) => {
  if (status === 'read') {
    // Blue double tick
    return <svg>...</svg>;
  } else if (status === 'delivered') {
    // Gray double tick
    return <svg>...</svg>;
  } else {
    // Gray single tick (sent)
    return <svg>...</svg>;
  }
};
```

**Display status in messages:**
```javascript
<span className="text-[10px] text-slate-500 ml-2 flex items-center gap-1">
  {formatMessageTime(msg.timestamp)}
  {isOwn && <MessageStatusIcon status={msg.status || 'sent'} />}
</span>
```

## Visual Examples:

### Message Status:
```
Your message:
"Hello!"  10:30 AM ✓     (sent - gray single tick)

Your message:
"Hello!"  10:30 AM ✓✓    (delivered - gray double tick)

Your message:
"Hello!"  10:30 AM ✓✓    (read - blue double tick)
```

### Unread Badges:
```
Sidebar:
┌─────────────────────┐
│ 👤 John             │ 3  ← Blue badge with count
│ 👤 Sarah            │
│ 👥 Team Group       │ 5  ← Blue badge with count
└─────────────────────┘
```

## Testing:

### Test Message Status:
1. **Open two browsers:**
   - Browser 1: Login as "aman"
   - Browser 2: Login as "titan"

2. **In Browser 1 (aman):**
   - Send message to "titan"
   - Should see single gray tick ✓

3. **In Browser 2 (titan):**
   - Message arrives automatically
   - Browser 1 should now show double gray tick ✓✓

4. **In Browser 2 (titan):**
   - Click on "aman" chat to open it
   - Browser 1 should now show double blue tick ✓✓

### Test Unread Badges:
1. **Browser 1 (aman):**
   - Open chat with "titan"
   - Send 3 messages
   - Close chat (click away)

2. **Browser 2 (titan):**
   - Should see badge "3" next to "aman" in sidebar
   - Click on "aman" chat
   - Badge should disappear

3. **Send more messages:**
   - Browser 1 sends 2 more messages
   - Browser 2 should see badge "2"

### Test Group Unread:
1. Create a group with multiple members
2. Send messages in group
3. Other members should see unread badge on group
4. Opening group clears the badge

## How to Apply:

### Backend:
```bash
cd social-messaging-platform
docker-compose down
docker-compose up --build
```

Wait for: `Started SocialMessagingApplication`

### Frontend:
The changes are already applied. Just refresh your browser!

## Features Summary:

### ✅ Message Status Indicators:
- Single gray tick - Sent
- Double gray tick - Delivered
- Double blue tick - Read
- Only shows on your own messages
- Updates in real-time

### ✅ Unread Message Badges:
- Blue circular badge with count
- Shows on sidebar for each chat
- Increments when new message arrives
- Clears when you open the chat
- Works for private chats and groups

### ✅ Auto-marking:
- Messages auto-marked as delivered when received
- Messages auto-marked as read when chat opened
- All unread messages marked at once

## Known Limitations:

1. **Group messages:** Status indicators not shown in group chats (WhatsApp also doesn't show read receipts in groups)
2. **Offline users:** Messages marked as delivered only when user is online
3. **Multiple devices:** Status syncs per device, not across devices

## Future Enhancements:

- [ ] Sound notification when message arrives
- [ ] Typing indicators ("User is typing...")
- [ ] Last message preview in sidebar
- [ ] Message reactions (emoji reactions)
- [ ] Voice messages
- [ ] File attachments

## Summary:

Your messaging app now has professional WhatsApp-style features:
- ✅ Message status indicators (single/double tick, blue tick)
- ✅ Unread message badges in sidebar
- ✅ Auto-marking messages as delivered/read
- ✅ Real-time status updates

**Just restart the backend and refresh your browser to see it in action!**
