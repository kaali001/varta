// src/index.js
import http from 'http';
import express from 'express';
import cors from 'cors';
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
    methods: ["GET", "POST","HEAD","PUT","PATCH","DELETE"]
  },
});

const corsOptions = {
  origin: frontend_url, 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
};
// Use CORS middleware
app.use(cors(corsOptions));

const userManager = new UserManager();

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  userManager.addUser("randomName", socket);

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    userManager.removeUser(socket.id);
  });
});


app.get("/", (req, res) => 
  {  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Server Status</title>
        <style>
          /* Embedded CSS styles */
          body {
            margin: 0;
            padding: 0;
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #74b9ff, #a29bfe);
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .container {
            text-align: center;
            background-color: rgba(255, 255, 255, 0.85);
            padding: 2rem;
            border-radius: 15px;
            box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.1);
          }

          h1 {
            font-size: 3rem;
            color: #0984e3;
            margin-bottom: 0.5rem;
          }

          .message {
            font-size: 1.5rem;
            color: #636e72;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🌐 Server Status</h1>
          <p class="message">Server is running successfully! 🚀</p>
        </div>
      </body>
    </html>
  `);
 });

server.listen(port, function () {
  console.log(`Listening to port at : ${port}`);
});
