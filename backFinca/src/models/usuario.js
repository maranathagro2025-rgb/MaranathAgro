const mongoose = require('mongoose');


const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true, default: "" },
    email: { type: String, required: true, unique:true },
    password: { type: String, required: true, default: "",min:8,max:15 },
    estado: { type: Number, required: true, default: 1 },
    rol: { type: String, required: true, enum: ['administrador', 'cliente'], default: 'cliente' },
    codigoVerificacion: { type: String }
    
}, { timestamps: true });

module.exports= mongoose.model("Usuario", usuarioSchema)