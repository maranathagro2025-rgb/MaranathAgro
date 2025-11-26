const Finca = require('../models/finca');
const cloudinary = require('../utils/cloudinary');
const streamifier = require('streamifier');

const httpFincas = {

  // GET - Obtener información de la finca
  getFinca: async (req, res) => {
    try {
      // Como es una sola finca, obtenemos la primera activa o la creamos si no existe
      let finca = await Finca.findOne({ estado: 1 });
      
      if (!finca) {
        // Si no existe, crear una finca por defecto
        finca = new Finca({
          nombre: "Mi Finca",
          ubicacion: "Por definir",
          descripcion: "Descripción de la finca por definir",
          estado: 1
        });
        await finca.save();
      }

      res.json({
        ok: true,
        finca
      });
    } catch (error) {
      console.error('Error al obtener finca:', error);
      res.status(500).json({
        ok: false,
        msg: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // POST - Crear información de finca (solo si no existe)
  postCrearFinca: async (req, res) => {
    try {
      // Verificar si ya existe una finca
      const fincaExistente = await Finca.findOne();
      if (fincaExistente) {
        return res.status(400).json({
          ok: false,
          msg: 'Ya existe información de la finca. Use PUT para actualizar.'
        });
      }

      const {
        nombre,
        ubicacion, 
        descripcion,
        mision,
        vision,
        objetivos,
        alcance,
        telefono,
        email,
        direccion,
        instagram,
        facebook,
        whatsapp,
        horarioAtencion,
        tipoProductos,
        certificaciones
      } = req.body;

      // Función para subir imagen a Cloudinary
      const subirACloudinary = (fileBuffer) => {
        return new Promise((resolve, reject) => {
          const upload_stream = cloudinary.uploader.upload_stream(
            { 
              folder: 'finca',
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
      let logoUrl = null;
      let imagenesFincaArr = [];

      if (req.files) {
        // Si hay archivo de logo
        if (req.files.logo && req.files.logo[0]) {
          logoUrl = await subirACloudinary(req.files.logo[0].buffer);
        }

        // Si hay imágenes de la finca
        if (req.files.imagenesFinca && req.files.imagenesFinca.length > 0) {
          imagenesFincaArr = await Promise.all(
            req.files.imagenesFinca.map(file => subirACloudinary(file.buffer))
          );
        }
      }

      // Crear nueva finca
      const nuevaFinca = new Finca({
        nombre: nombre?.trim(),
        ubicacion: ubicacion?.trim(), 
        descripcion: descripcion?.trim(),
        mision: mision?.trim(),
        vision: vision?.trim(),
        telefono: telefono?.trim(),
        email: email?.trim(),
        direccion: direccion?.trim(),
        instagram: instagram?.trim(),
        facebook: facebook?.trim(),
        whatsapp: whatsapp?.trim(),
        horarioAtencion: horarioAtencion?.trim(),
        tipoProductos: Array.isArray(tipoProductos) ? tipoProductos.filter(tipo => tipo.trim()) : [],
        certificaciones: Array.isArray(certificaciones) ? certificaciones.filter(cert => cert.trim()) : [],
        logo: logoUrl,
        imagenesFinca: imagenesFincaArr,
        estado: 1
      });

      await nuevaFinca.save();

      res.status(201).json({
        ok: true,
        msg: 'Información de finca creada exitosamente',
        finca: nuevaFinca
      });

    } catch (error) {
      console.error('Error al crear finca:', error);
      res.status(500).json({
        ok: false,
        msg: 'Error al crear información de finca',
        error: error.message
      });
    }
  },

  // PUT - Actualizar información de la finca
  putActualizarFinca: async (req, res) => {
    try {
      const {
        nombre,
        ubicacion, 
        descripcion,
        mision,
        vision,
        alcance,
        telefono,
        email,
        direccion,
        instagram,
        facebook,
        whatsapp,
        horarioAtencion,
        tipoProductos,
        certificaciones
      } = req.body;

      // Buscar la finca existente
      let finca = await Finca.findOne({ estado: 1 });
      if (!finca) {
        return res.status(404).json({
          ok: false,
          msg: 'No se encontró información de la finca'
        });
      }

      // Función para subir imagen a Cloudinary
      const subirACloudinary = (fileBuffer) => {
        return new Promise((resolve, reject) => {
          const upload_stream = cloudinary.uploader.upload_stream(
            { 
              folder: 'finca',
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

      // Manejar nuevas imágenes
      let logoUrl = finca.logo;
      let imagenesFincaArr = finca.imagenesFinca || [];

      if (req.files) {
        // Si hay nuevo logo
        if (req.files.logo && req.files.logo[0]) {
          logoUrl = await subirACloudinary(req.files.logo[0].buffer);
        }

        // Si hay nuevas imágenes de la finca
        if (req.files.imagenesFinca && req.files.imagenesFinca.length > 0) {
          const nuevasImagenes = await Promise.all(
            req.files.imagenesFinca.map(file => subirACloudinary(file.buffer))
          );
          // Agregar nuevas imágenes al inicio
          imagenesFincaArr = [...nuevasImagenes, ...imagenesFincaArr];
        }
      }

      // Preparar datos de actualización
      const updateData = {
        ...(nombre && { nombre: nombre.trim() }),
        ...(ubicacion && { ubicacion: ubicacion.trim() }),
        ...(descripcion !== undefined && { descripcion: descripcion?.trim() }),
        ...(mision !== undefined && { mision: mision?.trim() }),
        ...(vision !== undefined && { vision: vision?.trim() }),
        ...(alcance !== undefined && { alcance: alcance?.trim() }),
        ...(telefono !== undefined && { telefono: telefono?.trim() }),
        ...(email !== undefined && { email: email?.trim() }),
        ...(direccion !== undefined && { direccion: direccion?.trim() }),
        ...(instagram !== undefined && { instagram: instagram?.trim() }),
        ...(facebook !== undefined && { facebook: facebook?.trim() }),
        ...(whatsapp !== undefined && { whatsapp: whatsapp?.trim() }),
        ...(horarioAtencion !== undefined && { horarioAtencion: horarioAtencion?.trim() }),
        logo: logoUrl,
        imagenesFinca: imagenesFincaArr
      };

      // Manejar arrays
      if (tipoProductos !== undefined) {
        updateData.tipoProductos = Array.isArray(tipoProductos) ? tipoProductos.filter(tipo => tipo.trim()) : [];
      }
      if (certificaciones !== undefined) {
        updateData.certificaciones = Array.isArray(certificaciones) ? certificaciones.filter(cert => cert.trim()) : [];
      }

      // Actualizar finca
      const fincaActualizada = await Finca.findByIdAndUpdate(
        finca._id,
        updateData,
        { new: true, runValidators: true }
      );

      res.json({
        ok: true,
        msg: 'Información de finca actualizada exitosamente',
        finca: fincaActualizada
      });

    } catch (error) {
      console.error('Error al actualizar finca:', error);
      res.status(500).json({
        ok: false,
        msg: 'Error al actualizar información de finca',
        error: error.message
      });
    }
  },



  // DELETE - Eliminar imagen de finca
  deleteImagenFinca: async (req, res) => {
    try {
      const { index } = req.params;
      const imagenIndex = parseInt(index);

      if (isNaN(imagenIndex) || imagenIndex < 0) {
        return res.status(400).json({
          ok: false,
          msg: 'Índice de imagen inválido'
        });
      }

      const finca = await Finca.findOne({ estado: 1 });
      if (!finca) {
        return res.status(404).json({
          ok: false,
          msg: 'No se encontró información de la finca'
        });
      }

      if (imagenIndex >= finca.imagenesFinca.length) {
        return res.status(400).json({
          ok: false,
          msg: 'Índice de imagen fuera de rango'
        });
      }

      finca.imagenesFinca.splice(imagenIndex, 1);
      await finca.save();

      res.json({
        ok: true,
        msg: 'Imagen eliminada exitosamente',
        finca
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

  // GET - Información pública de la finca (para frontend)
  getFincaPublica: async (req, res) => {
    try {
      const finca = await Finca.findOne({ estado: 1 })
        .select('-estado -createdAt -updatedAt -__v');

      if (!finca) {
        return res.status(404).json({
          ok: false,
          msg: 'No se encontró información de la finca'
        });
      }

      res.json({
        ok: true,
        finca
      });

    } catch (error) {
      console.error('Error al obtener información pública:', error);
      res.status(500).json({
        ok: false,
        msg: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // GET - Solo información básica (nombre, ubicación, descripción)
  getFincaBasica: async (req, res) => {
    try {
      const finca = await Finca.findOne({ estado: 1 })
        .select('nombre ubicacion descripcion logo');
      
      if (!finca) {
        return res.status(404).json({
          ok: false,
          msg: 'No se encontró información básica de la finca'
        });
      }

      res.json({
        ok: true,
        finca
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // GET - Solo información de contacto
  getFincaContacto: async (req, res) => {
    try {
      const finca = await Finca.findOne({ estado: 1 })
        .select('telefono email direccion instagram facebook whatsapp horarioAtencion');
      
      if (!finca) {
        return res.status(404).json({
          ok: false,
          msg: 'No se encontró información de contacto'
        });
      }

      res.json({
        ok: true,
        contacto: finca
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // GET - Solo información institucional
  getFincaInstitucional: async (req, res) => {
    try {
      const finca = await Finca.findOne({ estado: 1 })
        .select('mision vision objetivos alcance historia certificaciones');
      
      if (!finca) {
        return res.status(404).json({
          ok: false,
          msg: 'No se encontró información institucional'
        });
      }

      res.json({
        ok: true,
        institucional: finca
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // GET - Solo galería de imágenes
  getFincaGaleria: async (req, res) => {
    try {
      const finca = await Finca.findOne({ estado: 1 })
        .select('logo imagenesFinca');
      
      if (!finca) {
        return res.status(404).json({
          ok: false,
          msg: 'No se encontró galería de la finca'
        });
      }

      res.json({
        ok: true,
        galeria: {
          logo: finca.logo,
          imagenes: finca.imagenesFinca || []
        }
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: 'Error interno del servidor',
        error: error.message
      });
    }
  }

};

module.exports = { httpFincas };