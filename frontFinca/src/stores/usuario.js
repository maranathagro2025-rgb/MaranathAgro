import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { Notify } from "quasar"

// URL base global
const API_URL = "http://localhost:9815/api"

export const useStoreUsuarios = defineStore('Usuario', () => {
  const validacion = ref('')
  const estatus = ref('')
  const token = ref('')
  const rol = ref('')
  const usuario = ref('')
  const nombre = ref('')
  const email = ref('')
  const id = ref('')
  const correoRecuperar = ref('')
  const codigoCorreo = ref('')

  function insertarToken() {
    if (token.value) {
      axios.defaults.headers.common['x-token'] = token.value
    }
  }

  // Obtener todos los usuarios
  const getAll = async () => {
    try {
      insertarToken()
      const res = await axios.get(`${API_URL}/usuario/listarUsuarios`)
      estatus.value = res.status
      return res.data
    } catch (err) {
      estatus.value = err.response?.status || 500
      validacion.value = err.response?.data?.msg || 'Error al obtener usuarios'
    }
  }

  // Obtener usuario por ID
  const getById = async (_id) => {
    try {
      insertarToken()
      const res = await axios.get(`${API_URL}/usuario/listarpor/${_id}`)
      estatus.value = res.status
      return res.data.usuario
    } catch (err) {
      estatus.value = err.response?.status || 500
      validacion.value = err.response?.data?.msg || 'Error al obtener usuario'
    }
  }

  // Registrar usuario
  const agregar = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/usuario/insertarUsuario`, data)
      estatus.value = res.status
      return { success: true, data: res.data }
    } catch (err) {
      estatus.value = err.response?.status || 500
      validacion.value = err.response?.data?.error || 'Error al registrar'
      return { success: false, msg: validacion.value }
    }
  }

  // Editar usuario
  const editar = async (_id, data) => {
    try {
      insertarToken()
      const res = await axios.put(`${API_URL}/usuario/editarUsuario/${_id}`, data)
      estatus.value = res.status
      return { success: true, data: res.data }
    } catch (err) {
      estatus.value = err.response?.status || 500
      validacion.value = err.response?.data?.msg || 'Error al actualizar usuario'
      return { success: false, msg: validacion.value }
    }
  }

  // Eliminar usuario (no tienes esta ruta en tu backend, deberías implementarla si la necesitas)
  const eliminar = async (_id) => {
    try {
      insertarToken()
      const res = await axios.delete(`${API_URL}/usuario/eliminar/${_id}`)
      estatus.value = res.status
      return { success: true, data: res.data }
    } catch (err) {
      estatus.value = err.response?.status || 500
      validacion.value = err.response?.data?.msg || 'Error al eliminar usuario'
      return { success: false, msg: validacion.value }
    }
  }

  // Login
  const login = async (data) => {
    token.value = ""
    usuario.value = ""
    rol.value = ""
    id.value = ""
    estatus.value = ""
    validacion.value = ""

    try {
      const res = await axios.post(`${API_URL}/usuario/login`, data)
      if (res.status === 200 && res.data.token) {
        token.value = res.data.token
        usuario.value = res.data.usuario
        id.value = res.data.usuario._id
        rol.value = res.data.usuario.rol
        estatus.value = res.status
        validacion.value = ""
        insertarToken()
        return { success: true, data: res.data }
      } else {
        token.value = ""
        usuario.value = ""
        rol.value = ""
        id.value = ""
        estatus.value = ""
        validacion.value = ""
        return { success: false, msg: "Error de autenticación" }
      }
    } catch (err) {
      token.value = ""
      usuario.value = ""
      rol.value = ""
      id.value = ""
      estatus.value = ""
      validacion.value = err.response?.data?.msg || "Error de autenticación"
      return { success: false, msg: validacion.value }
    }
  }

  // Logout
  function logout() {
    token.value = ''
    rol.value = ''
    usuario.value = ''
    nombre.value = ''
    email.value = ''
    id.value = ''
    localStorage.removeItem('pinia_usuario')
    sessionStorage.removeItem('pinia_usuario')
    delete axios.defaults.headers.common['x-token']
  }

  // Recuperar código
  const codigoRecuperar = async (correo) => {
    try {
      const res = await axios.post(`${API_URL}/usuario/enviar-codigo`, { email: correo })
      estatus.value = res.status
      codigoCorreo.value = res.data.codigo
      return res.data
    } catch (err) {
      estatus.value = err.response?.status || 500
      validacion.value = err.response?.data?.msg || 'Error al recuperar código'
    }
  }

  // Confirmar código
  const confirmarCodigo = async (email, codigo) => {
    try {
      const res = await axios.post(`${API_URL}/usuario/confirmar-codigo`, { email, codigo })
      estatus.value = res.status
      return res.data
    } catch (err) {
      estatus.value = err.response?.status || 500
      validacion.value = err.response?.data?.msg || 'Código incorrecto'
    }
  }

  // Cambiar nueva contraseña
  const nuevaPassword = async ({ email, codigo, password }) => {
    try {
      const res = await axios.post(`${API_URL}/usuario/recuperar-password`, {
        email,
        codigo,
        nuevaPassword: password
      })
      estatus.value = res.status
      return res.data
    } catch (err) {
      estatus.value = err.response?.status || 500
      validacion.value = err.response?.data?.msg || 'Error al cambiar contraseña'
    }
  }

  // Activar usuario
  const activarUsuario = async (_id) => {
    try {
      insertarToken()
      const res = await axios.put(`${API_URL}/usuario/activarUsuario/${_id}`)
      estatus.value = res.status
      return { success: true, data: res.data }
    } catch (err) {
      estatus.value = err.response?.status || 500
      validacion.value = err.response?.data?.msg || 'Error al activar usuario'
      return { success: false, msg: validacion.value }
    }
  }

  // Desactivar usuario
  const desactivarUsuario = async (_id) => {
    try {
      insertarToken()
      const res = await axios.put(`${API_URL}/usuario/desactivarUsuario/${_id}`)
      estatus.value = res.status
      return { success: true, data: res.data }
    } catch (err) {
      estatus.value = err.response?.status || 500
      validacion.value = err.response?.data?.msg || 'Error al desactivar usuario'
      return { success: false, msg: validacion.value }
    }
  }

  // ----------------- EXPORTA TUS FUNCIONES -----------------
  return {
    validacion,
    estatus,
    token,
    rol,
    usuario,
    nombre,
    email,
    id,
    correoRecuperar,
    codigoCorreo,
    insertarToken,
    getAll,
    getById,
    agregar,
    editar,
    eliminar,
    login,
    logout,
    codigoRecuperar,
    confirmarCodigo,
    nuevaPassword,
    activarUsuario,
    desactivarUsuario,
  }
}, {
  persist: true // <-- Esto permite que el store persista en el almacenamiento local
})


// Código temporal para editar usuario
// console.log('ID:', id.value, 'Nombre:', nom.value, 'Email:', ema.value);
