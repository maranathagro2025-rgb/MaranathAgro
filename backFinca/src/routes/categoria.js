const mongoose = require('mongoose');
const { httpCategorias } = require("../controllers/categoria.js");
const { CategoriaHelper } = require('../helpers/categoria.js');
const express = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const router = express.Router();
const Categoria = require('../models/categorias.js');
const { validarJWT } = require('../middlewares/validar-token.js');

// Crear nueva categoría
router.post("/crear", [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('nombre', 'El nombre debe tener entre 2 y 50 caracteres').isLength({ min: 2, max: 50 }),
    check('nombre').custom(CategoriaHelper.existeCategoriaPorNombre),
    check('descripcion', 'La descripción es obligatoria').not().isEmpty(),
    check('descripcion', 'La descripción debe tener máximo 200 caracteres').isLength({ max: 200 }),
    check('icono', 'El icono debe ser una cadena válida').optional().isString(),
    check('orden', 'El orden debe ser un número entero').optional().isInt({ min: 0 }),
    validarCampos
], httpCategorias.postCrearCategoria);


// Listar todas las categorías
router.get("/listarCategorias", [
    validarCampos,
], httpCategorias.getCategorias);


// Listar categorías activas (para frontend)
router.get("/activas", [
    validarCampos,
], httpCategorias.getCategoriasActivas);


// Listar categoría por ID
router.get('/listarpor/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(CategoriaHelper.existeCategoriaPorId),
    validarCampos
], httpCategorias.getCategoriaPorId);


// Editar categoría por ID
router.put('/editar/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(CategoriaHelper.existeCategoriaPorId),
    check('nombre', 'El nombre es obligatorio').optional().not().isEmpty(),
    check('nombre', 'El nombre debe tener entre 2 y 50 caracteres').optional().isLength({ min: 2, max: 50 }),
    check('descripcion', 'La descripción debe tener máximo 200 caracteres').optional().isLength({ max: 200 }),
    check('icono', 'El icono debe ser una cadena válida').optional().isString(),
    check('orden', 'El orden debe ser un número entero').optional().isInt({ min: 0 }),
    validarCampos
], httpCategorias.putEditarCategoria);

// Activar categoría
router.put('/activar/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(CategoriaHelper.existeCategoriaPorId),
    validarCampos
], httpCategorias.putActivarCategoria);

// Desactivar categoría
router.put('/desactivar/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(CategoriaHelper.existeCategoriaPorId),
    validarCampos
], httpCategorias.putDesactivarCategoria);

module.exports = router;
