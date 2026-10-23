
const mongoose = require("mongoose")

const bookSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  price: Number,

   author:{
    type: String,
    required: true
  },
   

  category: {
    type: String,
    required: true
  },
  stock: Number

})


const Book=mongoose.model("Book",bookSchema)
module.exports=Book