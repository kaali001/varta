// src/index.js
import http from 'http';
import express from 'express';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { UserManager } from './managers/UserManager.js'; 


dotenv.config({ path: './config.env' });

const port = process.env.PORT || 5000;
const frontend_url = process.env.FRONTEND_URL || 'http://localhost:3000';

const app = express();
const server = http.createServer(app); 

const io = new Server(server, {
  cors: {
    origin: frontend_url,
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

server.listen(port, function () {
  console.log(`Listening to port at : ${port}`);
});
