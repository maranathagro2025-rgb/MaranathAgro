const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const { httpPublicaciones } = require("../controllers/publicacion");
const { publicacionHelper } = require("../helpers/publicacion");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-token");
const upload = require('../middlewares/upload.js');

// Listar todas las publicaciones
router.get("/listarPublicaciones", [validarCampos], httpPublicaciones.getPublicaciones);


// Insertar publicación
router.post(
  "/crear",
  [
    validarJWT,
    upload.array('imagenes', 10),
    check("titulo", "El título es obligatorio").not().isEmpty(),
    check("titulo", "El título debe tener al menos 5 caracteres").isLength({ min: 5 }),
    check("titulo", "El título no puede exceder 200 caracteres").isLength({ max: 200 }),
    check("descripcion", "La descripción es obligatoria").not().isEmpty(),
    check("descripcion", "La descripción debe tener al menos 10 caracteres").isLength({ min: 10 }),
    check("descripcion", "La descripción no puede exceder 500 caracteres").isLength({ max: 500 }),
    check("tipo", "Tipo inválido").optional().isIn(['noticia', 'evento', 'producto_nuevo', 'tips', 'cosecha', 'general']),
    check("destacada", "El campo destacada debe ser booleano").optional().isBoolean(),

    validarCampos,
  ],
  httpPublicaciones.postInsertarPublicacion
);

// Editar publicación
router.put(
  "/editar/:id",
  [
    validarJWT,
    upload.array('imagenes', 10),
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(publicacionHelper.existePublicacionPorId),
    check("tipo", "Tipo inválido").optional().isIn(['noticia', 'evento', 'producto_nuevo', 'tips', 'cosecha', 'general']),
    validarCampos,
  ],
  httpPublicaciones.putEditarPublicacion
);

// Eliminar imagen de publicación por índice
router.delete('/imagen/:id/:index', [
    validarJWT,
    check('id', 'ID de publicación inválido').isMongoId(),
    check('id').custom(publicacionHelper.existePublicacionPorId),
    check('index', 'Índice inválido').isInt({ min: 0 }),
    validarCampos
], httpPublicaciones.deleteImagenPublicacion);

// Activar publicación
router.put("/activar/:id", [
    // validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(publicacionHelper.existePublicacionPorId),
    validarCampos
], httpPublicaciones.putActivarPublicacion);

// Desactivar publicación
router.put("/desactivar/:id", [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(), 
    check('id').custom(publicacionHelper.existePublicacionPorId),
    validarCampos
], httpPublicaciones.putDesactivarPublicacion);

// Eliminar publicación
router.delete("/eliminar/:id", [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(publicacionHelper.existePublicacionPorId),
    validarCampos
], httpPublicaciones.deletePublicacion);

module.exports = router;
