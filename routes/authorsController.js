const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const fetch = require('node-fetch');


const Author = require("../models/author.js");
const Book = require("../models/book.js");

// Handle incoming GET requests to /authors
router.get("/", (req, res, next) => {
    Author.find()
    .populate('Book')
    .exec()
    .then(docs => {
      res.status(200).json({
        authors: docs.map(doc => {
          return {
            _id: doc._id,
            name: doc.name,
            email: doc.email,
            request: {
              type: "GET",
              url: "http://localhost:3000/authors/" + doc._id
            }
          };
        })
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.post("/", (req, res, next) => {

      console.log(req.body.name);
      const author = new Author({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email
      });
    author.save().then(result => {
      console.log(result);
      res.status(201).json({
        message: "Author stored",
        createdAuthor: {
          _id: result._id,
          name: result.name,
          email: result.email
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/authors/" + result._id
        }
      })
    
}).catch(err => {
  console.log(err);
  res.status(500).json({
    error: err
  });
});;

})

router.get("/:authorId", (req, res, next) => {
    Author.findById(req.params.authorId)
    .exec()
    .then(author => {
      if (!author) {
        return res.status(404).json({
          message: "Book not found"
        });
      }
      res.status(200).json({
        author: author,
        request: {
          type: "GET",
          url: "http://localhost:3000/authors"
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/:authorId", (req, res, next) => {
    Author.remove({ _id: req.params.authorId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Author deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/authors",
          body: { bookId: "ID", quantity: "Number" }
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
