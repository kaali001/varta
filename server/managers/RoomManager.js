let GLOBAL_ROOM_ID = 1;

export class RoomManager {
  constructor(userManager) {
    this.rooms = new Map();
    this.userManager = userManager; // Store UserManager instance
  }

  createRoom(user1, user2) {
    const roomId = this.generate().toString();
    console.log("RoomId created:", roomId);

    this.rooms.set(roomId, {
      user1,
      user2,
    });

    console.log(
      `Room ${roomId} created for User1(${user1.name}, Country: ${user1.country}), User2(${user2.name}, Country: ${user2.country})`
    );
    
    user1.socket.emit("send-offer", { roomId, remoteCountry: user2.country, name: user2.name });
    user2.socket.emit("send-offer", { roomId, remoteCountry: user1.country, name: user1.name });
  }

  onOffer(roomId, sdp, senderSocketId) {
    const room = this.rooms.get(roomId);
    if (!room) {
      console.error(`Room not found in onOffer: ${roomId}`);
      return;
    }

    // Find the receiving user (the other user in the room)
    const receivingUser =
      room.user1.socket.id === senderSocketId ? room.user2 : room.user1;
    // Emit the offer to the receiving user
    receivingUser?.socket.emit("offer", { sdp, roomId });
  }

  onAnswer(roomId, sdp, senderSocketId) {
    const room = this.rooms.get(roomId);
    if (!room) {
      console.error(`Room not found in onAnswer: ${roomId}`);
      return;
    }

    const receivingUser =
      room.user1.socket.id === senderSocketId ? room.user2 : room.user1;
    receivingUser?.socket.emit("answer", { sdp, roomId });
  }

  onIceCandidates(roomId, senderSocketId, candidate, type) {
    const room = this.rooms.get(roomId);
    if (!room) {
      console.error(`Room not found in onIceCandidates: ${roomId}`);
      return;
    }

    const receivingUser =
      room.user1.socket.id === senderSocketId ? room.user2 : room.user1;
    receivingUser.socket.emit("add-ice-candidate", { candidate, type });
  }

  removeRoom(roomId) {
    const room = this.rooms.get(roomId);
    if (room) {
      // Notify both users that the room has been removed
      room.user1.socket.emit("room-removed");
      room.user2.socket.emit("room-removed");
      const User1 = room.user1;
      const User2 = room.user2;

      // Remove the room
      this.rooms.delete(roomId);
      console.log(`Room ${roomId} removed.`);

      // Wait 2 seconds before re-queueing users
      setTimeout(() => {
        // Verify if users are still connected before re-queuing
        const isUser1Connected = this.userManager.users.some(
          (u) => u.socket.id === User1.socket.id
        );
        const isUser2Connected = this.userManager.users.some(
          (u) => u.socket.id === User2.socket.id
        );

        if (isUser1Connected) this.userManager.reQueueUser(User1);
        if (isUser2Connected) this.userManager.reQueueUser(User2);
      }, 2000);
    }
  }

  removeUserFromRooms(socketId) {
    for (const [roomId, room] of this.rooms.entries()) {
      if (
        room.user1.socket.id === socketId ||
        room.user2.socket.id === socketId
      ) {
        this.removeRoom(roomId);
        break;
      }
    }
  }

  getRemainingUser(socketId) {
    for (const [roomId, room] of this.rooms.entries()) {
      if (room.user1.socket.id === socketId || room.user2.socket.id === socketId) {
        const remainingUser = room.user1.socket.id === socketId ? room.user2 : room.user1;//get user present in room.
        
        // Notify remaining user first
        remainingUser.socket.emit("room-removed");
        
        // Delay before cleaning up and returning
        return new Promise(resolve => {
          setTimeout(() => {
            // Cleanup after 2 seconds
            this.rooms.delete(roomId);
            console.log(`Room ${roomId} cleaned up for remaining user`);
            
            // Verify if user is still connected
            const isConnected = this.userManager.users.some(
              u => u.socket.id === remainingUser.socket.id
            );
            
            resolve(isConnected ? remainingUser : null);
          }, 2000);
        });
      }
    }
    return Promise.resolve(null);
  }

  generate() {
    return GLOBAL_ROOM_ID++;
  }
}
