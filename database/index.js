// Mongoose
const mongoose = require("mongoose");
require('dotenv').config()

// Conectar mongoose con MongoDB
const db_url = process.env.URI


mongoose.connect(db_url, { useNewUrlParser: true, useUnifiedTopology: true }, err => {
  if (!err) {
    console.log("Conexion exitosa a MongoDB!!");
  } else {
    console.log('algo estas mal con la base de datos');
  }
});