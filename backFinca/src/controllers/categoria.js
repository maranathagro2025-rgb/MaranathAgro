const Categoria = require('../models/categorias');

const httpCategorias = {
  // Listar todas las categorías
  getCategorias: async (req, res) => {
    try {
      const categorias = await Categoria.find({ estado: 1 })
        .sort({ orden: 1, nombre: 1 }); // Ordenar por orden y luego por nombre
      
      res.json({
        ok: true,
        categorias,
        total: categorias.length
      });
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      res.status(500).json({
        ok: false,
        msg: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Listar categoría por ID
  getCategoriaPorId: async (req, res) => {
    try {
      const categoria = await Categoria.findById(req.params.id);
      
      if (!categoria) {
        return res.status(404).json({
          ok: false,
          msg: 'Categoría no encontrada'
        });
      }
      
      res.json({
        ok: true,
        categoria
      });
    } catch (error) {
      console.error('Error al obtener categoría:', error);
      res.status(500).json({
        ok: false,
        msg: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Crear nueva categoría
  postCrearCategoria: async (req, res) => {
    try {
      const { 
        nombre, 
        descripcion, 
        icono, 
        color = '#4CAF50', 
        orden = 0 
      } = req.body;

      const categoria = new Categoria({ 
        nombre: nombre.trim(),
        descripcion: descripcion?.trim(),
        icono: icono?.trim(),
        color,
        orden: parseInt(orden) || 0,
        estado: 1
      });

      await categoria.save();
      
      res.status(201).json({
        ok: true,
        msg: 'Categoría creada exitosamente',
        categoria
      });
    } catch (error) {
      console.error('Error al crear categoría:', error);
      
      // Manejar error de duplicado
      if (error.code === 11000) {
        return res.status(400).json({
          ok: false,
          msg: 'Ya existe una categoría con ese nombre'
        });
      }
      
      res.status(400).json({
        ok: false,
        msg: 'Error al crear categoría',
        error: error.message
      });
    }
  },

  // Editar categoría
  putEditarCategoria: async (req, res) => {
    try {
      const { 
        nombre, 
        descripcion, 
        icono, 
        color, 
        orden 
      } = req.body;

      // Preparar datos de actualización (solo campos que vienen)
      const updateData = {};
      if (nombre) updateData.nombre = nombre.trim();
      if (descripcion !== undefined) updateData.descripcion = descripcion?.trim();
      if (icono !== undefined) updateData.icono = icono?.trim();
      if (color) updateData.color = color;
      if (orden !== undefined) updateData.orden = parseInt(orden) || 0;

      const categoria = await Categoria.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!categoria) {
        return res.status(404).json({
          ok: false,
          msg: 'Categoría no encontrada'
        });
      }

      res.json({
        ok: true,
        msg: 'Categoría actualizada exitosamente',
        categoria
      });
    } catch (error) {
      console.error('Error al editar categoría:', error);
      
      // Manejar error de duplicado
      if (error.code === 11000) {
        return res.status(400).json({
          ok: false,
          msg: 'Ya existe una categoría con ese nombre'
        });
      }
      
      res.status(400).json({
        ok: false,
        msg: 'Error al actualizar categoría',
        error: error.message
      });
    }
  },

  // Activar categoría
  putActivarCategoria: async (req, res) => {
    try {
      const categoria = await Categoria.findById(req.params.id);
      
      if (!categoria) {
        return res.status(404).json({
          ok: false,
          msg: 'Categoría no encontrada'
        });
      }

      if (categoria.estado === 1) {
        return res.status(400).json({
          ok: false,
          msg: 'La categoría ya está activa'
        });
      }

      categoria.estado = 1;
      await categoria.save();
      
      res.json({
        ok: true,
        msg: 'Categoría activada exitosamente',
        categoria
      });
    } catch (error) {
      console.error('Error al activar categoría:', error);
      res.status(500).json({
        ok: false,
        msg: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Desactivar categoría
  putDesactivarCategoria: async (req, res) => {
    try {
      const categoria = await Categoria.findById(req.params.id);
      
      if (!categoria) {
        return res.status(404).json({
          ok: false,
          msg: 'Categoría no encontrada'
        });
      }

      if (categoria.estado === 0) {
        return res.status(400).json({
          ok: false,
          msg: 'La categoría ya está inactiva'
        });
      }

      categoria.estado = 0;
      await categoria.save();
      
      res.json({
        ok: true,
        msg: 'Categoría desactivada exitosamente',
        categoria
      });
    } catch (error) {
      console.error('Error al desactivar categoría:', error);
      res.status(500).json({
        ok: false,
        msg: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Obtener categorías activas ordenadas (para frontend)
  getCategoriasActivas: async (req, res) => {
    try {
      const categorias = await Categoria.find({ estado: 1 })
        .sort({ orden: 1, nombre: 1 })
        .select('nombre descripcion icono color orden');
      
      res.json({
        ok: true,
        categorias,
        total: categorias.length
      });
    } catch (error) {
      console.error('Error al obtener categorías activas:', error);
      res.status(500).json({
        ok: false,
        msg: 'Error interno del servidor',
        error: error.message
      });
    }
  }
};

module.exports = { httpCategorias };
