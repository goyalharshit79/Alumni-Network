const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};
const removeUser = (socketId) => {
  const updatedUsers = [];
  users.forEach((user) => {
    if (user.socketId !== socketId) {
      updatedUsers.push(user);
    }
  });
  users = updatedUsers;
};

const getUser = (userId) => {
  let userFound = [];
  users.forEach((user) => {
    // console.log("all: ", user);
    if (user.userId === userId) {
      // console.log("inloop: ", user);

      userFound = user;
    }
  });
  // console.log("found: ", userFound);
  return userFound;
};

io.on("connection", (socket) => {
  console.log("a user connected");
  //take userid and socketid from user when they log in and put in the usrs array
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });
  //removing the user if they disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });

  socket.on("sendMessage", ({ receiverId, message }) => {
    const user = getUser(receiverId);
    // console.log("in the event: ", user.socketId);
    io.emit("getMessage", message);
  });

  socket.on("deleteMessage", (message) => {
    io.emit("updateDeleteMessage", message);
  });
});
