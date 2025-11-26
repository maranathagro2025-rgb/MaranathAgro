const Producto = require("../models/producto");
const cloudinary = require("../utils/cloudinary.js");
const streamifier = require("streamifier");

const httpProductos = {

  // GET - Listar todos los productos
  getProductos: async (req, res) => {
    try {
      const { estado } = req.query; // ?estado=1 | 0 | all
      let filtro = {};

      if (estado === 'all') {
        // sin filtro de estado
      } else if (estado === '0' || estado === '1') {
        filtro.estado = Number(estado);
      } else {
        filtro.estado = 1; // default: solo activos (mantiene lógica previa)
      }

      const productos = await Producto.find(filtro)
        .populate("categoria", "nombre descripcion")
        .sort({ createdAt: -1 });

      const productosFormateados = productos.map(prod => ({
        ...prod._doc,
        precio_formateado: new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP'
        }).format(prod.precio)
      }));

      // Totales (útil para panel)
      const totalActivos = await Producto.countDocuments({ estado: 1 });
      const totalInactivos = await Producto.countDocuments({ estado: 0 });

      return res.json({
        ok: true,
        productos: productosFormateados,
        total: productosFormateados.length,
        meta: {
          activos: totalActivos,
            inactivos: totalInactivos
        }
      });
    } catch (error) {
      console.error('Error al obtener productos:', error);
      return res.status(500).json({
        ok: false,
        msg: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // GET - Obtener producto por ID
  getProductoById: async (req, res) => {
    const { id } = req.params;
    try {
      const producto = await Producto.findById(id)
        .populate("categoria", "nombre descripcion color");

      if (!producto) {
        return res.status(404).json({
          ok: false,
          msg: "Producto no encontrado"
        });
      }

      // Formatear precio
      const productoFormateado = {
        ...producto._doc,
        precio_formateado: new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP'
        }).format(producto.precio)
      };

      return res.json({
        ok: true,
        producto: productoFormateado
      });
    } catch (error) {
      console.error('Error al obtener producto:', error);
      return res.status(500).json({
        ok: false,
        msg: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // GET - Obtener productos destacados
  getDestacados: async (req, res) => {
    try {
      const destacados = await Producto.find({ 
        destacado: true, 
        estado: 1 
      })
        .populate("categoria", "nombre descripcion")
        .sort({ createdAt: -1 })
        .limit(10);

      const destacadosFormateados = destacados.map(prod => ({
        ...prod._doc,
        precio_formateado: new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP'
        }).format(prod.precio)
      }));

      return res.json({
        ok: true,
        productos: destacadosFormateados,
        total: destacadosFormateados.length
      });
    } catch (error) {
      console.error('Error al obtener destacados:', error);
      return res.status(500).json({
        ok: false,
        msg: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // POST - Crear nuevo producto
  postInsertarProducto: async (req, res) => {
    try {
      const {
        nombre,
        descripcion,
        precio,
        unidad,
        presentacion,
        categoria,
        esOrganico,
        origen,
        destacado
      } = req.body;

      // Función para subir imagen a Cloudinary
      const subirACloudinary = (fileBuffer) => {
        return new Promise((resolve, reject) => {
          const upload_stream = cloudinary.uploader.upload_stream(
            { 
              folder: 'productos',
              transformation: [
                { width: 800, height: 600, crop: 'fit' },
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

      // Crear nuevo producto
      const nuevoProducto = new Producto({
        nombre: nombre.trim(),
        descripcion: descripcion?.trim(),
        precio: parseFloat(precio),
        unidad,
        presentacion: Number(presentacion),
        categoria,
        esOrganico: esOrganico === 'true' || esOrganico === true,
        origen: origen?.trim(),
        imagenes: imagenesArr,
        imagenPrincipal,
        destacado: destacado === 'true' || destacado === true,

        estado: 1
      });

      await nuevoProducto.save();

      // Poblar categoria para respuesta
      await nuevoProducto.populate("categoria", "nombre descripcion");

      res.status(201).json({
        ok: true,
        msg: 'Producto creado exitosamente',
        producto: {
          ...nuevoProducto._doc,
          precio_formateado: new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP'
          }).format(nuevoProducto.precio)
        }
      });

    } catch (error) {
      console.error('Error al crear producto:', error);
      res.status(500).json({
        ok: false,
        msg: 'Error al crear el producto',
        error: error.message
      });
    }
  },

  // PUT - Editar producto
  putEditarProducto: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        nombre,
        descripcion,
        precio,
        unidad,
        presentacion,
        categoria,
        esOrganico,
        origen,
        destacado
      } = req.body;

      // Buscar producto actual
      const productoActual = await Producto.findById(id);
      if (!productoActual) {
        return res.status(404).json({
          ok: false,
          msg: "Producto no encontrado"
        });
      }

      // Función para subir imagen a Cloudinary
      const subirACloudinary = (fileBuffer) => {
        return new Promise((resolve, reject) => {
          const upload_stream = cloudinary.uploader.upload_stream(
            { 
              folder: 'productos',
              transformation: [
                { width: 800, height: 600, crop: 'fit' },
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
      let imagenesArr = productoActual.imagenes || [];
      let imagenPrincipal = productoActual.imagenPrincipal;

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
        ...(nombre && { nombre: nombre.trim() }),
        ...(descripcion !== undefined && { descripcion: descripcion?.trim() }),
        ...(precio && { precio: parseFloat(precio) }),
        ...(unidad && { unidad }),
        ...(categoria && { categoria }),
        ...(presentacion && { presentacion: Number(presentacion) }),
        ...(esOrganico !== undefined && { esOrganico: esOrganico === 'true' || esOrganico === true }),
        ...(origen !== undefined && { origen: origen?.trim() }),
        ...(destacado !== undefined && { destacado: destacado === 'true' || destacado === true }),
        imagenes: imagenesArr,
        imagenPrincipal
      };

      // Actualizar producto
      const productoActualizado = await Producto.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).populate("categoria", "nombre descripcion");

      res.json({
        ok: true,
        msg: "Producto actualizado exitosamente",
        producto: {
          ...productoActualizado._doc,
          precio_formateado: new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP'
          }).format(productoActualizado.precio)
        }
      });

    } catch (error) {
      console.error('Error al editar producto:', error);
      res.status(500).json({
        ok: false,
        msg: "Error al editar el producto",
        error: error.message
      });
    }
  },

  // DELETE - Eliminar imagen de producto
  deleteImagenProducto: async (req, res) => {
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

    // Buscar el producto por ID
    const producto = await Producto.findById(id);
    
    if (!producto) {
      return res.status(404).json({
        ok: false,
        msg: 'Producto no encontrado'
      });
    }

    // Verificar que el producto tenga imágenes
    if (!producto.imagenes || producto.imagenes.length === 0) {
      return res.status(400).json({
        ok: false,
        msg: 'El producto no tiene imágenes'
      });
    }

    // Verificar que el índice esté dentro del rango
    if (imagenIndex >= producto.imagenes.length) {
      return res.status(400).json({
        ok: false,
        msg: `Índice de imagen fuera de rango. El producto tiene ${producto.imagenes.length} imagen(es)`
      });
    }

    // Obtener la URL de la imagen a eliminar
    const imagenAEliminar = producto.imagenes[imagenIndex];

    // Eliminar imagen del array
    producto.imagenes.splice(imagenIndex, 1);

    // Si la imagen eliminada era la principal, asignar la primera imagen disponible
    if (producto.imagenPrincipal === imagenAEliminar) {
      producto.imagenPrincipal = producto.imagenes.length > 0 ? producto.imagenes[0] : null;
    }

    // Guardar cambios
    await producto.save();

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
      producto: {
        _id: producto._id,
        nombre: producto.nombre,
        imagenes: producto.imagenes,
        imagenPrincipal: producto.imagenPrincipal,
        totalImagenes: producto.imagenes.length
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

  // PUT - Activar producto
  putActivarProducto: async (req, res) => {
    try {
      const { id } = req.params;

      const producto = await Producto.findById(id);
      if (!producto) {
        return res.status(404).json({
          ok: false,
          msg: "Producto no encontrado"
        });
      }

      if (producto.estado === 1) {
        return res.status(400).json({
          ok: false,
          msg: "El producto ya está activo"
        });
      }

      producto.estado = 1;
      await producto.save();

      res.json({
        ok: true,
        msg: "Producto activado correctamente",
        producto
      });

    } catch (error) {
      console.error('Error al activar producto:', error);
      res.status(500).json({
        ok: false,
        msg: "Error al activar producto",
        error: error.message
      });
    }
  },

  // PUT - Desactivar producto
  putDesactivarProducto: async (req, res) => {
    try {
      const { id } = req.params;

      const producto = await Producto.findById(id);
      if (!producto) {
        return res.status(404).json({
          ok: false,
          msg: "Producto no encontrado"
        });
      }

      if (producto.estado === 0) {
        return res.status(400).json({
          ok: false,
          msg: "El producto ya está inactivo"
        });
      }

      producto.estado = 0;
      await producto.save();

      res.json({
        ok: true,
        msg: "Producto desactivado correctamente",
        producto
      });

    } catch (error) {
      console.error('Error al desactivar producto:', error);
      res.status(500).json({
        ok: false,
        msg: "Error al desactivar producto",
        error: error.message
      });
    }
  },

  // DELETE - Eliminar producto
  deleteProducto: async (req, res) => {
    try {
      const { id } = req.params;

      const producto = await Producto.findByIdAndDelete(id);
      if (!producto) {
        return res.status(404).json({
          ok: false,
          msg: 'Producto no encontrado'
        });
      }

      res.json({
        ok: true,
        msg: 'Producto eliminado correctamente',
        producto
      });

    } catch (error) {
      console.error('Error al eliminar producto:', error);
      res.status(500).json({
        ok: false,
        msg: 'Error al eliminar producto',
        error: error.message
      });
    }
  }

};

module.exports = { httpProductos };