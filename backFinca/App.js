

const express = require("express");
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());


// Rutas principales
const usuarios = require('./src/routes/usuario.js');
// const vistas = require('./src/routes/vista.js');
// const venta = require("./src/routes/venta.js");
const productos = require("./src/routes/producto.js");
const fincas = require("./src/routes/finca.js");
const categorias = require("./src/routes/categoria.js");



// Middleware de rutas
app.use('/api/usuario', usuarios);
// app.use('/api/venta', venta);
app.use('/api/producto', productos);
app.use('/api/finca', fincas);
app.use('/api/categoria', categorias);

const PORT = process.env.PORT || 1598;


app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('✅ Conectado a MongoDB ⚓ Compas y Atlas ⏬⛈️'))
        .catch(err => console.error('❌ Error al conectar a MongoDB Atlas:', err));
}); 
