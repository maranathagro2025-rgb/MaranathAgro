const Publicacion = require("../models/publicacion");
const cloudinary = require("../utils/cloudinary.js");
const streamifier = require("streamifier");

const httpPublicaciones = {

  // GET - Listar todas las publicaciones
  getPublicaciones: async (req, res) => {
  try {
    const { estado } = req.query; // ?estado=1 o ?estado=0
    const filtro = estado !== undefined ? { estado: parseInt(estado) } : {};
    
    const publicaciones = await Publicacion.find(filtro)
      .sort({ fechaPublicacion: -1 });

    return res.json({
      ok: true,
      publicaciones,
      total: publicaciones.length
    });
  } catch (error) {
    console.error('Error al obtener publicaciones:', error);
    return res.status(500).json({
      ok: false,
      msg: 'Error interno del servidor',
      error: error.message
    });
  }
},



  // POST - Crear nueva publicación
  postInsertarPublicacion: async (req, res) => {
    try {
      const {
        titulo,
        descripcion,
        contenido,
        tipo,
        destacada,
        autor
      } = req.body;

      // Función para subir imagen a Cloudinary
      const subirACloudinary = (fileBuffer) => {
        return new Promise((resolve, reject) => {
          const upload_stream = cloudinary.uploader.upload_stream(
            { 
              folder: 'publicaciones',
              transformation: [
                { width: 1200, height: 800, crop: 'fit' },
                { quality: 'auto' }
              ]
            },
            (error, result) => {
              if (result) resolve(result.secure_url);
              else reject(error);
            }
          );
          streamifier.createReadStream(fileBuffer).pipe(upload_stream);
        });
      };

      // Manejar múltiples imágenes
      let imagenesArr = [];
      let imagenPrincipal = null;

      if (req.files && req.files.length > 0) {
        // Subir todas las imágenes
        imagenesArr = await Promise.all(
          req.files.map((file) => subirACloudinary(file.buffer))
        );
        // La primera imagen será la principal
        imagenPrincipal = imagenesArr[0];
      }

      // Crear nueva publicación
      const nuevaPublicacion = new Publicacion({
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        contenido: contenido?.trim(),
        tipo: tipo || 'general',
        imagenes: imagenesArr,
        imagenPrincipal,
        destacada: destacada === 'true' || destacada === true || false,
        autor: autor?.trim() || 'Maranatha Agro',
        vistas: 0,
        estado: 1,
        fechaPublicacion: new Date()
      });

      await nuevaPublicacion.save();

      res.status(201).json({
        ok: true,
        msg: 'Publicación creada exitosamente',
        publicacion: nuevaPublicacion
      });

    } catch (error) {
      console.error('Error al crear publicación:', error);
      res.status(500).json({
        ok: false,
        msg: 'Error al crear la publicación',
        error: error.message
      });
    }
  },

  // PUT - Editar publicación
  putEditarPublicacion: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        titulo,
        descripcion,
        contenido,
        tipo,
        destacada,
        autor
      } = req.body;

      // Buscar publicación actual
      const publicacionActual = await Publicacion.findById(id);
      if (!publicacionActual) {
        return res.status(404).json({
          ok: false,
          msg: "Publicación no encontrada"
        });
      }

      // Función para subir imagen a Cloudinary
      const subirACloudinary = (fileBuffer) => {
        return new Promise((resolve, reject) => {
          const upload_stream = cloudinary.uploader.upload_stream(
            { 
              folder: 'publicaciones',
              transformation: [
                { width: 1200, height: 800, crop: 'fit' },
                { quality: 'auto' }
              ]
            },
            (error, result) => {
              if (result) resolve(result.secure_url);
              else reject(error);
            }
          );
          streamifier.createReadStream(fileBuffer).pipe(upload_stream);
        });
      };

      // Manejar imágenes
      let imagenesArr = publicacionActual.imagenes || [];
      let imagenPrincipal = publicacionActual.imagenPrincipal;

      if (req.files && req.files.length > 0) {
        // Subir nuevas imágenes
        const nuevasImagenes = await Promise.all(
          req.files.map((file) => subirACloudinary(file.buffer))
        );
        
        // Agregar nuevas imágenes al inicio
        imagenesArr = [...nuevasImagenes, ...imagenesArr];
        
        // La primera nueva imagen será la principal
        imagenPrincipal = nuevasImagenes[0];
      }

      // Preparar datos de actualización
      const updateData = {
        ...(titulo && { titulo: titulo.trim() }),
        ...(descripcion && { descripcion: descripcion.trim() }),
        ...(contenido !== undefined && { contenido: contenido?.trim() }),
        ...(tipo && { tipo }),
        ...(destacada !== undefined && { destacada: destacada === 'true' || destacada === true }),
        ...(autor !== undefined && { autor: autor?.trim() }),
        imagenes: imagenesArr,
        imagenPrincipal
      };

      // Actualizar publicación
      const publicacionActualizada = await Publicacion.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      res.json({
        ok: true,
        msg: "Publicación actualizada exitosamente",
        publicacion: publicacionActualizada
      });

    } catch (error) {
      console.error('Error al editar publicación:', error);
      res.status(500).json({
        ok: false,
        msg: "Error al editar la publicación",
        error: error.message
      });
    }
  },

  // DELETE - Eliminar imagen de publicación
  deleteImagenPublicacion: async (req, res) => {
    try {
      const { id, index } = req.params;
      const imagenIndex = parseInt(index);

      // Validar índice
      if (isNaN(imagenIndex) || imagenIndex < 0) {
        return res.status(400).json({
          ok: false,
          msg: 'Índice de imagen inválido'
        });
      }

      // Buscar la publicación por ID
      const publicacion = await Publicacion.findById(id);
      
      if (!publicacion) {
        return res.status(404).json({
          ok: false,
          msg: 'Publicación no encontrada'
        });
      }

      // Verificar que la publicación tenga imágenes
      if (!publicacion.imagenes || publicacion.imagenes.length === 0) {
        return res.status(400).json({
          ok: false,
          msg: 'La publicación no tiene imágenes'
        });
      }

      // Verificar que el índice esté dentro del rango
      if (imagenIndex >= publicacion.imagenes.length) {
        return res.status(400).json({
          ok: false,
          msg: `Índice de imagen fuera de rango. La publicación tiene ${publicacion.imagenes.length} imagen(es)`
        });
      }

      // Obtener la URL de la imagen a eliminar
      const imagenAEliminar = publicacion.imagenes[imagenIndex];

      // Eliminar imagen del array
      publicacion.imagenes.splice(imagenIndex, 1);

      // Si la imagen eliminada era la principal, asignar la primera imagen disponible
      if (publicacion.imagenPrincipal === imagenAEliminar) {
        publicacion.imagenPrincipal = publicacion.imagenes.length > 0 ? publicacion.imagenes[0] : null;
      }

      // Guardar cambios
      await publicacion.save();

      // Opcional: Eliminar imagen de Cloudinary
      try {
        const urlParts = imagenAEliminar.split('/');
        const filename = urlParts[urlParts.length - 1];
        const publicId = filename.split('.')[0];
        const folder = urlParts[urlParts.length - 2];
        const fullPublicId = `${folder}/${publicId}`;
        
        await cloudinary.uploader.destroy(fullPublicId);
      } catch (cloudinaryError) {
        console.error('Error al eliminar de Cloudinary:', cloudinaryError);
        // No devolvemos error porque la imagen ya se eliminó de la BD
      }

      res.json({
        ok: true,
        msg: 'Imagen eliminada exitosamente',
        publicacion: {
          _id: publicacion._id,
          titulo: publicacion.titulo,
          imagenes: publicacion.imagenes,
          imagenPrincipal: publicacion.imagenPrincipal,
          totalImagenes: publicacion.imagenes.length
        }
      });

    } catch (error) {
      console.error('Error al eliminar imagen:', error);
      res.status(500).json({
        ok: false,
        msg: 'Error al eliminar imagen',
        error: error.message
      });
    }
  },

  // PUT - Activar publicación
  putActivarPublicacion: async (req, res) => {
    try {
      const { id } = req.params;

      const publicacion = await Publicacion.findById(id);
      if (!publicacion) {
        return res.status(404).json({
          ok: false,
          msg: "Publicación no encontrada"
        });
      }

      if (publicacion.estado === 1) {
        return res.status(400).json({
          ok: false,
          msg: "La publicación ya está activa"
        });
      }

      publicacion.estado = 1;
      await publicacion.save();

      res.json({
        ok: true,
        msg: "Publicación activada correctamente",
        publicacion
      });

    } catch (error) {
      console.error('Error al activar publicación:', error);
      res.status(500).json({
        ok: false,
        msg: "Error al activar publicación",
        error: error.message
      });
    }
  },

  // PUT - Desactivar publicación
  putDesactivarPublicacion: async (req, res) => {
    try {
      const { id } = req.params;

      const publicacion = await Publicacion.findById(id);
      if (!publicacion) {
        return res.status(404).json({
          ok: false,
          msg: "Publicación no encontrada"
        });
      }

      if (publicacion.estado === 0) {
        return res.status(400).json({
          ok: false,
          msg: "La publicación ya está inactiva"
        });
      }

      publicacion.estado = 0;
      await publicacion.save();

      res.json({
        ok: true,
        msg: "Publicación desactivada correctamente",
        publicacion
      });

    } catch (error) {
      console.error('Error al desactivar publicación:', error);
      res.status(500).json({
        ok: false,
        msg: "Error al desactivar publicación",
        error: error.message
      });
    }
  },

  // DELETE - Eliminar publicación
  deletePublicacion: async (req, res) => {
    try {
      const { id } = req.params;

      const publicacion = await Publicacion.findByIdAndDelete(id);
      if (!publicacion) {
        return res.status(404).json({
          ok: false,
          msg: 'Publicación no encontrada'
        });
      }

      // Opcional: Eliminar imágenes de Cloudinary
      if (publicacion.imagenes && publicacion.imagenes.length > 0) {
        for (const imagenUrl of publicacion.imagenes) {
          try {
            const urlParts = imagenUrl.split('/');
            const filename = urlParts[urlParts.length - 1];
            const publicId = filename.split('.')[0];
            const folder = urlParts[urlParts.length - 2];
            const fullPublicId = `${folder}/${publicId}`;
            
            await cloudinary.uploader.destroy(fullPublicId);
          } catch (cloudinaryError) {
            console.error('Error al eliminar imagen de Cloudinary:', cloudinaryError);
          }
        }
      }

      res.json({
        ok: true,
        msg: 'Publicación eliminada correctamente',
        publicacion
      });

    } catch (error) {
      console.error('Error al eliminar publicación:', error);
      res.status(500).json({
        ok: false,
        msg: 'Error al eliminar publicación',
        error: error.message
      });
    }
  }

};

module.exports = { httpPublicaciones };
