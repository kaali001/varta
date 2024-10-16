<h1 align="center">🗣️ Varta  </h1>

<p align="center"> <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License MIT"/> <img src="https://img.shields.io/badge/Socket.io-v4.5.4-%235865F2" alt="Socket.io Badge"/> <img src="https://img.shields.io/badge/WebRTC-Supported-brightgreen" alt="WebRTC Supported"/> <img src="https://img.shields.io/badge/Node.js-v18.0.0-%23339933" alt="Node.js Badge"/> <img src="https://img.shields.io/badge/React-v18.2.0-%2361DAFB" alt="React Badge"/> </p>


Varta is a real-time video chat platform that connects users randomly to have face-to-face conversations through WebRTC. It leverages Socket.io for signaling and enables smooth peer-to-peer video streaming between users. Whether you want to chat with strangers or friends, Varta offers an intuitive and seamless video calling experience.




# 🚀 Features

  - Random Peer Matching: Users are connected randomly to available peers in the lobby.
   - WebRTC-based Video Streaming: Real-time peer-to-peer video calls with minimal latency.
  - Lobby System with Loader Animation: Users wait for matching with a circular spinning loader.
  - Local Video Preview: Self-video preview in a small floating window for monitoring appearance.
  - Automatic Room Creation: Dynamically creates rooms when two users connect.
  - Responsive UI: Clean and modern design built with React and Tailwind CSS.
  - Cross-Browser Support: Works well across major browsers with WebRTC support.


# 🛠️ Technologies Used

| Frontend | Backend | Other Dependencies |
| ------ | ------ | ------- |
| React | Node.js	| Socket.io |
| TypeScript |	Express.js | WebRTC API |
| Tailwind CSS |


# ⚙️ Installation Guide

Follow these steps to run the application on your local machine.

## Prerequisites
Make sure you have the following installed:

  - Node.js (v18+)
  - npm (or yarn)


 ### 1. Step 1: Clone the Repository
 
  ```
     git clone https://github.com/your-username/varta.git 
     cd varta
 ```



### 2. Step 2: Install Dependencies

  - #### For the backend
  ```
   cd server
   npm install
  ```
    - (option)create a config.env file and add below details, as of now both predefined in `index.js`.
    ```
    PORT
    FRONTEND_URL

    ```
  - #### For the frontend
  ```
   cd ../client
   npm install

  ```

### 3. Step 3: Run the Application

 Open two terminal windows: one for the backend and one for the frontend.

  - #### Backend (Server)
   ```
    cd server
    node src/index.js

   ```
  - #### Frontend (Client)
   ```
     cd client
     npm start
   ```


# 🌐 Project Structure

 
  ```

    varta/
├── client/                 # Frontend code (React)
│   ├── src/
│   │   ├── pages/          # React pages (ChatPage, etc.)
│   │   └── components/     # UI components (Room)
│   └── public/             # Public assets
|
├── server/                 # Backend code (Node.js)
│   ├── Managers/
│   │   ├── RoomManager.js        
│   │   └── UserManager.js       
|   └── index.js            # Server entry point
└── README.md               # Documentation



  ```


# 🎥 Demo

## 📸 Screenshots:
![image](https://github.com/user-attachments/assets/aa5b2c41-819c-4e50-bf5b-5b8fc414c025)




# ❓ How It Works

  - When a user joins, they enter the lobby and wait for another user to connect.
  - Once two users connect, the server creates a room and initiates the offer-answer exchange using WebRTC.
  - The two peers exchange ICE candidates to establish a connection.
  - Users can see both self-video preview and peer video on the interface.


# 🧑‍💻 Contributing

We welcome contributions! Please follow the steps below to contribute:

  - Fork the repository.
  - Clone the repository.
  - Create a feature branch `git checkout -b feature-name`.
  - Commit your changes `git commit -m "Add new feature"`.
  - Push to your branch `git push origin feature-name`.
  - Open a Pull Request on GitHub.





    
