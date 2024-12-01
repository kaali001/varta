import { RoomManager } from "./RoomManager.js";
import { fetchIpDetails } from '../utils/IpService.js';
import { User } from '../models/UserData.js';

// Defining the user structure
export class UserManager {
  constructor() {
    this.users = [];
    this.queue = [];
    this.roomManager = new RoomManager();
  }

  async addUser(name, socket) {
     // Fetching  IP details
    const forwarded = socket.handshake.headers['x-forwarded-for'];
    const clientIp = forwarded ? forwarded.split(/, /)[0] : socket.handshake.address;
    const ipDetails = await fetchIpDetails(clientIp);
    const country = ipDetails?.country || 'Unknown';

    // Saving in to database
    const user_data = new User({
      socketId: socket.id,
      ip:clientIp,
      country,
      otherDetails: ipDetails,
    });
    await user_data.save();

    const user = { name, socket, country };
    this.users.push(user);
    this.queue.push(user);

    console.log(`User added: ${name}, ID: ${socket.id}, Country: ${country}`);

    socket.emit("lobby", { country });
    this.tryToPairUsers();
    this.initHandlers(socket);
  }

  removeUser(socketId) {
    const user = this.users.find((u) => u.socket.id === socketId);
    if (user) {
      console.log(`User removed: ${user.name}`);

      this.users = this.users.filter((u) => u.socket.id !== socketId);
      this.queue = this.queue.filter((u) => u.socket.id !== socketId);
    }
  }

  tryToPairUsers() {
    // Attempt to pair users if at least two are available
    while (this.queue.length >= 2) {
      const user1 = this.queue.pop();
      const user2 = this.queue.pop();
      if (!user1 || !user2) {
        return;
      }
      this.roomManager.createRoom(user1, user2);
    }
  }

  initHandlers(socket) {
    socket.on("offer", ({ sdp, roomId }) => {
      console.log("check1- RoomId:", roomId);
      this.roomManager.onOffer(roomId, sdp, socket.id);
    });

    socket.on("answer", ({ sdp, roomId }) => {
      console.log("check2- RoomId:", roomId);
      this.roomManager.onAnswer(roomId, sdp, socket.id);
    });

    socket.on("add-ice-candidate", ({ candidate, roomId, type }) => {
      console.log("check3- RoomId:", roomId);
      this.roomManager.onIceCandidates(roomId, socket.id, candidate, type);
    });
  }

  getUserCount() {
    return this.users.length; //  retrieve the number of connected users
  }
}
