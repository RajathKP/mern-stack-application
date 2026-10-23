import React from "react";
import "./App.css";
import CreateUser from "./CreateUser";
import GetUser from "./GetUser";
import Header from "./Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GetProduct from "./GetProduct";
import Product from "./Product";
import Books from "./Books";

function App() {
  return (
    <BrowserRouter>
      <Header/>

      <Routes>
        <Route path="/createuser" element={<CreateUser/>} />
        <Route path="/getuser" element={<GetUser/>} />
        <Route path="/product" element={<Product/>} />
        <Route path="/getproduct" element={<GetProduct/>} />

        <Route path="/books" element={<Books/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;