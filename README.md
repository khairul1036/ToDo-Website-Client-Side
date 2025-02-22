# Task Management Application

<div align="center">
  <img height="full" src="https://api.empowernextgenbd.com/uploads/home.png"  />
</div>

## 📌 Description
A Task Management Application that allows users to add, edit, delete, and reorder tasks using a drag-and-drop interface. Tasks are categorized into three sections: **To-Do, In Progress, and Done**. Users can sign in using **Firebase Authentication (Google Sign-in)**, and all task updates are saved instantly in **MongoDB** via an **Express.js** backend with **real-time synchronization**.

## 🔗 Live Demo
Live Link: [Click Here](https://to-do-30551.web.app/)

## 🛠 Features
- 🔐 **Authentication**: Firebase Authentication with Google Sign-in.
- ✅ **Task Management**:
  - Add, edit, delete, and reorder tasks.
  - Drag-and-drop tasks between categories.
  - Tasks remain persistent in the database.
- 💾 **Database & Persistence**:
  - MongoDB with real-time updates via **WebSockets**.
- 🎨 **Modern UI**:
  - **React + Vite** frontend.
  - **react-beautiful-dnd** for drag-and-drop.
  - Fully **responsive** design.
- 🌙 **More Features**
  - Dark mode toggle.
  - Task due dates with color indicators.
  - Activity log tracking task updates.

## 🏗️ Technologies Used
- **Frontend**: React.js (Vite), Tailwind CSS, react-beautiful-dnd
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: Firebase Authentication (Google Sign-in)
- **Real-time updates**: WebSockets
- **Database**: MongoDB

## 📦 Dependencies

### 🔹 Frontend:
```sh
- @dnd-kit/accessibility: ^3.1.1
- @dnd-kit/core: ^6.3.1
- @dnd-kit/sortable: ^10.0.0
- @tailwindcss/vite: ^4.0.7
- axios: ^1.7.9
- date-fns: ^4.1.0
- firebase: ^11.3.1
- framer-motion: ^12.4.7
- localforage: ^1.10.0
- match-sorter: ^8.0.0
- moment: ^2.30.1
- react: ^18.3.1
- react-beautiful-dnd: ^13.1.1
- react-datetime: ^3.3.1
- react-dom: ^18.3.1
- react-icons: ^5.5.0
- react-router-dom: ^7.2.0
- react-toastify: ^11.0.3
- socket.io-client: ^4.8.1
- sort-by: ^1.2.0
- sweetalert2: ^11.17.2
- tailwindcss: ^4.0.7
```
### 🔹 Backend:
```sh
- cors: ^2.8.5
- dotenv: ^16.4.7
- express: ^4.21.2
- http: ^0.0.1-security
- mongodb: ^6.13.0
- socket.io: ^4.8.1
```

## 🚀 Installation & Setup

Follow these steps to set up and run the Task Management Application:

### 1️⃣ Clone the repository
#### Client:
```sh
git clone https://github.com/khairul1036/ToDo-Website-Client-Side.git
cd client
```
#### Server:
```sh
git clone https://github.com/khairul1036/ToDo-Website-Server-Side.git
cd server
```

### 2️⃣ Install dependencies
#### 🔹 Frontend:
```sh
cd client
npm install
```
#### 🔹 Backend:
```sh
cd server
npm install
```

### 3️⃣ Set up environment variables
#### 🔹 Frontend:
Create a `.env.local` file inside the client directory and add the following:
```sh
# Firebase credentials for frontend usage
VITE_apiKey=your_firebase_api_key
VITE_authDomain=your_firebase_auth_domain
VITE_projectId=your_firebase_project_id
VITE_storageBucket=your_firebase_storage_bucket
VITE_messagingSenderId=your_firebase_messaging_sender_id
VITE_appId=your_firebase_app_id

# Backend server URL
VITE_url=https://your-server-url.com

```
#### 🔹 Backend:
Create a `.env` file inside the server directory and add the following:
```sh
# MongoDB credentials
MONGO_USER=your_mongodb_username
MONGO_PASS=your_mongodb_password
```

### 4️⃣ Start the application
####  🔹 Start the frontend
```sh 
npm run dev 
```
####  🔹 Start the backend server
```sh 
nodemon index.js
```
### 5️⃣ Open the application in your browser
```sh
http://localhost:5173
```
## 🔗 GitHub Repository Links
- **Client Side**: [Click Here](https://github.com/khairul1036/ToDo-Website-Client-Side)
- **Server Side**: [Click Here](https://github.com/khairul1036/ToDo-Website-Server-Side)

##### Happy Coding! 🚀💻🎉