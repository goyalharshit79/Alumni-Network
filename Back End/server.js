const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const cors = require("cors");

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
  comments: [],
};
const Post = mongoose.model("Post", postSchema);

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
app.post("/retain-session", (req, res) => {
  User.find({ email: req.body.email }, (err, userFound) => {
    const user = {
      fName: userFound[0].fName,
      lName: userFound[0].lName,
      email: userFound[0].email,
      user: userFound[0].user,
    };
    res.send({ msg: "900", user: user });
  });
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
    res.send({ msg: "900", pic: userFound[0].pic });
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

app.post("/get-user", (req, res) => {
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
});

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
