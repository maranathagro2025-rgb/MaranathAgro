import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { Notify } from "quasar";
import { useStoreUsuarios } from "./usuario.js"; // Importa el store de usuario

const API_URL = "https://maranathagro.onrender.com/api/categoria";

export const useCategoriaStore = defineStore("categoria", () => {
  const categorias = ref([]);
  const categoriasActivas = ref([]);
  const categoria = ref(null);
  const loading = ref(false);

  // Función para insertar el token en axios
  function insertarToken() {
    const usuarioStore = useStoreUsuarios();
    if (usuarioStore.token) {
      axios.defaults.headers.common['x-token'] = usuarioStore.token;
    }
  }

  // ===== RUTAS GET =====

  // GET - Listar todas las categorías (admin - con estado 1)
  const listarCategorias = async () => {
    try {
      loading.value = true;
      insertarToken();
      const r = await axios.get(`${API_URL}/listarCategorias`);
      categorias.value = r.data.categorias || r.data;
      return r.data;
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response?.data?.msg || "Error al cargar categorías",
      });
      console.error("Error al listar categorías:", error);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // GET - Listar categorías activas (para frontend público)
  const listarCategoriasActivas = async () => {
    try {
      loading.value = true;
      const r = await axios.get(`${API_URL}/activas`);
      categoriasActivas.value = r.data.categorias || r.data;
      return r.data;
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response?.data?.msg || "Error al cargar categorías activas",
      });
      console.error("Error al listar categorías activas:", error);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // GET - Obtener categoría por ID
  const obtenerCategoriaPorId = async (id) => {
    try {
      loading.value = true;
      insertarToken();
      const r = await axios.get(`${API_URL}/listarpor/${id}`);
      categoria.value = r.data.categoria || r.data;
      return r.data.categoria || r.data;
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response?.data?.msg || "Error al cargar la categoría",
      });
      console.error("Error al obtener categoría:", error);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // ===== RUTAS POST =====

  // POST - Crear nueva categoría
  const crearCategoria = async (payload) => {
    try {
      loading.value = true;
      insertarToken();
      const res = await axios.post(`${API_URL}/crear`, payload);
      await listarCategorias(); // Actualizar lista
      return res.data;
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response?.data?.msg || error.response?.data?.error || "Error al crear categoría",
      });
      console.error("Error al crear categoría:", error);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // ===== RUTAS PUT =====

  // PUT - Editar categoría
  const editarCategoria = async (id, payload) => {
    try {
      loading.value = true;
      insertarToken();
      const r = await axios.put(`${API_URL}/editar/${id}`, payload);

      await listarCategorias(); // Actualizar lista
      return r.data;
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response?.data?.msg || error.response?.data?.error || "Error al editar categoría",
      });
      console.error("Error al editar categoría:", error);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // PUT - Activar categoría
  const activarCategoria = async (id) => {
    try {
      loading.value = true;
      insertarToken();
      const r = await axios.put(`${API_URL}/activar/${id}`);
      Notify.create({
        type: "positive",
        message: r.data.msg || "Categoría activada exitosamente",
      });
      await listarCategorias(); // Actualizar lista
      return r.data;
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response?.data?.msg || "Error al activar categoría",
      });
      console.error("Error al activar categoría:", error);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // PUT - Desactivar categoría
  const desactivarCategoria = async (id) => {
    try {
      loading.value = true;
      insertarToken();
      const r = await axios.put(`${API_URL}/desactivar/${id}`);
      Notify.create({
        type: "warning",
        message: r.data.msg || "Categoría desactivada exitosamente",
      });
      await listarCategorias(); // Actualizar lista
      return r.data;
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response?.data?.msg || "Error al desactivar categoría",
      });
      console.error("Error al desactivar categoría:", error);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // ===== UTILIDADES =====

  // Limpiar categoría actual
  const limpiarCategoria = () => {
    categoria.value = null;
  };

  // Limpiar categorías
  const limpiarCategorias = () => {
    categorias.value = [];
    categoriasActivas.value = [];
  };

  // Validar datos de categoría antes de enviar
  const validarCategoria = (datos) => {
    const errores = [];

    if (!datos.nombre || datos.nombre.trim().length < 2 || datos.nombre.trim().length > 50) {
      errores.push("El nombre debe tener entre 2 y 50 caracteres");
    }

    if (!datos.descripcion || datos.descripcion.trim().length === 0) {
      errores.push("La descripción es obligatoria");
    }

    if (datos.descripcion && datos.descripcion.length > 200) {
      errores.push("La descripción debe tener máximo 200 caracteres");
    }

    if (datos.orden !== undefined && (isNaN(datos.orden) || datos.orden < 0)) {
      errores.push("El orden debe ser un número entero positivo");
    }

    return {
      valido: errores.length === 0,
      errores
    };
  };

  // Buscar categoría por nombre (local)
  const buscarCategoriaPorNombre = (nombre) => {
    return categorias.value.find(
      cat => cat.nombre.toLowerCase() === nombre.toLowerCase()
    );
  };

  // Ordenar categorías localmente
  const ordenarCategoriasPorOrden = () => {
    categorias.value.sort((a, b) => {
      if (a.orden !== b.orden) {
        return a.orden - b.orden;
      }
      return a.nombre.localeCompare(b.nombre);
    });
  };

  return {
    // Estado
    categorias,
    categoriasActivas,
    categoria,
    loading,

    // GET - Métodos de consulta
    listarCategorias,
    listarCategoriasActivas,
    obtenerCategoriaPorId,

    // POST - Métodos de creación
    crearCategoria,

    // PUT - Métodos de actualización
    editarCategoria,
    activarCategoria,
    desactivarCategoria,

    // Utilidades
    limpiarCategoria,
    limpiarCategorias,
    validarCategoria,
    buscarCategoriaPorNombre,
    ordenarCategoriasPorOrden,
  };
});