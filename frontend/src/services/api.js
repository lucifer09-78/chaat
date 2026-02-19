import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

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
};

export default api;
