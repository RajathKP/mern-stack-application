
const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  price: Number,

   description: String,
   

  category: {
    type: String,
    required: true
  },
  stock: Number

})


const Product=mongoose.model("Product",productSchema)
module.exports=Product