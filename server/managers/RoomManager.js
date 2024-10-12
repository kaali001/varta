// src/managers/RoomManager.js
import { UserManager } from './UserManager.js'; // Make sure the path and .js extension are correct

let GLOBAL_ROOM_ID = 1;

export class RoomManager {
  constructor() {
    this.rooms = new Map(); // No need to specify types, JavaScript allows dynamic typing
  }

  createRoom(user1, user2) {
    const roomId = this.generate().toString();
    this.rooms.set(roomId, {
      user1,
      user2,
    });

    // Notify both users to send an offer to each other
    user1.socket.emit('send-offer', {
      roomId,
    });

    user2.socket.emit('send-offer', {
      roomId,
    });
  }

  onOffer(roomId, sdp, senderSocketId) {
    const room = this.rooms.get(roomId);
    if (!room) {
      console.error(`Room not found: ${roomId}`);
      return;
    }

    // Find the receiving user (the other user in the room)
    const receivingUser = room.user1.socket.id === senderSocketId ? room.user2 : room.user1;
    console.log(`Offer sent from ${senderSocketId} to ${receivingUser.socket.id}`);

    // Emit the offer to the receiving user
    receivingUser?.socket.emit('offer', {
      sdp,
      roomId,
    });
  }

  onAnswer(roomId, sdp, senderSocketId) {
    const room = this.rooms.get(roomId);
    if (!room) {
      console.error(`Room not found: ${roomId}`);
      return;
    }

    // Find the receiving user (the other user in the room)
    const receivingUser = room.user1.socket.id === senderSocketId ? room.user2 : room.user1;
    console.log(`Answer sent from ${senderSocketId} to ${receivingUser.socket.id}`);
    // Emit the answer to the receiving user
    receivingUser?.socket.emit('answer', {
      sdp,
      roomId,
    });
  }

  onIceCandidates(roomId, senderSocketId, candidate, type) {
    const room = this.rooms.get(roomId);
    if (!room) {
      console.error(`Room not found: ${roomId}`);
      return;
    }

    // Find the receiving user (the other user in the room)
    const receivingUser = room.user1.socket.id === senderSocketId ? room.user2 : room.user1;
    console.log(`ICE candidate sent from ${senderSocketId} to ${receivingUser.socket.id}`);
    
    // Emit the ICE candidate to the receiving user
    receivingUser.socket.emit('add-ice-candidate', {
      candidate,
      type,
    });
  }

  generate() {
    return GLOBAL_ROOM_ID++; // Increment the room ID for each new room
  }
}
