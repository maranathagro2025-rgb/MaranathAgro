const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const { httpProductos } = require("../controllers/producto");
const { productoHelper } = require("../helpers/producto");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-token");
const upload = require('../middlewares/upload.js');


// listar todos
router.get("/listarProductos", [validarCampos], httpProductos.getProductos);

// listar por id
router.get(
  "/listarId/:id",
  [
    // validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    validarCampos,
  ],
  httpProductos.getProductoById
);

// productos destacados
router.get("/destacados", httpProductos.getDestacados);

// insertar producto
router.post(
  "/crear",
  [
    // validarJWT, // Descomenta si quieres requerir autenticación
    upload.array('imagenes', 10),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("categoria", "Categoria inválida").not().isEmpty().isMongoId(),
    check("precio", "El precio es obligatorio").not().isEmpty(),
    check("precio", "Precio inválido").isNumeric(),
    check("unidad", "La unidad es obligatoria").not().isEmpty(),
    check("destacado", "El campo destacado es obligatorio").optional().isBoolean(),
    check("nombre").custom(productoHelper.existeProductoPorNombre),
    validarCampos,
  ],
  httpProductos.postInsertarProducto
);

// editar producto
router.put(
  "/editar/:id",
  [
    // validarJWT,
    upload.array('imagenes', 10),    
    check("id", "No es un ID válido").isMongoId(),
    check("nombre", "El nombre es obligatorio").optional().not().isEmpty(),
    check("precio", "El precio es obligatorio").optional().not().isEmpty(),
    check("precio", "Precio inválido").optional().isNumeric(),
    check("categoria", "La categoría es obligatoria").optional().not().isEmpty().isMongoId(),
    check("unidad", "La unidad es obligatoria").optional().not().isEmpty(),
    validarCampos,
  ],
  httpProductos.putEditarProducto
);

// ajustar inventario
router.put(
  "/ajustarInventario/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("cantidad", "Cantidad es obligatoria y debe ser entero mayor a 0").isInt({ min: 1 }),
    validarCampos,
  ],
  httpProductos.putAjustarInventario
);

router.put("/activar/:id",[
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(productoHelper.existeProductoPorId),
    validarCampos
], httpProductos.putActivarProducto); // activar

router.put("/desactivar/:id",[
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(), 
    check('id').custom(productoHelper.existeProductoPorId),
    validarCampos
    ], httpProductos.putDesactivarProducto);

    // Eliminar producto
    router.delete("/eliminar/:id", [
        validarJWT,
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(productoHelper.existeProductoPorId),
        validarCampos
    ], httpProductos.deleteProducto);

module.exports = router;