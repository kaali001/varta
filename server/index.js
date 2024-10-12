// src/index.js
import http from 'http';
import express from 'express';
import { Server } from 'socket.io';
import { UserManager } from './managers/UserManager.js'; // Correct spelling and add .js

const app = express();
const server = http.createServer(app); // Use app here

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const userManager = new UserManager();

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  userManager.addUser("randomName", socket);

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    userManager.removeUser(socket.id);
  });
});

server.listen(5000, () => {
  console.log('Listening on *:5000');
});
