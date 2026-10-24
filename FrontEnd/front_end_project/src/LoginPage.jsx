
import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Container, Card } from "react-bootstrap";

const Loginpage = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/auth/login",
        form
      );

      console.log("Login response:", response.data);

      // Save JWT token
      localStorage.setItem("token", response.data.token);

      setMessage("Login successful!");

      // Clear form
      setForm({
        email: "",
        password: "",
      });

    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        setMessage(
          error.response.data.message ||
          `Login failed: ${error.response.status}`
        );
      } else if (error.request) {
        setMessage(
          "Cannot connect to backend server."
        );
      } else {
        setMessage(error.message);
      }
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Card
        style={{ width: "400px" }}
        className="p-4 shadow"
      >
        <h2 className="text-center mb-4">
          Login
        </h2>

        {message && (
          <div className="alert alert-info">
            {message}
          </div>
        )}

        <Form onSubmit={handleSubmit}>

          {/* Email */}
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>

            <Form.Control
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Password */}
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>

            <Form.Control
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            className="w-100"
          >
            Login
          </Button>

        </Form>
      </Card>
    </Container>
  );
};

export default Loginpage;
