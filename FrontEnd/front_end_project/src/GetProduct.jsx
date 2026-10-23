import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Container, Form, Modal, Pagination, Table } from "react-bootstrap";

const GetProduct = () => {
  const [products, setProducts] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  

   const productsPerPage = 5;

  
    // Search
     const [query, setQuery] = useState("");
   
     // Pagination
     const [currentPage, setCurrentPage] = useState(1);
     const [totalPages, setTotalPages] = useState(1);
   
     const booksPerPage = 5;

  // "view", "edit", or "add"
  const [modalMode, setModalMode] = useState("");

  // Fetch Product
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/product");
      setProducts(res.data);
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

   //Search

 useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/product/search?q=${query}&page=${currentPage}&limit=${productsPerPage}`
      );

      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);

    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  fetchProducts();
}, [query, currentPage]);

  // Edit Product
  const handleEditClick = (product) => {
    setSelectedProduct({ ...product});
    setModalMode("edit");
    setShow(true);
  };

  // Add New Product
  const handleAddClick = () => {
    setSelectedProduct({
      title: "",
      price: "",
      description: "",
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
    setSelectedProduct({
      ...selectedProduct,
      [e.target.name]: e.target.value,
    });
  };

  // Add Product
  const handleAdd = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/product",
        {
          title: selectedProduct.title,
          price: Number(selectedProduct.price),
          description: selectedProduct.description,
          category: selectedProduct.category,
          stock: Number(selectedProduct.stock),
        }
      );

      console.log("Product added:", res.data);

      await fetchProducts();
      handleClose();
    } catch (err) {
      console.log(
        "Add products error:",
        err.response?.data || err.message
      );
    }
  };

  // Update Products
  const handleEdit = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/product/${selectedBook._id}`,
        {
          title: selectedBook.title,
          price: Number(selectedBook.price),
          author: selectedBook.author,
          category: selectedBook.category,
          stock: Number(selectedBook.stock),
        }
      );

      console.log("Updated product:", res.data);

      await fetchproducts();
      handleClose();
    } catch (err) {
      console.log(
        "Update error:",
        err.response?.data || err.message
      );
    }
  };
  

  // Delete Products
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/product/${id}`
      );

      await fetchProducts();
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
        <h2 className="mb-0">All Products</h2>


        <Button
          variant="success"
          onClick={handleAddClick}
        >
          Add New Product
        </Button>

      </div>


 {/* Search */}

        <Form.Control
  type="text"
  placeholder="Search products..."
  value={query}
  onChange={(e) => {
    setQuery(e.target.value);
    setCurrentPage(1);
  }}
/>

<br/>

      {/* Product Table */}
      <Table striped bordered hover variant="primary">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Description</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product._id}>

              <td>{product.title}</td>

              <td>{product.price}</td>
              <td>{product.decription}</td>

              <td>{product.category}</td>

              <td>{product.stock}</td>

              <td>

                {/* View */}
                <Button
                  size="sm"
                  onClick={() =>
                    handleView(product._id)
                  }
                >
                  View
                </Button>{" "}

                {/* Edit */}
                <Button
                  size="sm"
                  variant="warning"
                  onClick={() =>
                    handleEditClick(product)
                  }
                >
                  Edit
                </Button>{" "}

                {/* Delete */}
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() =>
                    handleDelete(product._id)
                  }
                >
                  Delete
                </Button>

              </td>
            </tr>
          ))}
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
            {modalMode === "add" && "Add New  Product"}

            {modalMode === "edit" && "Edit Product"}

            {modalMode === "view" && "Product Details"}
          </Modal.Title>

        </Modal.Header>

        <Modal.Body>

          {selectedProduct && modalMode === "view" && (
            <div>

              <p>
                <strong>Title: </strong>
                {selectedProduct.title}
              </p>

              <p>
                <strong>Price: </strong>
                {selectedProduct.price}
              </p>

              <p>
                <strong>Description: </strong>
                {selectedProduct.decription}
              </p>

              <p>
                <strong>Category: </strong>
                {selectedProduct.category}
              </p>

              <p>
                <strong>Stock: </strong>
                {selectedProduct.stock}
              </p>

            </div>
          )}

          {(modalMode === "add" ||
            modalMode === "edit") &&
            selectedProduct && (

              <Form>

                {/* Title */}
                <Form.Group className="mb-3">

                  <Form.Label>
                    Title
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="title"
                    value={selectedProduct.title}
                    onChange={handleChange}
                    placeholder="Enter Product title"
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
                    value={selectedProduct.price}
                    onChange={handleChange}
                    placeholder="Enter price"
                  />

                </Form.Group>


                 {/*    Decription*/}
                <Form.Group className="mb-3">

                  <Form.Label>
                   Description
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="description"
                    value={selectedProduct.decription}
                    onChange={handleChange}
                    placeholder="Enter author Name"
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
                    value={selectedProduct.category}
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
                    value={selectedProduct.stock}
                    onChange={handleChange}
                    placeholder="Enter stock"
                  />

                </Form.Group>

              </Form>
            )}

        </Modal.Body>

        <Modal.Footer>

          <Button
            variant="secondary"
            onClick={handleClose}
          >
            Close
          </Button>

          {/* Add Button */}
          {modalMode === "add" && (
            <Button
              variant="success"
              onClick={handleAdd}
            >
              Add Product
            </Button>
          )}

          {/* Update Button */}
          {modalMode === "edit" && (
            <Button
              variant="primary"
              onClick={handleEdit}
            >
              Update Product
            </Button>
          )}

        </Modal.Footer>

      </Modal>

    </Container>
  );
};

export default GetProduct;
