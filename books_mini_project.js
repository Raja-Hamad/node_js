// Books mini CRUD FAKE DB Project


const express = require("express");
const app = express();

app.use(express.json());

let books = [
    { id: 1, title: "Clean Code", author: "Robert C. Martin", price: 1200 },
    { id: 2, title: "You Don't Know JS", author: "Kyle Simpson", price: 900 }
];


//GET:All books method

app.get("/books", (req, res) => {
    const bookId=req.query.id;
   
    res.json(books);
});

// Get: Book by id

app.get("/books/:id", (req, res) => {
    const bookId = Number(req.params.id);

    const book = books.find(b => b.id === bookId);

    if (!book) {
        return res.status(404).json({
            message: `book with id ${bookId} not found`
        });
    }
    res.json(book);
});

// POST: Add new book

app.post("/books", (req, res) => {
    const { title, author, price } = req.body;
    const newBook = {
        id: books.length + 1,
        title: title,
        author: author,
        price: price
    };
    books.push(newBook);

    res.status(201).json(newBook);
});

// PUT: Update book

app.put("/books/:id", (req, res) => {

    const bookId = Number(req.params.id);
    const {
        title,
        author,
        price
    } = req.body;

    const book = books.find(b => b.id === bookId);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }
    book.title = title || book.title;
    book.author = author || book.author;
    book.price = price || book.price;

    res.json({
        message: "Book updated successfully",
        book: book
    });

});

// DELETE: Delete specific book by id

app.delete("/books/:id", (req, res) => {
    const bookId =Number(req.params.id);



    const updatedBooks = books.filter(b => b.id !==bookId);

    books = updatedBooks;

    res.json({
        message: `Book with id ${bookId} deleted successfully`
    })

});

app.listen(3000, () => {
    console.log("Server is listening at port 3000");
});