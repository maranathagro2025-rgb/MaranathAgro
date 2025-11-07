const mongoose = require('mongoose');
const Categoria = require('../models/categorias');

const CategoriaHelper = {
  
  // Verificar si existe categoría por nombre
  existeCategoriaPorNombre: async (nombre = '') => {
    const nombreLimpio = nombre.trim();
    if (!nombreLimpio) {
      throw new Error('El nombre es requerido');
    }

    const existe = await Categoria.findOne({ 
      nombre: { $regex: new RegExp(`^${nombreLimpio}$`, 'i') }
    });
    
    if (existe) {
      throw new Error('Ya existe una categoría con ese nombre');
    }
    return true;
  },

  // Verificar si existe categoría por nombre para edición
  existeCategoriaPorNombreEditar: async (nombre = '', id) => {
    const nombreLimpio = nombre.trim();
    if (!nombreLimpio) {
      throw new Error('El nombre es requerido');
    }

    const existe = await Categoria.findOne({ 
      nombre: { $regex: new RegExp(`^${nombreLimpio}$`, 'i') },
      _id: { $ne: id }
    });
    
    if (existe) {
      throw new Error('Ya existe otra categoría con ese nombre');
    }
    return true;
  },

  // Verificar si existe categoría por ID
  existeCategoriaPorId: async (id) => {
    if (!mongoose.isValidObjectId(id)) {
      throw new Error('ID inválido');
    }
    
    const existe = await Categoria.findById(id);
    if (!existe) {
      throw new Error(`No existe categoría con el ID: ${id}`);
    }
    return true;
  },

  // Validar color hexadecimal
  validarColor: (color) => {
    const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (color && !colorRegex.test(color)) {
      throw new Error('El color debe ser un código hexadecimal válido (ej: #4CAF50)');
    }
    return true;
  },

  // Validar orden
  validarOrden: (orden) => {
    const ordenNum = parseInt(orden);
    if (orden !== undefined && (isNaN(ordenNum) || ordenNum < 0)) {
      throw new Error('El orden debe ser un número mayor o igual a 0');
    }
    return true;
  },

  // Validar que no haya productos asociados antes de eliminar
  tieneProductosAsociados: async (categoriaId) => {
    const Producto = require('../models/producto');
    
    const productosCount = await Producto.countDocuments({ 
      categoria: categoriaId,
      estado: 1 
    });
    
    if (productosCount > 0) {
      throw new Error(`No se puede eliminar la categoría porque tiene ${productosCount} producto(s) asociado(s)`);
    }
    return false;
  }
};

module.exports = { CategoriaHelper };