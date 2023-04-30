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

io.on("connection", (socket) => {
  console.log("a user connected");
  //take userid and socketid from user when they log in and put in the usrs array
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
