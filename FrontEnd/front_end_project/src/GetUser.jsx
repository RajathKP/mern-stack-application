
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Container, Form, Modal, Table } from "react-bootstrap";

const GetUser = () => {
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/users");
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // View User
  const handleView = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/users/${id}`);

      setSelectedUser(res.data);
      setIsEdit(false);
      setShow(true);
    } catch (err) {
      console.log(err);
    }
  };

  // Edit Click
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsEdit(true);
    setShow(true);
  };

  // Close Modal
  const handleClose = () => {
    setShow(false);
    setSelectedUser(null);
    setIsEdit(false);
  };

  // Update User
  const handleEdit = async () => {
  try {
    const res = await axios.put(
      `http://localhost:5000/users/${selectedUser._id}`,
      {
        name: selectedUser.name,
        email: selectedUser.email,
        age: Number(selectedUser.age),
      }
    );

    console.log("Updated user:", res.data);

    await fetchUsers();
    handleClose();
  } catch (err) {
    console.log("Update error:", err.response?.data || err.message);
  }
};

  // Delete User
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/users/${id}`);

      await fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  // Handle Input Change
  const handleChange = (e) => {
    setSelectedUser({
      ...selectedUser,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">All Users</h2>

      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.age}</td>

              <td>
                {/* View */}
                <Button
                  size="sm"
                  onClick={() => handleView(user._id)}
                >
                  View
                </Button>{" "}

                {/* Edit */}
                <Button
                  size="sm"
                  variant="warning"
                  onClick={() => handleEditClick(user)}
                >
                  Edit
                </Button>{" "}

                {/* Delete */}
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(user._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEdit ? "Edit User" : "User Details"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedUser &&
            (isEdit ? (
              <Form>
                {/* Name */}
                <Form.Group className="mb-2">
                  <Form.Label>Name</Form.Label>

                  <Form.Control
                    name="name"
                    value={selectedUser.name}
                    onChange={handleChange}
                  />
                </Form.Group>

                {/* Email */}
                <Form.Group className="mb-2">
                  <Form.Label>Email</Form.Label>

                  <Form.Control
                    name="email"
                    value={selectedUser.email}
                    onChange={handleChange}
                  />
                </Form.Group>

                {/* Age */}
                <Form.Group className="mb-2">
                  <Form.Label>Age</Form.Label>

                  <Form.Control
                    name="age"
                    type="number"
                    value={selectedUser.age}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Form>
            ) : (
              <div>
                <p>
                  <strong>Name: </strong>
                  {selectedUser.name}
                </p>

                <p>
                  <strong>Email: </strong>
                  {selectedUser.email}
                </p>

                <p>
                  <strong>Age: </strong>
                  {selectedUser.age}
                </p>
              </div>
            ))}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>

          {isEdit && (
            <Button variant="primary" onClick={handleEdit}>
              Update
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default GetUser;





