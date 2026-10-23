console.log('Server Started');
const express = require('express');
const app = express();
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.url);
    if (req.url === "/about") {
        console.log('About page is Denied');
       
    }
    next();
});

// app.get("/about", (req, res) => {
//     res.send('Hello from the backend! this is my about us page');
// });

app.get("/products", (req, res) => {
    res.send('Hello from the backend! this is my products page');
});

app.get("/about", (req, res) => {
    res.send('Hello from the backend! this is my about us page');
});

app.get("/user/:id", (req, res) => {
    res.send(`User  ID is ${req.params.id}`);
});

app.get("/users", (req, res) => res.send(`category is ${req.query.category}`));

app.get("/books", (req, res) => res.send(`category is ${req.query.category}`));

app.get("/books/:id", (req, res) => {
    const id = req.params.id;
    const search = req.query.search;
    res.send(`id is ${id} search value is ${search}`);
});

app.listen(5000, () => console.log('Server is running on port 5000'));