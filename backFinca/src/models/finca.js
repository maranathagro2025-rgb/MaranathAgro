const mongoose = require('mongoose');

const FincaSchema = new mongoose.Schema({
  // Información básica
  nombre: { type: String, required: true },
  ubicacion: { type: String, required: true },
  descripcion: { type: String },
  
  // Información institucional
  mision: { type: String },
  vision: { type: String },
  objetivos: [{ type: String }], // Array de objetivos
  alcance: { type: String },
  
  // Información de contacto
  telefono: { type: String },
  email: { type: String },
  direccion: { type: String },
  
  // Redes sociales
  instagram: { type: String },
  facebook: { type: String },
  whatsapp: { type: String },
  
  // Información adicional
  horarioAtencion: { type: String },
  tipoProductos: [{ type: String }], // Ej: ["Orgánicos", "Tradicionales", "Procesados"]
  certificaciones: [{ type: String }], // Ej: ["Orgánico", "ICA", "INVIMA"]
  
  // Multimedia
  logo: { type: String }, // URL del logo
  imagenesFinca: [{ type: String }], // Array de imágenes de la finca
  // Configuración
  estado: { type: Number, default: 1 }, // 1 = Activo, 0 = Inactivo
}, { timestamps: true });

module.exports = mongoose.model("Finca", FincaSchema);


