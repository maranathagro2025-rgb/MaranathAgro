const mongoose = require('mongoose');

const PublicacionSchema = new mongoose.Schema({

  titulo: { 
    type: String, 
    required: true,
    trim: true
  },
  descripcion: { 
    type: String, 
    required: true,
    trim: true
  },
  tipo: {
    type: String,
    enum: ['noticia', 'evento', 'producto_nuevo', 'tips', 'cosecha', 'general'],
    default: 'general'
  },

  imagenes: [{ type: String }],
  estado: { type: Number, default: 1 },
  fechaPublicacion: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("Publicacion", PublicacionSchema);