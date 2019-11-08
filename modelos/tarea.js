mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const tareaSchema = new Schema({
      nombre: { type: String },
      mensaje: { type: String },
      telefono: { type: String },
      estado: { type: String }, //creada, enviada
});

const Tarea = mongoose.model('Tarea', tareaSchema)

module.exports = Tarea;