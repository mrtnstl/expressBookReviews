const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body || {};

  if (typeof username === "undefined" || typeof password === "undefined") {
    return res.status(400).json({ message: "Invalid request!" });
  }
  if (username === "" || password === "") {
    return res.status(400).json({ message: "Invalid request! Username and password are mandatory!" });
  }

  const userExists = users.find(user => user.username === username);
  if (userExists) {
    return res.status(400).json({ message: "User already exists!" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "Successful registration!" });

});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  const getAvailableBooks = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 1000);
  }).then(result => {
    return res.status(200).json(result); // or res.send(JSON.stringify(books, null, 4));
  }).catch(err => {
    return res.status(400).json({ message: `An error occured while fetching books: ${err.message}` });
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  const getBookByISBN = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books[isbn]);
    }, 1000);
  }).then(book => {
    if (book === undefined) throw new Error("Book can not be found!");
    return res.status(200).json(book);
  }).catch(err => {
    return res.status(400).json({ message: `An error occured while fetching book: ${err.message}` });
  })
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  const getBooksByAuthor = new Promise((resolve, reject) => {
    setTimeout(() => {
      const bookIndexesArray = Object.keys(books);
      const booksOfAuthor = [];

      for (const index of bookIndexesArray) {
        if (books[index].author === author) booksOfAuthor.push(books[index]);
      }

      resolve(booksOfAuthor);
    }, 1000);
  }).then(result => {
    if (result.length === 0) return res.status(200).json({ message: "No book from the selected author!" });
    return res.status(200).json(result);
  }).catch(err => {
    return res.status(400).json({ message: `An error occured while fetching books: ${err.message}` });
  })
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  const getBookByTitle = new Promise((resolve, reject) => {
    setTimeout(() => {
      const bookIndexesArray = Object.keys(books);
      const booksOfTitle = [];

      for (const index of bookIndexesArray) {
        if (books[index].title === title) booksOfTitle.push(books[index]);
      }

      resolve(booksOfTitle);
    }, 1000);
  }).then(result => {
    if (result.length === 0) return res.status(200).json({ message: "No book with the selected title" });
    return res.status(200).json(result);
  }).catch(err => {
    return res.status(400).json({ message: `An error occured while fetching books: ${err.message}` });
  })
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  const book = books[isbn];
  if (!book) return res.status(404).json({ message: "Book can not be found!" });

  const reviewOfBook = book.reviews;
  return res.status(200).json(reviewOfBook);

});

module.exports.general = public_users;
