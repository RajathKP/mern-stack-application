import axios, { Axios } from 'axios'
import React, { useState } from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';


const CreateUser = () => {

  const [form, setform] = useState({

    name:"",
    age:"",
    email:"",
  })
  // Handle Input change

  const handleChange = (e)=>{
    setform({
      ... form,
      [e.target.name]:e.target.value,
    })

  }
  console.log(form);
  

  // Handle form submit

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/users", form);
      alert("User Created");

      // reset form

      setform({
        name: "",
        age: "",
        email: "",
      });
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div>


     <h1 style={{ textAlign: "center" }}>Create User</h1>
        <Form onSubmit={handleSubmit}style={{width: "100%", marginLeft: "40px" ,marginTop: "30px"}}>
    
    
            <Form.Group className="mb-3" controlId="formBasicName" style={{ width: "40%" }}>
            <Form.Label>Name</Form.Label>
            <Form.Control 
            type="text" 
            size="lg"
            name="name"
            placeholder='Enter name'
            value={form.name}
            onChange={handleChange}required
            />

          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword" style={{ width: "40%" }} >
            <Form.Label>Age</Form.Label>
            <Form.Control 
            type="number" 
            size="lg"
            name="age"
            placeholder='Enter Age'
            value={form.age}
            onChange={handleChange}required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail" style={{ width: "40%" }}>
            <Form.Label>E-mail</Form.Label>
            <Form.Control 
            type="email"
            size="lg"
            name="email" 
            placeholder="Enter email"
            value={form.email} 
            onChange={handleChange}required
            />
              
          </Form.Group>
          
          <Button variant="primary" type="submit">
            Create User
          </Button>
        </Form>

    </div>
  )
}

export default CreateUser