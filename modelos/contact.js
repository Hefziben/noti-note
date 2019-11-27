mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const contactoSchema = new Schema({
      nombre: { type: String },
      apellido: { type: String },
      telefono: { type: String },
      categorias: []
});

const Contacto = mongoose.model('Contacto', contactoSchema)

module.exports = Contacto;