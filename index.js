const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

// Use an absolute path for setting the views directory
app.set("views", path.join(__dirname, "views"));
// for creating a connection between node and mysql

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "delta_app",
  password: "ABcd1234@#",
});

let getRandomUser = () => {
  return [
    faker.datatype.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};

// let q = "INSERT INTO user (id, username, email, password) VALUES ?";

// let data = [];
// for (let i = 1; i <= 100; i++) {
//   data.push(getRandomUser());
// }

// try {
//   connection.query(q, [data], (err, result) => {
//     if (err) throw err;
//     console.log(result);

//     connection.end();
//   });
// } catch (error) {
//   console.log(error);
// }

// all routs

// 1 : all user count

app.get("/", (req, res) => {
  let q = "SELECT count(*) FROM user";
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;

      let count = result[0]["count(*)"];
      res.render("home.ejs", { count });
      // connection.end();
    });
  } catch (error) {
    console.log(error);
    res.send("error che bhai");
  }
});

// 2 : show all users

app.get("/user", (req, res) => {
  let q = "SELECT * FROM user";
  try {
    connection.query(q, (err, users) => {
      if (err) throw err;

      res.render("showusers.ejs", { users });
      // connection.end();
    });
  } catch (error) {
    console.log(error);
    res.send("error che bhai");
  }
});

// 3 : edit id

app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];

      res.render("edit.ejs", { user });
      // connection.end();
    });
  } catch (error) {
    console.log(error);
    res.send("error che bhai");
  }
});

// uodate db route

app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let { password: formPass, username: newUserName } = req.body;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];

      if (formPass != user.password) {
        res.send("wrong number !!!!");
      } else {
        let q2 = `UPDATE user SET username = '${newUserName}' WHERE id = '${id}'`;
        connection.query(q2, (err, result) => {
          if (err) throw err;
          res.redirect("/user");
        });
      }

      // connection.end();
    });
  } catch (error) {
    console.log(error);
    res.send("error che bhai");
  }
});

app.listen(port, () => {
  console.log("8080 is listening");
});
