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
    const socket = new SockJS('http://localhost:8080/ws');

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
    }
  }

  sendPrivateMessage(senderUsername, receiverUsername, content) {
    if (this.client && this.connected) {
      console.log('Sending private message:', { senderUsername, receiverUsername, content });
      this.client.publish({
        destination: '/app/private.send',
        body: JSON.stringify({
          sender: senderUsername,
          receiver: receiverUsername,
          content,
        }),
      });
    } else {
      console.error('Cannot send message: WebSocket not connected');
    }
  }

  sendGroupMessage(senderUsername, groupId, content) {
    if (this.client && this.connected) {
      this.client.publish({
        destination: '/app/group.send',
        body: JSON.stringify({
          sender: senderUsername,
          groupId,
          content,
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
