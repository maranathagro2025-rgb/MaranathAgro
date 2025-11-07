const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
  // Información básica
  nombre: { type: String, required: true, trim: true },
  descripcion: { type: String, trim: true },
  precio: { type: Number, required: true, min: 0 },
  unidad: { 
    type: String, 
    required: true,
    enum: ['kg', 'gramo', 'libra', 'litro', 'ml', 'unidad', 'docena', 'caja'],
    default: "unidad" 
  },
  
  // Relaciones
  categoria: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Categoria", 
    required: true 
  },

  // Información adicional del producto
  esOrganico: { type: Boolean, default: false },
  origen: { type: String }, // Ej: "Colombia", "México"

  // Multimedia
  imagenes: [{ type: String }], // Array de URLs de imágenes
  imagenPrincipal: { type: String }, // URL de la imagen principal
  // Configuración
  destacado: { type: Boolean, default: false }, // Para productos destacados
  descuento: { type: Number, default: 0, min: 0, max: 100 }, // Porcentaje de descuento
  estado: { type: Number, default: 1 }, // 1 = Activo, 0 = Inactivo
  
}, { timestamps: true });

module.exports = mongoose.model("Producto", ProductoSchema);
