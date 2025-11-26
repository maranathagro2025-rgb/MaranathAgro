const mongoose = require('mongoose');

const CategoriaSchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true 
  },  // Ej: "Hortalizas", "Frutas", "Lácteos", "Cereales"
  descripcion: { type: String, trim: true },
  icono: { type: String }, // Nombre del icono o URL
  orden: { type: Number, default: 0 }, // Para ordenar categorías
  estado: { type: Number, required: true, default: 1 }, // 1 = Activo, 0 = Inactivo
}, { timestamps: true });


module.exports = mongoose.model("Categoria", CategoriaSchema);

