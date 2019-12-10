const express = require("express");
const router = express.Router();
const fetch = require('node-fetch');

router.get('/document',function(req,res){
    res.sendFile(__dirname+'/index.html');
})

router.get('/book',function(req,res){

    fetch('http://localhost:3000/books').then(res => res.json()).then(json => {
        var books = json.books;
        console.log(books);
        res.render('books',{data: books});
    })

});

router.delete('/book/:id',function(req,res){
    console.log("hhh")
    fetch('http://localhost:3000/books/'+req.params.id,{
        method: 'delete',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(result => result.json()).then(result => {res.status(200).json(result)});

});

router.get('/addBook',function(req,res){

    fetch('http://localhost:3000/authors').then(res => res.json()).then(json => {
        var authors = json.authors;
        res.render('addBook',{data: authors});
    })

});

router.get('/addAuthor',function(req,res){

        res.render('addAuthor');

});


router.post('/author',function(req,res){

    body = req.body;

    console.log(body);
    fetch('http://localhost:3000/authors',{
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    })
    .then(res => res.json()).then(json => {
        res.redirect('/author');
    })

});

router.post('/book',function(req,res){

    body = req.body;
    console.log(body);
    fetch('http://localhost:3000/books',{
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    })
    .then(res => res.json()).then(json => {  res.redirect('/book');})
   

});


router.get('/author',function(req,res){

    fetch('http://localhost:3000/authors').then(res => res.json()).then(json => {
        var authors = json.authors;
        res.render('authors',{data: authors});
    })

});

//router.get('/deleteauthor',function(req,res){
 //   fetch('http://localhost:3000/authors/'+req.query.authorId,{
 //       method: 'delete',
 //       headers: { 'Content-Type': 'application/json' },
 //   })
 //   .then(res => res.json()).then()
//     res.redirect('authors');

//});






router.get('/',function(req,res){

    res.render('index');



});

module.exports = router;