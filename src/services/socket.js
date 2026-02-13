import { io } from 'socket.io-client';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

let socket = null;

export const connectSocket = (userId) => {
  if (socket?.connected) {
    return socket;
  }

  socket = io(API_BASE_URL, {
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
    if (userId) {
      socket.emit('join', userId);
    }
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;

export const onMatch = (callback) => {
  if (socket) {
    socket.on('match', callback);
  }
};

export const offMatch = (callback) => {
  if (socket) {
    socket.off('match', callback);
  }
};
