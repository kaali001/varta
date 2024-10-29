// src/managers/UserManager.js
import { Socket } from 'socket.io';
import { RoomManager } from './RoomManager.js'; // Ensure the .js extension is included

// Define the user structure using plain JavaScript
export class UserManager {
  constructor() {
    this.users = [];
    this.queue = [];
    this.roomManager = new RoomManager();
  }

  addUser(name, socket) {
    this.users.push({
      name,
      socket,
    });
    this.queue.push(socket.id);
    socket.emit('lobby');
    this.clearQueue();
    this.initHandlers(socket);
  }

  removeUser(socketId) {
    const user = this.users.find((x) => x.socket.id === socketId);
    this.users = this.users.filter((x) => x.socket.id !== socketId);
    this.queue = this.queue.filter((x) => x !== socketId);
  }

  clearQueue() {
    if (this.queue.length < 2) {
      return;
    }

    const id1 = this.queue.pop();
    const id2 = this.queue.pop();
    const user1 = this.users.find((x) => x.socket.id === id1);
    const user2 = this.users.find((x) => x.socket.id === id2);

    if (!user1 || !user2) {
      return;
    }

    this.roomManager.createRoom(user1, user2);
    this.clearQueue();
  }

  initHandlers(socket) {
    socket.on('offer', ({ sdp, roomId }) => {
      this.roomManager.onOffer(roomId, sdp, socket.id);
    });

    socket.on('answer', ({ sdp, roomId }) => {
      this.roomManager.onAnswer(roomId, sdp, socket.id);
    });

    socket.on('add-ice-candidate', ({ candidate, roomId, type }) => {
      this.roomManager.onIceCandidates(roomId, socket.id, candidate, type);
    });
  }
  getUserCount() {
    return this.users.length;
  }
}
