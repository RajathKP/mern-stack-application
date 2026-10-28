
console.log("Server has started");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

const User = require("./models/userModel");
const Product = require("./models/productModule")
const Book   =  require("./models/booksModel.js")
app.use(express.json());
const authRoutes = require("./routes/authRoutes");

// CORS 
app.use(cors({
  origin: "http://localhost:5173"
}));


// JSON
app.use(express.json());

// AUTH ROUTES
app.use("/auth", authRoutes);


app.use((req, res, next) => {
    console.log(req.url);

    if (req.url == "/about") {
        return res.send("About page Access is Denied");
    }

    next();
});

app.get("/about", (req, res) => {
    res.send("Hello, This is my About us page");
});

// app.get("/user/:user", (req, res) => {
//     res.send(`id is: ${req.params.user}`);
// });

// app.get("/users", (req, res) => {
//     res.send(`category is: ${req.query.category}`);
// });


//Books


// app.get("/books/:id", (req, res) => {
//     const id = req.params.id;
//     const search = req.query.search;
//     res.send(`id is: ${req.params.id} and search value is: ${search}`);
// });



// app.get("/books/:id", (req, res) => {
//     res.send(`category is: ${req.query.category} and id is: ${req.params.id}`);
// });


// GET ALL BOOKS


app.get("/books", async (req, res) => {
  try {
    const books = await Book.find();

    res.status(200).json(books);
  } catch (error) {
    console.log("Fetch books error:", error);

    res.status(500).json({
      message: "Error fetching books",
      error: error.message,
    });
  }
});

// SEARCH + PAGINATION


app.get("/books/search", async (req, res) => {
  try {
    const q = req.query.q || "";

    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 5;

    const skip = (page - 1) * limit;

    // Search condition
    const searchCondition = q
      ? {
          $or: [
            {
              title: {
                $regex: q,
                $options: "i",
              },
            },
            {
              author: {
                $regex: q,
                $options: "i",
              },
            },
            {
              category: {
                $regex: q,
                $options: "i",
              },
            },
          ],
        }
      : {};

    // Get books
    const books = await Book.find(searchCondition)
      .skip(skip)
      .limit(limit);

    // Count total matching books
    const totalBooks = await Book.countDocuments(
      searchCondition
    );

    // Calculate total pages
    const totalPages = Math.ceil(
      totalBooks / limit
    );

    res.status(200).json({
      books: books,
      totalBooks: totalBooks,
      totalPages: totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.log("Search books error:", error);

    res.status(500).json({
      message: "Error searching books",
      error: error.message,
    });
  }
});


// GET SINGLE BOOK


app.get("/books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.status(200).json(book);
  } catch (error) {
    console.log("Get single book error:", error);

    res.status(500).json({
      message: "Error fetching book",
      error: error.message,
    });
  }
});


// ADD BOOK


app.post("/books", async (req, res) => {
  try {
    const {
      title,
      price,
      author,
      category,
      stock,
    } = req.body;

    const newBook = new Book({
      title,
      price,
      author,
      category,
      stock,
    });

    const savedBook = await newBook.save();

    res.status(201).json({
      message: "Book added successfully",
      book: savedBook,
    });
  } catch (error) {
    console.log("Add book error:", error);

    res.status(500).json({
      message: "Error adding book",
      error: error.message,
    });
  }
});


// UPDATE BOOK


app.put("/books/:id", async (req, res) => {
  try {
    const {
      title,
      price,
      author,
      category,
      stock,
    } = req.body;

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      {
        title,
        price,
        author,
        category,
        stock,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedBook) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.status(200).json({
      message: "Book updated successfully",
      book: updatedBook,
    });
  } catch (error) {
    console.log("Update book error:", error);

    res.status(500).json({
      message: "Error updating book",
      error: error.message,
    });
  }
});


// DELETE BOOK


app.delete("/books/:id", async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(
      req.params.id
    );

    if (!deletedBook) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.status(200).json({
      message: "Book deleted successfully",
      book: deletedBook,
    });
  } catch (error) {
    console.log("Delete book error:", error);

    res.status(500).json({
      message: "Error deleting book",
      error: error.message,
    });
  }
});


//

app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (error) {
        console.log("Error:", error.message);
        res.status(500).json({
            message: error.message
        });
    }
});

app.post("/users", async (req, res) => {
    console.log("req.body is", req.body);
    try {
        const user = new User(req.body);
        const savedUser = await user.save();
        res.send(savedUser);
    } catch (error) {
        console.log("Error:", error.message);
        res.status(500).json({
            message: error.message
        });
    }
});

app.get("/users/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.send(user);
    } catch (error) {
        console.log("Error:", error.message);
        res.status(500).json({
            message: error.message
        });
    }
});

app.put("/users/:id", async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { returnDocument: "after" }
        );

        res.send(updatedUser);
    } catch (error) {
        console.log("Update Error:", error.message);
        res.status(500).json({
            message: error.message
        });
    }
});

app.delete("/users/:id", async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.send("User Deleted Successfully");
    } catch (error) {
        res.status(500).send(error);
    }
});






// GET ALL PRODUCTS
app.get("/product", async (req, res) => {
    try {
        const products = await Product.find();
        res.send(products);
    } catch (error) {
        console.log("Error:", error.message);

        res.status(500).json({
            message: error.message
        });
    }
});


// SEARCH PRODUCTS

app.get("/product/search", async (req, res) => {
  try {
    const { q = "", page = 1, limit = 5 } = req.query;

    const skip = (page - 1) * limit;

    const products = await Product.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } }
      ]
    })
      .skip(skip)
      .limit(Number(limit));

    const totalProducts = await Product.countDocuments({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } }
      ]
    });

    res.json({
      products,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: Number(page)
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Search failed",
      error: error.message
    });
  }
});







// ADD PRODUCT
app.post("/product", async (req, res) => {
    try {
        const product = new Product(req.body);

        const savedProduct = await product.save();

        res.json(savedProduct);

    } catch (error) {
        console.log("Add product error:", error.message);

        res.status(500).json({
            message: error.message
        });
    }
});


// GET PRODUCT BY ID
app.get("/product/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        res.json(product);

    } catch (error) {
        console.log("Get product error:", error.message);

        res.status(500).json({
            message: error.message
        });
    }
});


// UPDATE PRODUCT
app.put("/product/:id", async (req, res) => {
    try {
        const product = await Product.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            {
                returnDocument: "after"
            }
        );

        res.json(product);

    } catch (error) {
        console.log("Update error:", error.message);

        res.status(500).json({
            message: error.message
        });
    }
});


// DELETE PRODUCT
app.delete("/product/:id", async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);

        res.json({
            message: "Product Deleted Successfully"
        });

    } catch (error) {
        console.log("Delete error:", error.message);

        res.status(500).json({
            message: error.message
        });
    }
});
// ADD PRODUCT
app.post("/product", async (req, res) => {
    console.log("req.body is", req.body);

    try {
        const product = new Product(req.body);

        const savedProduct = await product.save();

        res.send(savedProduct);

    } catch (error) {
        console.log("Error:", error.message);

        res.status(500).json({
            message: error.message
        });
    }
});


// GET PRODUCT BY ID
app.get("/product/:id", async (req, res) => {
    try {
        const product = await Product.findById(
            req.params.id
        );

        res.send(product);

    } catch (error) {
        console.log("Error:", error.message);

        res.status(500).json({
            message: error.message
        });
    }
});


// UPDATE PRODUCT
app.put("/product/:id", async (req, res) => {
    try {
        const product = await Product.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            {
                returnDocument: "after"
            }
        );

        res.send(product);

    } catch (error) {
        console.log("Update Error:", error.message);

        res.status(500).json({
            message: error.message
        });
    }
});


// DELETE PRODUCT
app.delete("/product/:id", async (req, res) => {
    try {
        await Product.findByIdAndDelete(
            req.params.id
        );

        res.send("Product Deleted Successfully");

    } catch (error) {
        console.log("Delete Error:", error.message);

        res.status(500).json({
            message: error.message
        });
    }
});

// Authentication routes
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API is working");
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});

mongoose.connect("mongodb+srv://rajathraj1000_db_user:Qwerty1123@cluster0.b8kprot.mongodb.net/testcrud").then(() => {
    console.log("MongoDB Connected");
}).catch((err) => {
    console.log("MongoDB Connection Error: ", err);
});
