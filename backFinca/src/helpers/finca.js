const mongoose = require('mongoose');
const Finca = require('../models/finca');

const FincaHelper = {
  
  // Validar email
  validarEmail: (email) => {
    if (email) {
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Email inválido');
      }
    }
    return true;
  },

  // Validar teléfono
  validarTelefono: (telefono) => {
    if (telefono) {
      const telefonoRegex = /^[\+]?[\d\s\-\(\)]{7,15}$/;
      if (!telefonoRegex.test(telefono)) {
        throw new Error('Número de teléfono inválido');
      }
    }
    return true;
  },

  // Validar WhatsApp
  validarWhatsapp: (whatsapp) => {
    if (whatsapp) {
      const whatsappRegex = /^[\+]?[\d\s\-\(\)]{7,15}$/;
      if (!whatsappRegex.test(whatsapp)) {
        throw new Error('Número de WhatsApp inválido');
      }
    }
    return true;
  },

  // Validar URL de redes sociales
  validarUrlRedSocial: (url, redSocial) => {
    if (url) {
      try {
        new URL(url);
        return true;
      } catch {
        throw new Error(`URL de ${redSocial} inválida`);
      }
    }
    return true;
  },

  // Validar Instagram
  validarInstagram: (instagram) => {
    return FincaHelper.validarUrlRedSocial(instagram, 'Instagram');
  },

  // Validar Facebook
  validarFacebook: (facebook) => {
    return FincaHelper.validarUrlRedSocial(facebook, 'Facebook');
  },

  // Validar que existe finca
  existeFinca: async () => {
    const finca = await Finca.findOne({ estado: 1 });
    if (!finca) {
      throw new Error('No se encontró información de la finca');
    }
    return true;
  },

  // Validar que no existe finca (para crear)
  noExisteFinca: async () => {
    const finca = await Finca.findOne();
    if (finca) {
      throw new Error('Ya existe información de la finca. Use PUT para actualizar');
    }
    return true;
  },

  // Validar tipos de productos
  validarTipoProductos: (tipoProductos) => {
    if (tipoProductos && Array.isArray(tipoProductos)) {
      if (tipoProductos.length > 20) {
        throw new Error('Máximo 20 tipos de productos permitidos');
      }
      
      for (let tipo of tipoProductos) {
        if (typeof tipo !== 'string' || tipo.trim().length === 0) {
          throw new Error('Cada tipo de producto debe ser un texto válido');
        }
        if (tipo.length > 50) {
          throw new Error('Cada tipo de producto debe tener máximo 50 caracteres');
        }
      }
    }
    return true;
  },

  // Validar certificaciones
  validarCertificaciones: (certificaciones) => {
    if (certificaciones && Array.isArray(certificaciones)) {
      if (certificaciones.length > 15) {
        throw new Error('Máximo 15 certificaciones permitidas');
      }
      
      for (let cert of certificaciones) {
        if (typeof cert !== 'string' || cert.trim().length === 0) {
          throw new Error('Cada certificación debe ser un texto válido');
        }
        if (cert.length > 100) {
          throw new Error('Cada certificación debe tener máximo 100 caracteres');
        }
      }
    }
    return true;
  },

  // Validar límite de texto
  validarLongitudTexto: (texto, campo, min = 0, max = 1000) => {
    if (texto) {
      if (texto.length < min) {
        throw new Error(`${campo} debe tener mínimo ${min} caracteres`);
      }
      if (texto.length > max) {
        throw new Error(`${campo} debe tener máximo ${max} caracteres`);
      }
    }
    return true;
  },

  // Validar horario de atención
  validarHorarioAtencion: (horario) => {
    if (horario) {
      // Formato básico: "Lunes a Viernes: 8:00 AM - 5:00 PM"
      if (horario.length > 200) {
        throw new Error('Horario de atención muy largo (máximo 200 caracteres)');
      }
    }
    return true;
  },

  // Limpiar datos de entrada
  limpiarDatos: (datos) => {
    const datosLimpios = {};
    
    // Limpiar strings
    const camposString = [
      'nombre', 'ubicacion', 'descripcion', 'mision', 'vision', 
      'alcance', 'historia', 'telefono', 'email', 'direccion',
      'instagram', 'facebook', 'whatsapp', 'horarioAtencion'
    ];
    
    camposString.forEach(campo => {
      if (datos[campo] !== undefined) {
        datosLimpios[campo] = datos[campo] ? datos[campo].trim() : null;
      }
    });

    // Limpiar arrays
    if (datos.objetivos) {
      datosLimpios.objetivos = Array.isArray(datos.objetivos) 
        ? datos.objetivos.filter(obj => obj && obj.trim()).map(obj => obj.trim())
        : [];
    }

    if (datos.tipoProductos) {
      datosLimpios.tipoProductos = Array.isArray(datos.tipoProductos)
        ? datos.tipoProductos.filter(tipo => tipo && tipo.trim()).map(tipo => tipo.trim())
        : [];
    }

    if (datos.certificaciones) {
      datosLimpios.certificaciones = Array.isArray(datos.certificaciones)
        ? datos.certificaciones.filter(cert => cert && cert.trim()).map(cert => cert.trim())
        : [];
    }

    return datosLimpios;
  }
};

module.exports = { FincaHelper };