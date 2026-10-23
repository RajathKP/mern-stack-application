import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';

const Product = () => {
  const [form, setForm] = useState({
    title: '',
    price: '',
    description: '',
    category: '',
    stock: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/product', form);
      alert('Product Created');
      setForm({ title: '', price: '', description: '', category: '', stock: '' });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Create Product</h1>
      <Form onSubmit={handleSubmit} style={{ width: '100%', marginLeft: '40px', marginTop: '30px' }}>
        <Form.Group className="mb-3" controlId="formBasicName" style={{ width: '40%' }}>
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" size="lg" name="title" placeholder="Enter product title" value={form.title} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPrice" style={{ width: '40%' }}>
          <Form.Label>Price</Form.Label>
          <Form.Control type="number" size="lg" name="price" placeholder="Enter Price" value={form.price} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicDescription" style={{ width: '40%' }}>
          <Form.Label>Description</Form.Label>
          <Form.Control type="text" size="lg" name="description" placeholder="Enter description" value={form.description} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicCategory" style={{ width: '40%' }}>
          <Form.Label>Category</Form.Label>
          <Form.Control type="text" size="lg" name="category" placeholder="Enter category" value={form.category} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicStock" style={{ width: '40%' }}>
          <Form.Label>Stock</Form.Label>
          <Form.Control type="number" size="lg" name="stock" placeholder="Enter stock" value={form.stock} onChange={handleChange} required />
        </Form.Group>

        <Button variant="primary" type="submit">Create Product</Button>
      </Form>
    </div>
  );
};

export default Product