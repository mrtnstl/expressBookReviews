const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body || {};

  if (typeof username === "undefined" || typeof password === "undefined") {
    return res.status(400).json({ message: "Invalid request!" });
  }
  if (username === "" || password === "") {
    return res.status(400).json({ message: "Invalid request! Username and password are mandatory!" });
  }

  const user = users.find(user => user.username === username && user.password === password);
  if (!user) {
    return res.status(400).json({ message: "Login failed!" });
  }

  const accessToken = jwt.sign({ data: user }, "access", { expiresIn: 60 * 60 });
  req.session.authorization = { accessToken };

  return res.status(200).json({ message: "Successful login!" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const rating = req.query.rating;
  const loggedInUser = req.user.data.username;

  const book = books[isbn];
  if (!book) return res.status(404).json({ message: "Book can not be found!" });

  const review = {
    reviewer: loggedInUser,
    rating
  };

  book.reviews[loggedInUser] = review;

  return res.json({ message: "Review added!" });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const loggedInUser = req.user.data.username;

  const book = books[isbn];
  if (!book) return res.status(404).json({ message: "Book can not be found!" });

  const review = book.reviews[loggedInUser];
  if (!review) return res.status(404).json({ message: "Review can not be found!" });

  delete book.reviews[loggedInUser];


  console.log(book.reviews)
  return res.json({ message: "Review deleted!" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
