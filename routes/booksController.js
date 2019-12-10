const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Book = require("../models/book.js");
const Author = require("../models/author.js");

router.get("/", (req, res, next) => {
  Book.find().populate('author')
    .select("title price _id author")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        books: docs.map(doc => {
          return {
            title: doc.title,
            price: doc.price,
            _id: doc._id,
            author: doc.author,
            request: {
              type: "GET",
              url: "http://localhost:3000/books/" + doc._id
            }
          };
        })
      };
      //   if (docs.length >= 0) {
      res.status(200).json(response);
      //   } else {
      //       res.status(404).json({
      //           message: 'No entries found'
      //       });
      //   }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.post("/", (req, res, next) => {
  console.log(req.body.authorId)
  Author.findById(req.body.authorId)
    .then(author => {
      console.log("jhkajh"+author)
      if (!author) {
        return res.status(404).json({
          message: "Author not found"
        });
      }
  const book = new Book({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    price: req.body.price,
    author: req.body.authorId
  });
  console.log(book);
  book.save().then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created book successfully",
        createdProduct: {
            _id: result._id,
            title: result.title,
            price: result.price,
            author: result.author,
            request: {
                type: 'GET',
                url: "http://localhost:3000/books/" + result._id
            }
        }
      });
    });

  }).catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
        
      });
    });
});

router.get("/:bookId", (req, res, next) => { 
  const id = req.params.bookId;
  Book.findById(id)
    .select('title price _id author')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
            book: doc,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/books'
            }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch("/:bookId", (req, res, next) => {
  const id = req.params.bookId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Book.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'Book updated',
          request: {
              type: 'GET',
              url: 'http://localhost:3000/books/' + id
          }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/:bookId", (req, res, next) => {
  const id = req.params.bookId;
  Book.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'Book deleted',
          request: {
              type: 'GET',
              url: 'http://localhost:3000/book',
              body: { title: 'String', price: 'Number', author: 'String'}
          }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
