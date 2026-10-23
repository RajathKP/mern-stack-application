
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Container,
  Form,
  Modal,
  Table,
  Pagination,
} from "react-bootstrap";

const GetBook = () => {
  const [books, setBooks] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  // Search
  const [query, setQuery] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const booksPerPage = 5;

  // "view", "edit", or "add"
  const [modalMode, setModalMode] = useState("");

  // Fetch Books
 
  const fetchBooks = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/books/search?q=${query}&page=${currentPage}&limit=${booksPerPage}`
      );

      setBooks(response.data.books);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };


  useEffect(() => {
    fetchBooks();
  }, [query, currentPage]);

  // View Book
  
  const handleView = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/books/${id}`
      );

      setSelectedBook(res.data);
      setModalMode("view");
      setShow(true);
    } catch (err) {
      console.log("View error:", err);
    }
  };

  // Edit Button

  const handleEditClick = (book) => {
    setSelectedBook({ ...book });
    setModalMode("edit");
    setShow(true);
  };

 
  // Add Button
 
  const handleAddClick = () => {
    setSelectedBook({
      title: "",
      price: "",
      author: "",
      category: "",
      stock: "",
    });

    setModalMode("add");
    setShow(true);
  };


  // Close Modal
  
  const handleClose = () => {
    setShow(false);
    setSelectedBook(null);
    setModalMode("");
  };

    // Handle Input Change

  const handleChange = (e) => {
    setSelectedBook({
      ...selectedBook,
      [e.target.name]: e.target.value,
    });
  };

  
  // Add Book

  const handleAdd = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/books",
        {
          title: selectedBook.title,
          price: Number(selectedBook.price),
          author: selectedBook.author,
          category: selectedBook.category,
          stock: Number(selectedBook.stock),
        }
      );

      console.log("Book added:", res.data);

      await fetchBooks();
      handleClose();
    } catch (err) {
      console.log(
        "Add book error:",
        err.response?.data || err.message
      );
    }
  };

 
  // Update Book
 
  const handleEdit = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/books/${selectedBook._id}`,
        {
          title: selectedBook.title,
          price: Number(selectedBook.price),
          author: selectedBook.author,
          category: selectedBook.category,
          stock: Number(selectedBook.stock),
        }
      );

      console.log("Updated book:", res.data);

      await fetchBooks();
      handleClose();
    } catch (err) {
      console.log(
        "Update error:",
        err.response?.data || err.message
      );
    }
  };

  
  // Delete Book
 

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/books/${id}`
      );

      await fetchBooks();
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  // Pagination

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Container className="mt-5">

      {/* Heading + Add Button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">All Books</h2>

        <Button
          variant="success"
          onClick={handleAddClick}
        >
          Add New Book
        </Button>
      </div>

      {/* Search */}
      <Form.Control
        type="text"
        placeholder="Search books..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setCurrentPage(1);
        }}
      />

      <br />

      {/* Books Table */}
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Author</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {books.length > 0 ? (
            books.map((book) => (
              <tr key={book._id}>
                <td>{book.title}</td>

                <td>{book.price}</td>

                <td>{book.author}</td>

                <td>{book.category}</td>

                <td>{book.stock}</td>

                <td>
                  {/* View */}
                  <Button
                    size="sm"
                    onClick={() =>
                      handleView(book._id)
                    }
                  >
                    View
                  </Button>{" "}

                  {/* Edit */}
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() =>
                      handleEditClick(book)
                    }
                  >
                    Edit
                  </Button>{" "}

                  {/* Delete */}
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() =>
                      handleDelete(book._id)
                    }
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No books found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="justify-content-center">

          {/* Previous */}
          <Pagination.Prev
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage(currentPage - 1)
            }
          />

          {/* Page Numbers */}
          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;

            return (
              <Pagination.Item
                key={page}
                active={page === currentPage}
                onClick={() =>
                  handlePageChange(page)
                }
              >
                {page}
              </Pagination.Item>
            );
          })}

          {/* Next */}
          <Pagination.Next
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage(currentPage + 1)
            }
          />

        </Pagination>
      )}

      {/* Modal */}
      <Modal
        show={show}
        onHide={handleClose}
      >

        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === "add" && "Add New Book"}

            {modalMode === "edit" && "Edit Book"}

            {modalMode === "view" && "Book Details"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>

          {/* 
              VIEW MODE
           */}
          {selectedBook && modalMode === "view" && (
            <div>

              <p>
                <strong>Title: </strong>
                {selectedBook.title}
              </p>

              <p>
                <strong>Price: </strong>
                {selectedBook.price}
              </p>

              <p>
                <strong>Author: </strong>
                {selectedBook.author}
              </p>

              <p>
                <strong>Category: </strong>
                {selectedBook.category}
              </p>

              <p>
                <strong>Stock: </strong>
                {selectedBook.stock}
              </p>

            </div>
          )}

          {/* 
              ADD / EDIT MODE
          */}
          {(modalMode === "add" ||
            modalMode === "edit") &&
            selectedBook && (

              <Form>

                {/* Title */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    Title
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="title"
                    value={selectedBook.title}
                    onChange={handleChange}
                    placeholder="Enter book title"
                  />
                </Form.Group>

                {/* Price */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    Price
                  </Form.Label>

                  <Form.Control
                    type="number"
                    name="price"
                    value={selectedBook.price}
                    onChange={handleChange}
                    placeholder="Enter price"
                  />
                </Form.Group>

                {/* Author */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    Author
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="author"
                    value={selectedBook.author}
                    onChange={handleChange}
                    placeholder="Enter author name"
                  />
                </Form.Group>

                {/* Category */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    Category
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="category"
                    value={selectedBook.category}
                    onChange={handleChange}
                    placeholder="Enter category"
                  />
                </Form.Group>

                {/* Stock */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    Stock
                  </Form.Label>

                  <Form.Control
                    type="number"
                    name="stock"
                    value={selectedBook.stock}
                    onChange={handleChange}
                    placeholder="Enter stock"
                  />
                </Form.Group>

              </Form>
            )}

        </Modal.Body>

        <Modal.Footer>

          {/* Close */}
          <Button
            variant="secondary"
            onClick={handleClose}
          >
            Close
          </Button>

          {/* Add */}
          {modalMode === "add" && (
            <Button
              variant="success"
              onClick={handleAdd}
            >
              Add Book
            </Button>
          )}

          {/* Update */}
          {modalMode === "edit" && (
            <Button
              variant="primary"
              onClick={handleEdit}
            >
              Update Book
            </Button>
          )}

        </Modal.Footer>

      </Modal>

    </Container>
  );
};

export default GetBook;