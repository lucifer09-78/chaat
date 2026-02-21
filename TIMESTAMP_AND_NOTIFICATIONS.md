# Timestamp Fix & Notification System

## Features Implemented:

### 1. Fixed Message Timestamps ✅
Messages now show proper timestamps based on when they were sent:

**Today's messages:**
- "10:30 AM" (just time)

**Yesterday's messages:**
- "Yesterday 10:30 AM"

**This week's messages:**
- "Mon 10:30 AM"
- "Tue 3:45 PM"

**Older messages:**
- "Jan 15 10:30 AM"

### 2. Browser Notifications ✅
Desktop notifications when you receive a message:

**Features:**
- Shows sender name
- Shows message preview (first 50 characters)
- Only shows when window is not focused or chat is not active
- Click notification to focus window
- Auto-closes after 5 seconds
- Requests permission on first load

## Changes Made:

### 1. PrivateChat.jsx
**Added `formatMessageTime()` function:**
```javascript
const formatMessageTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffDays = Math.floor((now - date) / 86400000);
  
  // If today, show time only
  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  // If yesterday
  if (diffDays === 1) {
    return `Yesterday ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  // If within a week, show day name
  if (diffDays < 7) {
    return `${date.toLocaleDateString([], { weekday: 'short' })} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  // Otherwise show full date
  return date.toLocaleString([], { 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};
```

**Updated timestamp display:**
```javascript
<span className="text-[10px] text-slate-500 ml-2">
  {formatMessageTime(msg.timestamp)}
</span>
```

### 2. GroupChat.jsx
**Added same `formatMessageTime()` function**

**Updated timestamp display:**
```javascript
<span className="text-[11px] text-slate-500 font-medium pl-1 opacity-0 group-hover:opacity-100 transition-opacity">
  {formatMessageTime(msg.timestamp)}
</span>
```

### 3. Chat.jsx
**Added notification permission request:**
```javascript
const [notificationPermission, setNotificationPermission] = useState(Notification.permission);

useEffect(() => {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().then(permission => {
      setNotificationPermission(permission);
    });
  }
}, []);
```

**Added notification function:**
```javascript
const showNotification = (senderName, content, type) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    const notification = new Notification(`New message from ${senderName}`, {
      body: content.length > 50 ? content.substring(0, 50) + '...' : content,
      icon: '/vite.svg',
      badge: '/vite.svg',
      tag: `message-${senderName}`,
      requireInteraction: false,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // Auto close after 5 seconds
    setTimeout(() => notification.close(), 5000);
  }
};
```

**Updated message handler to trigger notifications:**
```javascript
// Show notification if message is from someone else and window is not focused
if (message.sender?.id !== user.id && (!document.hasFocus() || activeChat?.id !== (type === 'private' ? message.sender?.id : message.groupId))) {
  showNotification(senderName, message.content, type);
}
```

## How It Works:

### Timestamps:
1. When a message is displayed, `formatMessageTime()` is called
2. Function calculates time difference from now
3. Returns formatted string based on age:
   - Same day → Time only
   - Yesterday → "Yesterday" + time
   - This week → Day name + time
   - Older → Date + time

### Notifications:
1. On app load, requests notification permission
2. When message received, checks:
   - Is it from someone else? (not your own message)
   - Is window not focused OR is different chat active?
3. If yes, shows browser notification
4. Notification shows:
   - Title: "New message from [sender]"
   - Body: Message content (truncated to 50 chars)
   - Icon: App icon
5. Click notification → Focus window
6. Auto-closes after 5 seconds

## Testing:

### Test Timestamps:
1. Send a message now → Should show time only (e.g., "10:30 AM")
2. Wait for backend to have old messages → Should show proper format
3. Check messages from different days

### Test Notifications:
1. **First time:** Browser will ask for notification permission → Click "Allow"
2. **Open two browsers:**
   - Browser 1: Login as "aman"
   - Browser 2: Login as "titan"
3. **In Browser 2:** Send message to "aman"
4. **In Browser 1:** 
   - If window is not focused → Should see desktop notification
   - If window is focused but different chat open → Should see notification
   - If window is focused and chat is open → No notification (you're already looking at it)
5. **Click notification:** Should focus the window

### Test Notification Scenarios:

**Scenario 1: Window Minimized**
- Minimize browser
- Have friend send message
- ✅ Should see desktop notification

**Scenario 2: Different Tab**
- Switch to different tab
- Have friend send message
- ✅ Should see desktop notification

**Scenario 3: Different Chat Open**
- Open chat with friend A
- Friend B sends message
- ✅ Should see notification for friend B

**Scenario 4: Same Chat Open**
- Open chat with friend A
- Friend A sends message
- ❌ No notification (you're already in the chat)

## Browser Compatibility:

Notifications work in:
- ✅ Chrome/Edge
- ✅ Firefox
- ✅ Safari (macOS)
- ❌ Mobile browsers (limited support)

## Customization:

### Change notification duration:
```javascript
// Currently: 5 seconds
setTimeout(() => notification.close(), 5000);

// Change to 10 seconds:
setTimeout(() => notification.close(), 10000);
```

### Change notification icon:
```javascript
icon: '/your-icon.png',
badge: '/your-badge.png',
```

### Change message preview length:
```javascript
// Currently: 50 characters
body: content.length > 50 ? content.substring(0, 50) + '...' : content,

// Change to 100 characters:
body: content.length > 100 ? content.substring(0, 100) + '...' : content,
```

## Files Changed:

1. ✅ `frontend/src/components/PrivateChat.jsx` - Added formatMessageTime()
2. ✅ `frontend/src/components/GroupChat.jsx` - Added formatMessageTime()
3. ✅ `frontend/src/pages/Chat.jsx` - Added notification system

## No Backend Changes Needed!

All changes are frontend-only. Just refresh your browser to see the updates!

## Summary:

- ✅ Message timestamps now show proper format (Today, Yesterday, Day name, Full date)
- ✅ Desktop notifications when you receive messages
- ✅ Notifications only show when needed (window not focused or different chat)
- ✅ Click notification to focus window
- ✅ Auto-close after 5 seconds
- ✅ Works in all major desktop browsers

**Just refresh your browser and test it out!**
