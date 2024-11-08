
let GLOBAL_ROOM_ID = 1;

export class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  createRoom(user1, user2) {
    const roomId = this.generate().toString();
    console.log("RoomId created:", roomId);

    this.rooms.set(roomId, {
      user1,
      user2,
    });

    console.log(
      `Room ${roomId} created for users: ${user1.name} & ${user2.name}`
    );

    user1.socket.emit("send-offer", { roomId });
    user2.socket.emit("send-offer", { roomId });
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

  generate() {
    return GLOBAL_ROOM_ID++;
  }

  removeRoom(roomId) {
    if (this.rooms.has(roomId)) {
      this.rooms.delete(roomId);
      console.log(`Room ${roomId} removed.`);
    }
  }
}
