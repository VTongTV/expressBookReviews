const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();


// Helper function to get all books using Promise
function getBooksAsync() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 100); // Simulating async operation
  });
}

// Helper function to get all books using async-await
async function getBooksAsyncAwait() {
  try {
    // Simulating an async operation with axios (but using our local data)
    // In a real scenario, this might be an external API call
    const response = await axios.get('http://localhost:5000/', { timeout: 1000 });
    return books;
  } catch (error) {
    // If the axios call fails, we still return our local data
    return books;
  }
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;
  
  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  
  // Check if username already exists
  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(409).json({message: "Username already exists"});
  }
  
  // Register the new user
  users.push({ username, password });
  return res.status(201).json({message: "User registered successfully"});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here using async-await
  try {
    const booksList = await getBooksAsyncAwait();
    return res.status(200).json(JSON.stringify(booksList, null, 4));
  } catch (error) {
    return res.status(500).json({message: "Error retrieving books", error: error.message});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here
  try {
    const isbn = req.params.isbn;
    // Simulating async operation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (books[isbn]) {
      return res.status(200).json(JSON.stringify(books[isbn], null, 4));
    } else {
      return res.status(404).json({message: "Book not found"});
    }
  } catch (error) {
    return res.status(500).json({message: "Error retrieving book", error: error.message});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  //Write your code here
  try {
    const author = req.params.author;
    let booksByAuthor = [];
    
    // Simulating async operation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Obtain all the keys for the 'books' object
    const bookKeys = Object.keys(books);
    
    // Iterate through the 'books' array & check the author matches the one provided
    bookKeys.forEach(key => {
      if (books[key].author === author) {
        booksByAuthor.push(books[key]);
      }
    });
    
    if (booksByAuthor.length > 0) {
      return res.status(200).json(JSON.stringify(booksByAuthor, null, 4));
    } else {
      return res.status(404).json({message: "No books found for this author"});
    }
  } catch (error) {
    return res.status(500).json({message: "Error retrieving books by author", error: error.message});
  }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  //Write your code here
  try {
    const title = req.params.title;
    let booksByTitle = [];
    
    // Simulating async operation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Obtain all the keys for the 'books' object
    const bookKeys = Object.keys(books);
    
    // Iterate through the 'books' array & check the title matches the one provided
    bookKeys.forEach(key => {
      if (books[key].title === title) {
        booksByTitle.push(books[key]);
      }
    });
    
    if (booksByTitle.length > 0) {
      return res.status(200).json(JSON.stringify(booksByTitle, null, 4));
    } else {
      return res.status(404).json({message: "No books found with this title"});
    }
  } catch (error) {
    return res.status(500).json({message: "Error retrieving books by title", error: error.message});
  }
});

//  Get book review
public_users.get('/review/:isbn',async function (req, res) {
  //Write your code here
  try {
    const isbn = req.params.isbn;
    
    // Simulating async operation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (books[isbn]) {
      return res.status(200).json(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
      return res.status(404).json({message: "Book not found"});
    }
  } catch (error) {
    return res.status(500).json({message: "Error retrieving book reviews", error: error.message});
  }
});

module.exports.general = public_users;
