import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';  // set VITE_API_URL on Vercel to point to Render backend

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User APIs
export const userAPI = {
  register: (username, password) =>
    api.post('/users/register', { username, password }),

  login: (username, password) =>
    api.post('/users/login', { username, password }),

  searchUsers: (username) =>
    api.get('/users/search', { params: { username } }),

  updateUser: (userId, username, password) =>
    api.put(`/users/update/${userId}`, { username, password }),

  deleteUser: (userId) =>
    api.delete(`/users/delete/${userId}`),

  updatePresence: (userId) =>
    api.post(`/users/heartbeat/${userId}`),
};

// Friend Request APIs
export const friendAPI = {
  sendRequest: (senderId, receiverId) =>
    api.post(`/friends/request/${senderId}/${receiverId}`),

  acceptRequest: (requestId) =>
    api.put(`/friends/respond/${requestId}`, null, { params: { accept: true } }),

  rejectRequest: (requestId) =>
    api.put(`/friends/respond/${requestId}`, null, { params: { accept: false } }),

  getPendingRequests: (userId) =>
    api.get(`/friends/pending/${userId}`),

  getFriends: (userId) =>
    api.get(`/friends/list/${userId}`),
};

// Group APIs
export const groupAPI = {
  createGroup: (name, createdBy, memberIds) =>
    api.post('/groups/create', { name, createdBy }).then(async (response) => {
      // Add members to the group
      const group = response.data;
      for (const memberId of memberIds) {
        await api.post('/groups/add-member', { groupId: group.id, userId: memberId });
      }
      return response;
    }),

  addMember: (groupId, userId) =>
    api.post('/groups/add-member', { groupId, userId }),

  getUserGroups: (userId) =>
    api.get(`/groups/list/${userId}`),

  updateGroup: (groupId, name) =>
    api.put(`/groups/update/${groupId}`, { name }),

  leaveGroup: (groupId, userId) =>
    api.delete(`/groups/leave/${groupId}/${userId}`),

  deleteGroup: (groupId) =>
    api.delete(`/groups/delete/${groupId}`),
};

// Message APIs
export const messageAPI = {
  getHistory: (userId, friendId) =>
    api.get('/messages/history', { params: { userId, friendId } }),

  getGroupHistory: (groupId) =>
    api.get(`/messages/group/${groupId}`),

  deletePrivateChat: (userId, friendId) =>
    api.delete('/messages/delete/private', { params: { userId, friendId } }),

  markAsDelivered: (messageId) =>
    api.put(`/messages/delivered/${messageId}`),

  markAsRead: (messageId) =>
    api.put(`/messages/read/${messageId}`),

  markAllAsRead: (userId, senderId) =>
    api.put('/messages/read-all', null, { params: { userId, senderId } }),
};

export default api;
