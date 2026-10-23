import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <Navbar bg="primary" data-bs-theme="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Navbar
        </Navbar.Brand>

        <Nav>
          <Nav.Link as={Link} to="/getuser">
            Users
          </Nav.Link>


         

          <Nav.Link as={Link} to="/getproduct">
        Getproduct
          </Nav.Link>

             <Nav.Link as={Link} to="/books">
             Books
          </Nav.Link>

        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;