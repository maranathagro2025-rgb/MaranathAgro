const mongoose = require('mongoose');
const { httpFincas } = require('../controllers/finca.js');
const { FincaHelper } = require('../helpers/finca.js');
const express = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-token.js');
const upload = require('../middlewares/upload.js');
const router = express.Router();

// GET - Obtener información de la finca (administración)
router.get('/info', [
    validarCampos
], httpFincas.getFinca);

// GET - Información pública de la finca (sin autenticación)
router.get('/publica', [
    validarCampos
], httpFincas.getFincaPublica);

// POST - Crear información de finca (solo si no existe)
router.post('/crear', [
    validarJWT,
    upload.fields([
        { name: 'logo', maxCount: 1 },
        { name: 'imagenesFinca', maxCount: 10 }
    ]),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('nombre', 'El nombre debe tener entre 2 y 100 caracteres').isLength({ min: 2, max: 100 }),
    check('ubicacion', 'La ubicación es obligatoria').not().isEmpty(),
    check('ubicacion', 'La ubicación debe tener entre 5 y 200 caracteres').isLength({ min: 5, max: 200 }),
    check('descripcion', 'La descripción debe tener máximo 500 caracteres').optional().isLength({ max: 500 }),
    check('mision', 'La misión debe tener máximo 800 caracteres').optional().isLength({ max: 800 }),
    check('vision', 'La visión debe tener máximo 800 caracteres').optional().isLength({ max: 800 }),
    check('alcance', 'El alcance debe tener máximo 1000 caracteres').optional().isLength({ max: 1000 }),
    check('historia', 'La historia debe tener máximo 2000 caracteres').optional().isLength({ max: 2000 }),
    check('telefono', 'Número de teléfono inválido').optional().custom(FincaHelper.validarTelefono),
    check('email', 'Email inválido').optional().isEmail(),
    check('direccion', 'La dirección debe tener máximo 300 caracteres').optional().isLength({ max: 300 }),
    check('instagram', 'URL de Instagram inválida').optional().custom(FincaHelper.validarInstagram),
    check('facebook', 'URL de Facebook inválida').optional().custom(FincaHelper.validarFacebook),
    check('whatsapp', 'Número de WhatsApp inválido').optional().custom(FincaHelper.validarWhatsapp),
    check('horarioAtencion', 'Horario de atención muy largo').optional().custom(FincaHelper.validarHorarioAtencion),
    check('tipoProductos', 'Tipos de productos inválidos').optional().custom(FincaHelper.validarTipoProductos),
    check('certificaciones', 'Certificaciones inválidas').optional().custom(FincaHelper.validarCertificaciones),
    validarCampos
], httpFincas.postCrearFinca);

// PUT - Actualizar información de la finca
router.put('/actualizar', [
    validarJWT,
    upload.fields([
        { name: 'logo', maxCount: 1 },
        { name: 'imagenesFinca', maxCount: 10 }
    ]),
    check('nombre', 'El nombre debe tener entre 2 y 100 caracteres').optional().isLength({ min: 2, max: 100 }),
    validarCampos
], httpFincas.putActualizarFinca);



// DELETE - Eliminar imagen de finca por índice
router.delete('/imagen/:index', [
    validarJWT,
    check('index', 'Índice inválido').isInt({ min: 0 }),
    validarCampos
], httpFincas.deleteImagenFinca);

// Rutas adicionales útiles

// GET - Solo información básica (nombre, ubicación, descripción)
router.get('/basica', [
    validarCampos
], httpFincas.getFincaBasica);

// GET - Solo información de contacto
router.get('/contacto', [
    validarCampos
], httpFincas.getFincaContacto);

// GET - Solo información institucional
router.get('/institucional', [
    validarCampos
], httpFincas.getFincaInstitucional);

// GET - Solo galería de imágenes
router.get('/galeria', [
    validarCampos
], httpFincas.getFincaGaleria);

module.exports = router;