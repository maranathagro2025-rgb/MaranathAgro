const Publicacion = require("../models/publicacion");

const publicacionHelper = {
  
  // Verificar si existe publicación por ID
  existePublicacionPorId: async (id) => {
    const existe = await Publicacion.findById(id);
    if (!existe) {
      throw new Error(`La publicación con ID ${id} no existe`);
    }
    return true;
  },

  // Verificar si existe publicación por título (para evitar duplicados)
  existePublicacionPorTitulo: async (titulo) => {
    const existe = await Publicacion.findOne({ 
      titulo: new RegExp(`^${titulo}$`, 'i') 
    });
    if (existe) {
      throw new Error(`Ya existe una publicación con el título: ${titulo}`);
    }
    return true;
  }
};

module.exports = { publicacionHelper };
