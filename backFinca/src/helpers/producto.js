const mongoose = require('mongoose');
const Producto = require('../models/producto');

const productoHelper = {
    
    // Verificar si existe producto por ID
    existeProductoPorId: async (id) => {
        if (!mongoose.isValidObjectId(id)) {
            throw new Error('ID inválido');
        }
        
        const existe = await Producto.findById(id);
        if (!existe) {
            throw new Error(`No existe producto con el ID: ${id}`);
        }
        return true;
    },

    // Verificar si existe producto por nombre (para crear nuevos)
    existeProductoPorNombre: async (nombre = '') => {
        const nombreLimpio = nombre.trim();
        if (!nombreLimpio) {
            throw new Error('El nombre es requerido');
        }
        
        const producto = await Producto.findOne({ 
            nombre: { $regex: new RegExp(`^${nombreLimpio}$`, 'i') }
        });
        
        if (producto) {
            throw new Error('Ya existe un producto con ese nombre');
        }
        return true;
    },

    // Verificar si existe producto por nombre para edición
    existeProductoPorNombreEditar: async (nombre = '', id) => {
        const nombreLimpio = nombre.trim();
        if (!nombreLimpio) {
            throw new Error('El nombre es requerido');
        }
        
        const producto = await Producto.findOne({ 
            nombre: { $regex: new RegExp(`^${nombreLimpio}$`, 'i') },
            _id: { $ne: id }
        });
        
        if (producto) {
            throw new Error('Ya existe otro producto con ese nombre');
        }
        return true;
    },

    // Verificar si la categoría existe
    existeCategoria: async (categoriaId) => {
        const Categoria = require('../models/categorias');
        
        if (!mongoose.isValidObjectId(categoriaId)) {
            throw new Error('ID de categoría inválido');
        }
        
        const categoria = await Categoria.findById(categoriaId);
        if (!categoria) {
            throw new Error('La categoría no existe');
        }
        return true;
    },

    // Funciones para manejo de stock (futuras implementaciones)
    reducirInventario: async (id, cantidad) => {
        const producto = await Producto.findById(id);
        if (!producto) {
            throw new Error('Producto no encontrado');
        }
        
        // Por ahora solo devolver mensaje, se puede implementar stock después
        console.log(`Reducir inventario del producto ${producto.nombre} en ${cantidad} unidades`);
        return true;
    },

    aumentarInventario: async (id, cantidad) => {
        const producto = await Producto.findById(id);
        if (!producto) {
            throw new Error('Producto no encontrado');
        }
        
        // Por ahora solo devolver mensaje, se puede implementar stock después
        console.log(`Aumentar inventario del producto ${producto.nombre} en ${cantidad} unidades`);
        return true;
    },

    // Validar precio
    validarPrecio: (precio) => {
        const precioNum = parseFloat(precio);
        if (isNaN(precioNum) || precioNum < 0) {
            throw new Error('El precio debe ser un número mayor o igual a 0');
        }
        return true;
    },

    // Validar unidad
    validarUnidad: (unidad) => {
        const unidadesValidas = ['kg', 'gramo', 'libra', 'litro', 'ml', 'unidad', 'docena', 'caja'];
        if (!unidadesValidas.includes(unidad)) {
            throw new Error(`La unidad debe ser una de: ${unidadesValidas.join(', ')}`);
        }
        return true;
    }
};

module.exports = { productoHelper };