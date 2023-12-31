const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const cors = require("cors");
const { resolve } = require("path");

const app = express();
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
mongoose.connect("mongodb://127.0.0.1:27017/alumniDB", {
  useNewUrlParser: true,
});

//Making the user schema
const userSchema = {
  fName: String,
  lName: String,
  pic: [],
  email: String,
  user: String,
  password: String,
  isFirst: Boolean,
};

const User = mongoose.model("User", userSchema);

//making the schemas for diff users
const teacherSchema = {
  email: String,
  course: [],
  subjectsTaught: [],
  qualifications: [],
  about: [],
  additionalDetails: [],
};
const studentSchema = {
  email: String,
  course: [],
  currentYear: [],
  certifications: [],
  about: [],
  additionalDetails: [],
};
const alumniSchema = {
  email: String,
  course: [],
  yearGraduated: [],
  certifications: [],
  companiesWorked: [],
  about: [],
  additionalDetails: [],
};

const Teacher = mongoose.model("Teacher", teacherSchema);
const Student = mongoose.model("Student", studentSchema);
const Alumni = mongoose.model("Alumni", alumniSchema);

//making the schema for the posts
const postSchema = {
  postNumber: Number,
  email: String,
  name: String,
  title: String,
  about: String,
  image: [],
  likes: [],
};
const Post = mongoose.model("Post", postSchema);

//making schema for comment and reply
const commentSchema = {
  postId: String,
  commentId: String,
  commentor: String,
  comment: String,
  reply: [],
};
const Comment = mongoose.model("Comment", commentSchema);

//making schema for chats
const conversationSchema = new mongoose.Schema(
  {
    members: Array,
  },
  { timestamps: true }
);
const Conversation = mongoose.model("Conversation", conversationSchema);

const messageSchema = new mongoose.Schema(
  {
    conversationId: String,
    sender: String,
    text: String,
    read: Boolean,
  },
  { timestamps: true }
);
const Message = mongoose.model("Message", messageSchema);

//handling a signup request
app.post("/signup", (req, res) => {
  User.find({ email: req.body.email }, (err, userFound) => {
    if (!userFound.length) {
      const newUser = new User({
        fName: req.body.fname,
        lName: req.body.lname,
        email: req.body.email,
        pic: [],
        user: req.body.user,
        password: req.body.password,
        isFirst: false,
      });
      newUser.save();
      if (req.body.user === "Student") {
        const newStudent = new Student({
          email: req.body.email,
        });
        const keys = Object.keys(studentSchema);
        keys.forEach((key) => {
          if (key !== "email") {
            if (key === "additionalDetails") {
              newStudent[key] = [];
            } else {
              newStudent[key] = [""];
            }
          }
        });
        newStudent.save();
      } else if (req.body.user === "Teacher") {
        const newTeacher = new Teacher({
          email: req.body.email,
        });
        const keys = Object.keys(studentSchema);
        keys.forEach((key) => {
          if (key !== "email") {
            if (key === "additionalDetails") {
              newTeacher[key] = [];
            } else {
              newTeacher[key] = [""];
            }
          }
        });
        newTeacher.save();
      } else if (req.body.user === "Alumni") {
        const newAlum = new Alumni({
          email: req.body.email,
        });
        const keys = Object.keys(studentSchema);
        keys.forEach((key) => {
          if (key !== "email") {
            if (key === "additionalDetails") {
              newAlum[key] = [];
            } else {
              newAlum[key] = [""];
            }
          }
        });
        newAlum.save();
      }
      res.send({ msg: "900" });
    } else {
      res.send({ msg: "901" });
    }
  });
});
//handling a login request
app.post("/login", (req, res) => {
  User.find(
    { email: req.body.email, password: req.body.password },
    (err, userFound) => {
      if (userFound.length) {
        if (!userFound[0].isFirst) {
          userFound[0].isFirst = true;
          userFound[0].save();
          res.send({ msg: "902", email: req.body.email });
        } else {
          res.send({ msg: "900", email: req.body.email });
        }
      } else {
        res.send({ msg: "901" });
      }
    }
  );
});

//retaining the session and getting the user data whenever needed
app.post("/retain-session", async (req, res) => {
  try {
    const userFound = await User.find({ email: req.body.email });
    const user = {
      fName: userFound[0].fName,
      lName: userFound[0].lName,
      email: userFound[0].email,
      user: userFound[0].user,
      userId: userFound[0]._id,
    };

    res.status(200).json(user);
  } catch (error) {
    res.status(500);
  }
});

//checking if the user has logged in for the first time
app.post("/firstLogin", (req, res) => {
  if (req.body.user === "Student") {
    Student.find({ email: req.body.email }, (err, userFound) => {
      res.send({ msg: "900", schema: userFound[0] });
    });
  } else if (req.body.user === "Teacher") {
    Teacher.find({ email: req.body.email }, (err, userFound) => {
      res.send({ msg: "900", schema: userFound[0] });
    });
  } else if (req.body.user === "Alumni") {
    Alumni.find({ email: req.body.email }, (err, userFound) => {
      res.send({ msg: "900", schema: userFound[0] });
    });
  }
});

//updating the details when user logins for the first time or wants to edit the details
app.post("/updateDetails", (req, res) => {
  if (req.body.slice(-1)[0].user === "Student") {
    Student.find({ email: req.body.slice(-1)[0].email }, (err, userFound) => {
      for (let i = 0; i < req.body.length - 1; i++) {
        const key = Object.keys(req.body[i])[0];
        const toPutIn = [];
        if (key !== "about") {
          req.body[i][key].split(",").forEach((value) => {
            toPutIn.push(_.trimStart(value));
          });
        } else {
          toPutIn.push(_.trimStart(req.body[i][key]));
        }

        userFound[0][key] = toPutIn;
      }
      userFound[0].save();
      res.send({ msg: "900", data: userFound[0] });
    });
  } else if (req.body.slice(-1)[0].user === "Teacher") {
    Teacher.find({ email: req.body.slice(-1)[0].email }, (err, userFound) => {
      for (let i = 0; i < req.body.length - 1; i++) {
        const key = Object.keys(req.body[i])[0];
        const toPutIn = [];
        req.body[i][key].split(",").forEach((value) => {
          toPutIn.push(_.trimStart(value));
        });
        userFound[0][key] = toPutIn;
      }
      userFound[0].save();
      res.send({ msg: "900", data: userFound[0] });
    });
  } else if (req.body.slice(-1)[0].user === "Alumni") {
    Alumni.find({ email: req.body.slice(-1)[0].email }, (err, userFound) => {
      for (let i = 0; i < req.body.length - 1; i++) {
        const key = Object.keys(req.body[i])[0];
        const toPutIn = [];
        req.body[i][key].split(",").forEach((value) => {
          toPutIn.push(_.trimStart(value));
        });
        userFound[0][key] = toPutIn;
      }
      userFound[0].save();
      res.send({ msg: "900", data: userFound[0] });
    });
  }
});

//gives back the details of the user to display
app.post("/give-details", (req, res) => {
  if (req.body.user === "Student") {
    Student.find({ email: req.body.email }, (err, detailsFound) => {
      res.send({ msg: "900", details: detailsFound[0] });
    });
  } else if (req.body.user === "Teacher") {
    Teacher.find({ email: req.body.email }, (err, detailsFound) => {
      res.send({ msg: "900", details: detailsFound[0] });
    });
  } else if (req.body.user === "Alumni") {
    Alumni.find({ email: req.body.email }, (err, detailsFound) => {
      res.send({ msg: "900", details: detailsFound[0] });
    });
  }
});

app.post("/get-user-pic", (req, res) => {
  User.find({ email: req.body.email }, (err, userFound) => {
    res.send({
      msg: "900",
      pic: userFound[0].pic,
      name: userFound[0].fName + " " + userFound[0].lName,
    });
  });
});

app.post("/update-user-pic", (req, res) => {
  User.find({ email: req.body.email }, (err, userFound) => {
    if (!err) {
      userFound[0].pic = [req.body.pic];
      userFound[0].save();
      res.send({ msg: "900" });
    }
  });
});

//adds or edits the about section
app.post("/add-about", (req, res) => {
  User.find({ email: req.body.email }, (err, userFound) => {
    if (userFound[0].user === "Student") {
      Student.find({ email: req.body.email }, (err, detailsFound) => {
        detailsFound[0].about = req.body.about;
        detailsFound[0].save();
        res.send({ msg: "900", details: detailsFound[0] });
      });
    } else if (userFound[0].user === "Teacher") {
      Teacher.find({ email: req.body.email }, (err, detailsFound) => {
        detailsFound[0].about = req.body.about;
        detailsFound[0].save();
        res.send({ msg: "900", details: detailsFound[0] });
      });
    } else if (userFound[0].user === "Alumni") {
      Alumni.find({ email: req.body.email }, (err, detailsFound) => {
        detailsFound[0].about = req.body.about;
        detailsFound[0].save();
        res.send({ msg: "900", details: detailsFound[0] });
      });
    }
  });
});

app.post("/add-section", (req, res) => {
  User.find({ email: req.body.email }, (err, userFound) => {
    if (userFound[0].user === "Student") {
      Student.find({ email: req.body.email }, (err, detailsFound) => {
        const details = [];
        if (req.body.from === "edit") {
          for (let i = 0; i < detailsFound[0].additionalDetails.length; i++) {
            const det = detailsFound[0].additionalDetails[i];
            if (Object.keys(det)[0] !== req.body.title) {
              details.push(det);
            } else {
              console.log("hmm");
              const values = [];
              req.body.value.split(",").forEach((value) => {
                values.push(_.trimStart(value));
              });
              details.push({ [_.camelCase(req.body.title)]: values });
              console.log(details);
            }
          }
        } else {
          detailsFound[0].additionalDetails.forEach((det) => {
            if (Object.keys(det)[0] !== req.body.title) {
              details.push(det);
            }
          });
          const values = [];
          req.body.value.split(",").forEach((value) => {
            values.push(_.trimStart(value));
          });
          details.push({ [_.camelCase(req.body.title)]: values });
        }

        detailsFound[0].additionalDetails = details;
        detailsFound[0].save();
        res.send({ msg: "900" });
      });
    } else if (userFound[0].user === "Teacher") {
      Teacher.find({ email: req.body.email }, (err, detailsFound) => {
        const details = [];
        if (req.body.from === "edit") {
          for (let i = 0; i < detailsFound[0].additionalDetails.length; i++) {
            const det = detailsFound[0].additionalDetails[i];
            if (Object.keys(det)[0] !== req.body.title) {
              details.push(det);
            } else {
              console.log("hmm");
              const values = [];
              req.body.value.split(",").forEach((value) => {
                values.push(_.trimStart(value));
              });
              details.push({ [_.camelCase(req.body.title)]: values });
              console.log(details);
            }
          }
        } else {
          detailsFound[0].additionalDetails.forEach((det) => {
            if (Object.keys(det)[0] !== req.body.title) {
              details.push(det);
            }
          });
          const values = [];
          req.body.value.split(",").forEach((value) => {
            values.push(_.trimStart(value));
          });
          details.push({ [_.camelCase(req.body.title)]: values });
        }

        detailsFound[0].additionalDetails = details;
        detailsFound[0].save();
        res.send({ msg: "900" });
      });
    } else if (userFound[0].user === "Alumni") {
      Alumni.find({ email: req.body.email }, (err, detailsFound) => {
        const details = [];
        if (req.body.from === "edit") {
          for (let i = 0; i < detailsFound[0].additionalDetails.length; i++) {
            const det = detailsFound[0].additionalDetails[i];
            if (Object.keys(det)[0] !== req.body.title) {
              details.push(det);
            } else {
              console.log("hmm");
              const values = [];
              req.body.value.split(",").forEach((value) => {
                values.push(_.trimStart(value));
              });
              details.push({ [_.camelCase(req.body.title)]: values });
              console.log(details);
            }
          }
        } else {
          detailsFound[0].additionalDetails.forEach((det) => {
            if (Object.keys(det)[0] !== req.body.title) {
              details.push(det);
            }
          });
          const values = [];
          req.body.value.split(",").forEach((value) => {
            values.push(_.trimStart(value));
          });
          details.push({ [_.camelCase(req.body.title)]: values });
        }

        detailsFound[0].additionalDetails = details;
        detailsFound[0].save();
        res.send({ msg: "900" });
      });
    }
  });
});

app.post("/delete-section", (req, res) => {
  console.log(req.body);
  User.find({ email: req.body.email }, (err, userFound) => {
    if (userFound[0].user === "Student") {
      Student.find({ email: req.body.email }, (err, detailsFound) => {
        for (let i = 0; i < detailsFound[0].additionalDetails.length; i++) {
          const element = detailsFound[0].additionalDetails[i];
          const key = Object.keys(element)[0];
          if (key === req.body.toDelete) {
            detailsFound[0].additionalDetails.splice(i, 1);
            detailsFound[0].save();
          }
        }
        res.send({ msg: "900" });
      });
    } else if (userFound[0].user === "Teacher") {
      Teacher.find({ email: req.body.email }, (err, detailsFound) => {
        for (let i = 0; i < detailsFound[0].additionalDetails.length; i++) {
          const element = detailsFound[0].additionalDetails[i];
          const key = Object.keys(element)[0];
          if (key === req.body.toDelete) {
            detailsFound[0].additionalDetails.splice(i, 1);
            detailsFound[0].save();
          }
        }
        res.send({ msg: "900" });
      });
    } else if (userFound[0].user === "Alumni") {
      Alumni.find({ email: req.body.email }, (err, detailsFound) => {
        for (let i = 0; i < detailsFound[0].additionalDetails.length; i++) {
          const element = detailsFound[0].additionalDetails[i];
          const key = Object.keys(element)[0];
          if (key === req.body.toDelete) {
            detailsFound[0].additionalDetails.splice(i, 1);
            detailsFound[0].save();
          }
        }
        res.send({ msg: "900" });
      });
    }
  });
});

app.post("/add-post", (req, res) => {
  var postNumber;
  Post.find({}, (err, posts) => {
    if (posts.length > 0) {
      postNumber = posts[posts.length - 1].postNumber;
    } else {
      postNumber = 0;
    }
    User.find({ email: req.body.email }, (err, userFound) => {
      const presentNumber = postNumber + 1;
      const newPost = new Post({
        postNumber: presentNumber,
        email: req.body.email,
        name: userFound[0].fName + " " + userFound[0].lName,
        title: req.body.postTitle,
        about: req.body.postAbout,
        image: req.body.pics,
        likes: [],
      });
      newPost.save();
      res.send({ msg: "900" });
    });
  });
});

app.get("/get-posts", (req, res) => {
  Post.find({}, (err, postsFound) => {
    res.send({ msg: "900", posts: postsFound });
  });
});

app.post("/delete-post", async (req, res) => {
  try {
    // this will delete all the replies to all the comments of the post
    const comments = await Comment.find({ postId: req.body.postId });
    comments.forEach(async (comment) => {
      await Comment.deleteMany({ commentId: comment._id });
    });
    // this will delete all the comments of the post
    await Comment.deleteMany({ postId: req.body.postId });
    // and finally this will delete the post
    await Post.deleteOne({ _id: req.body.postId });
    res.send({ msg: "900" });
  } catch (error) {
    console.log(error);
  }
});

app.post("/add-comment", async (req, res) => {
  try {
    const newComment = new Comment({
      postId: req.body.postId,
      commentor: req.body.email,
      comment: req.body.newComment,
      reply: [],
    });
    newComment.save();
    res.send({ msg: "900", comment: newComment });
  } catch (err) {
    res.send({ msg: "901" });
  }
});

app.post("/delete-comment", async (req, res) => {
  try {
    await Comment.deleteOne({ _id: req.body.commentId });
    await Comment.deleteMany({ commentId: req.body.commentId });
    res.send({ msg: "900" });
  } catch (error) {
    console.log(error);
  }
});

app.post("/get-comments", (req, res) => {
  Comment.find({ postId: req.body.postId }, (err, commentsFound) => {
    if (!err) {
      res.send({ msg: "900", comments: commentsFound });
    }
  });
});

app.post("/add-reply", async (req, res) => {
  try {
    const newReply = new Comment({
      commentId: req.body.commentId,
      commentor: req.body.email,
      comment: req.body.reply,
      reply: [],
    });
    newReply.save();
    res.send({ msg: "900" });
  } catch (error) {
    console.log(error);
  }
});

app.post("/get-reply", async (req, res) => {
  try {
    const replies = await Comment.find({ commentId: req.body.commentId });

    res.send({ msg: "900", replies: replies });
  } catch (error) {
    console.log(error);
  }
});

app.post("/get-reply-details", async (req, res) => {
  try {
    const user = await User.find({ email: req.body.commentor });
    res.send({
      msg: "900",
      details: {
        name: user[0].fName + " " + user[0].lName,
        pic: user[0].pic,
        email: user[0].email,
      },
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/toggle-like", async (req, res) => {
  try {
    const post = await Post.find({ _id: req.body.postId });
    let alreadyLiked = false;
    if (post[0].likes.length) {
      post[0].likes.forEach((like) => {
        if (like === req.body.userId) {
          alreadyLiked = true;
        }
      });
      if (!alreadyLiked) {
        post[0].likes.push(req.body.userId);
      } else {
        post[0].likes = post[0].likes.filter((l) => l !== req.body.userId);
      }
    } else {
      post[0].likes = [req.body.userId];
    }
    post[0].save();
    res.status(200).json(post[0]);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.get("/get-all-users", (req, res) => {
  const users = [];
  User.find({}, (err, usersFound) => {
    usersFound.forEach((user) => {
      users.push({
        name: user.fName + " " + user.lName,
        email: user.email,
        pic: user.pic,
        user: user.user,
      });
    });
    res.send({ msg: "900", users: users });
  });
});

app.post("/search-user", (req, res) => {
  var user = req.body.userSearched.split(" ");
  var usersFound = [];

  User.find({ fName: user }, (err, userFoundFName) => {
    userFoundFName.forEach((userFound) => {
      usersFound.push(userFound);
    });
    User.find({ lName: user }, (err, userFoundLName) => {
      userFoundLName.forEach((userFound) => {
        usersFound.push(userFound);
      });
      User.find({ email: user }, (err, userFoundEmail) => {
        userFoundEmail.forEach((userFound) => {
          usersFound.push(userFound);
        });
        User.find({ user: user }, (err, userFoundType) => {
          userFoundType.forEach((userFound) => {
            usersFound.push(userFound);
          });
          if (usersFound.length >= 1) {
            usersFound = filterUsersFound(usersFound);
            res.send({ msg: "900", usersFound: usersFound });
          } else if (usersFound.length === 0) {
            res.send({ msg: "901" });
          } else {
            res.send({ msg: "902" });
          }
        });
      });
    });
  });
});

app.post("/get-user-details", async (req, res) => {
  try {
    console.log(req.body);
    User.find({ email: req.body.email }, (err, userFound) => {
      if (userFound[0].user === "Student") {
        Student.find({ email: req.body.email }, (err, userDetailsFound) => {
          res.send({
            msg: "900",
            user: userFound[0].email,
            userDetails: userDetailsFound[0],
          });
        });
      } else if (userFound[0].user === "Teacher") {
        Teacher.find({ email: req.body.email }, (err, userDetailsFound) => {
          res.send({
            msg: "900",
            user: userFound[0].email,
            userDetails: userDetailsFound[0],
          });
        });
      } else if (userFound[0].user === "Alumni") {
        Alumni.find({ email: req.body.email }, (err, userDetailsFound) => {
          res.send({
            msg: "900",
            user: userFound[0].email,
            userDetails: userDetailsFound[0],
          });
        });
      }
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

app.post("/new-conversation", async (req, res) => {
  try {
    let receiverId, senderId;
    if (req.body.receiverId.includes("@")) {
      const receiver = await User.find({ email: req.body.receiverId });
      receiverId = receiver[0]._id;
    } else {
      receiverId = req.body.receiverId;
    }
    if (req.body.senderId.includes("@")) {
      const sender = await User.find({ email: req.body.receiverId });
      senderId = sender[0]._id;
    } else {
      senderId = req.body.senderId;
    }
    receiverId = receiverId.toString();
    const conversation = await Conversation.find({
      members: { $in: receiverId },
    });

    if (conversation.length) {
      console.log("here");
      const conv = await Conversation.find({ members: { $in: senderId } });
      if (conv.length) {
        console.log("iner");
        res.status(200).json({ msg: "201" });
      } else {
        const newConversation = new Conversation({
          members: [senderId, receiverId],
        });
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
      }
    } else {
      const newConversation = new Conversation({
        members: [senderId, receiverId],
      });
      const savedConversation = await newConversation.save();
      res.status(200).json(savedConversation);
    }
  } catch (error) {
    // res.status(500).json(error);
  }
});

app.get("/conversation/:userId", async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: { $in: req.params.userId },
    });
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.post("/new-message", async (req, res) => {
  let newMessage = new Message({
    conversationId: req.body.conversationId,
    sender: req.body.sender,
    text: req.body.text,
    read: false,
  });

  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.get("/get-messages/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.get("/get-user", async (req, res) => {
  try {
    const user = await User.find({ _id: req.query.userId });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.get("/delete-message", async (req, res) => {
  try {
    const deleteStatus = await Message.deleteOne({ _id: req.query.messageId });
    res.status(200).json(deleteStatus);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.get("/mark-read/:messageId", async (req, res) => {
  try {
    const message = await Message.find({ _id: req.params.messageId });
    if (message.length) {
      if (message[0].read === false) {
        message[0].read = true;
        message[0].save();
        res.status(200).json(true);
      } else {
        res.status(200).json(false);
      }
    } else {
      res.status(200).json();
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
app.get("/get-user-post/:email", async (req, res) => {
  try {
    const user = await User.find({ email: req.params.email });
    res.status(200).json(user[0]);
  } catch (error) {
    res.status(500).json(error);
  }
});

//to search users
function filterUsersFound(usersFound) {
  const filteredUsers = [];
  for (let i = 0; i < usersFound.length; i++) {
    const currentUser = usersFound[i];
    let isUserThere = false;
    filteredUsers.forEach((user) => {
      if (currentUser.email === user.email) {
        isUserThere = true;
      }
    });
    if (!isUserThere) {
      filteredUsers.push(currentUser);
    }
  }
  return filteredUsers;
}

function restart() {
  User.find({}, (err, users) => {
    if (users.length === 0) {
      const newUser = new User({
        fName: "harshit",
        lName: "goyal",
        email: "goyalharshit79@gmail.com",
        user: "Teacher",
        password: "h",
        isFirst: true,
        pic: [],
      });
      const userDetails = new Teacher({
        email: "goyalharshit79@gmail.com",
        course: [],
        subjectsTaught: [""],
        qualifications: [""],
        about: [""],
        additionalDetails: [],
      });
      newUser.save();
      userDetails.save();
    }
  });
}
restart();

app.listen(8000, () => {
  console.log("The server is running on port 8000");
});
