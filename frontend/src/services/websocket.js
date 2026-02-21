import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

class WebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.username = null;
  }

  connect(username, onMessageReceived) {
    if (this.connected) {
      console.log('WebSocket already connected');
      return;
    }

    this.username = username;
    const WS_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    const socket = new SockJS(`${WS_URL}/ws`);

    this.client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        login: username,
        passcode: username,
      },
      debug: (str) => {
        console.log('STOMP: ' + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = () => {
      console.log('WebSocket Connected');
      this.connected = true;

      // Subscribe to private messages
      this.client.subscribe(`/user/queue/messages`, (message) => {
        const receivedMessage = JSON.parse(message.body);
        console.log('Received private message:', receivedMessage);
        onMessageReceived(receivedMessage, 'private');
      });

      // Subscribe to typing notifications
      this.client.subscribe(`/user/queue/typing`, (message) => {
        const event = JSON.parse(message.body);
        if (this.onTypingReceived) this.onTypingReceived(event);
      });
    };

    this.client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
      this.connected = false;
    };

    this.client.onWebSocketClose = () => {
      console.log('WebSocket connection closed');
      this.connected = false;
    };

    this.client.activate();
  }

  subscribeToGroup(groupId, onMessageReceived) {
    if (this.client && this.connected) {
      this.client.subscribe(`/topic/group/${groupId}`, (message) => {
        const receivedMessage = JSON.parse(message.body);
        onMessageReceived(receivedMessage, 'group');
      });
      // Group typing
      this.client.subscribe(`/topic/typing/group/${groupId}`, (message) => {
        const event = JSON.parse(message.body);
        if (this.onTypingReceived) this.onTypingReceived(event);
      });
    }
  }

  setTypingHandler(handler) {
    this.onTypingReceived = handler;
  }

  sendTyping(senderUsername, receiverUsername, groupId, isTyping) {
    if (this.client && this.connected) {
      this.client.publish({
        destination: '/app/typing',
        body: JSON.stringify({
          sender: senderUsername,
          receiver: receiverUsername || '',
          groupId: groupId ? String(groupId) : '',
          typing: String(isTyping),
        }),
      });
    }
  }

  sendPrivateMessage(senderUsername, receiverUsername, content, replyTo) {
    if (this.client && this.connected) {
      this.client.publish({
        destination: '/app/private.send',
        body: JSON.stringify({
          sender: senderUsername,
          receiver: receiverUsername,
          content,
          replyToId: replyTo?.id ? String(replyTo.id) : '',
          replyPreview: replyTo?.content ? replyTo.content.substring(0, 80) : '',
          replySenderName: replyTo?.senderName || '',
        }),
      });
    } else {
      console.error('Cannot send message: WebSocket not connected');
    }
  }

  sendGroupMessage(senderUsername, groupId, content, replyTo) {
    if (this.client && this.connected) {
      this.client.publish({
        destination: '/app/group.send',
        body: JSON.stringify({
          sender: senderUsername,
          groupId,
          content,
          replyToId: replyTo?.id ? String(replyTo.id) : '',
          replyPreview: replyTo?.content ? replyTo.content.substring(0, 80) : '',
          replySenderName: replyTo?.senderName || '',
        }),
      });
    }
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.connected = false;
    }
  }
}

export default new WebSocketService();
