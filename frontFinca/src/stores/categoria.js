import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { Notify } from "quasar";
import { useStoreUsuarios } from "./usuario.js"; // Importa el store de usuario

const API_URL = "http://localhost:1598/api/categoria";

export const useCategoriaStore = defineStore("categoria", () => {
  const categorias = ref([]);
  const categoria = ref(null);

  // Función para insertar el token en axios
  function insertarToken() {
    const usuarioStore = useStoreUsuarios();
    if (usuarioStore.token) {
      axios.defaults.headers.common['x-token'] = usuarioStore.token;
    }
  }

  // Listar todas las categorías
  const listarCategorias = async () => {
    try {
      insertarToken();
      const r = await axios.get(`${API_URL}/listarCategorias`);
      categorias.value = r.data;
    } catch (error) {
      Notify.create({
        type: "negative",
        message: "Error al cargar categorías",
      });
      console.log(error);
    }
  };

  // Obtener categoría por ID
  const obtenerCategoriaPorId = async (id) => {
    try {
      insertarToken();
      const r = await axios.get(`${API_URL}/listar/${id}`);
      categoria.value = r.data;
      return r.data;
    } catch (error) {
      Notify.create({
        type: "negative",
        message: "Error al cargar la categoría",
      });
      console.log(error);
      return null;
    }
  };

  // Crear nueva categoría
  const crearCategoria = async (payload) => {
    try {
      insertarToken();
      const res = await axios.post(`${API_URL}/crear`, payload);

      return res.data;
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response?.data?.error || "Error al crear categoría",
      });
      console.log(error);
      return null;
    }
  };

  // Editar categoría
  const editarCategoria = async (id, payload) => {
    try {
      insertarToken();
      const r = await axios.put(`${API_URL}/editar/${id}`, payload);
      Notify.create({
        type: "positive",
        message: "Categoría editada exitosamente",
      });
      return r.data;
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response?.data?.error || "Error al editar categoría",
      });
      console.log(error);
      return null;
    }
  };

  // Activar categoría
  const activarCategoria = async (id) => {
    try {
      insertarToken();
      const r = await axios.put(`${API_URL}/activar/${id}`);
      return r.data;
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response?.data?.error || "Error al activar categoría",
      });
      console.log(error);
      return null;
    }
  };

  // Desactivar categoría
  const desactivarCategoria = async (id) => {
    try {
      insertarToken();
      const r = await axios.put(`${API_URL}/desactivar/${id}`);
      return r.data;
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response?.data?.error || "Error al desactivar categoría",
      });
      console.log(error);
      return null;
    }
  };

  return {
    categorias,
    categoria,
    listarCategorias,
    obtenerCategoriaPorId,
    crearCategoria,
    editarCategoria,
    activarCategoria,
    desactivarCategoria,
  };
});