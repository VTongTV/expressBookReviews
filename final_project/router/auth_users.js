const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  //write code to check is the username is valid
  return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
  //write code to check if username and password match the one we have in records.
  return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;
  
  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  
  // Check if username is valid
  if (!isValid(username)) {
    return res.status(401).json({message: "Invalid username"});
  }
  
  // Check if username and password match
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({message: "Invalid credentials"});
  }
  
  // Generate JWT token
  const token = jwt.sign({ username }, "secret_key", { expiresIn: "1h" });
  
  // Return success response with token
  return res.status(200).json({ message: "Login successful", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.user.username; // Get username from session/jwt
  
  // Check if review is provided
  if (!review) {
    return res.status(400).json({message: "Review is required"});
  }
  
  // Check if book exists
  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }
  
  // If user has already reviewed this book, modify the review
  // Otherwise, add a new review
  books[isbn].reviews[username] = review;
  
  return res.status(200).json({message: "Review added/modified successfully"});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const username = req.user.username; // Get username from session/jwt
  
  // Check if book exists
  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }
  
  // Check if user has reviewed this book
  if (!books[isbn].reviews[username]) {
    return res.status(404).json({message: "Review not found for this user"});
  }
  
  // Delete the user's review
  delete books[isbn].reviews[username];
  
  return res.status(200).json({message: "Review deleted successfully"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
