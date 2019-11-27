mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const tareaSchema = new Schema({
      nombre: { type: String },
      mensaje: { type: String },
      vendor: { type: String },
      categoria: { type: String },
      estado: { type: String }, //creado, enviado, actualizado
      fecha: {type: Date}
});

const Tarea = mongoose.model('Tarea', tareaSchema)

module.exports = Tarea;