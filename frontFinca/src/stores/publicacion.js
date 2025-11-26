import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { Notify } from "quasar";

const API_URL = "http://localhost:9815/api/publicacion";

export const usePublicacionStore = defineStore("publicacion", () => {
  const publicaciones = ref([]);
  const publicacion = ref(null);
  const loading = ref(false);

  // ===== RUTAS GET =====

  // GET - Listar todas las publicaciones
  const listarPublicaciones = async () => {
    try {
      loading.value = true;
      const r = await axios.get(`${API_URL}/listarPublicaciones`);
      publicaciones.value = r.data.publicaciones || r.data;
      return r.data;
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response?.data?.msg || "Error al cargar publicaciones",
      });
      console.error("Error al listar publicaciones:", error);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // ===== RUTAS POST =====

  // POST - Crear nueva publicación (con imágenes múltiples)
  const crearPublicacion = async (formData) => {
    try {
      if (!(formData instanceof FormData)) {
        throw new Error("crearPublicacion requiere una instancia de FormData");
      }
      loading.value = true;
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/crear`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-token": token
        },
      });
      Notify.create({ 
        type: "positive", 
        message: res.data.msg || "Publicación creada exitosamente" 
      });
      await listarPublicaciones(); // Actualizar lista
      return res.data;
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response?.data?.msg || error.response?.data?.error || "Error al crear publicación",
      });
      console.error("Error al crear publicación:", error);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // ===== RUTAS PUT =====

  // PUT - Editar publicación (con imágenes múltiples)
  const editarPublicacion = async (id, formData) => {
    try {
      loading.value = true;
      const token = localStorage.getItem('token');
      const res = await axios.put(`${API_URL}/editar/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-token": token
        },
      });
      Notify.create({ 
        type: "positive", 
        message: res.data.msg || "Publicación editada exitosamente" 
      });
      await listarPublicaciones(); // Actualizar lista
      return res.data;
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response?.data?.msg || error.response?.data?.error || "Error al editar publicación",
      });
      console.error("Error al editar publicación:", error);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // PUT - Activar publicación
  const activarPublicacion = async (id) => {
    try {
      loading.value = true;
      const token = localStorage.getItem('token');
      const res = await axios.put(`${API_URL}/activar/${id}`, {}, {
        headers: { "x-token": token }
      });
      Notify.create({ 
        type: "positive", 
        message: res.data.msg || "Publicación activada exitosamente" 
      });
      await listarPublicaciones();
      return res.data;
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response?.data?.msg || "Error al activar publicación",
      });
      console.error("Error al activar publicación:", error);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // PUT - Desactivar publicación
  const desactivarPublicacion = async (id) => {
    try {
      loading.value = true;
      const token = localStorage.getItem('token');
      const res = await axios.put(`${API_URL}/desactivar/${id}`, {}, {
        headers: { "x-token": token }
      });
      Notify.create({ 
        type: "warning", 
        message: res.data.msg || "Publicación desactivada exitosamente" 
      });
      await listarPublicaciones();
      return res.data;
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response?.data?.msg || "Error al desactivar publicación",
      });
      console.error("Error al desactivar publicación:", error);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // ===== RUTAS DELETE =====

  // DELETE - Eliminar imagen de publicación por índice
  const eliminarImagenPublicacion = async (id, index) => {
    try {
      loading.value = true;
      const token = localStorage.getItem('token');
      const res = await axios.delete(`${API_URL}/imagen/${id}/${index}`, {
        headers: { "x-token": token }
      });
      Notify.create({ 
        type: "positive", 
        message: res.data.msg || "Imagen eliminada exitosamente" 
      });
      // Actualizar publicación actual si existe
      if (publicacion.value && publicacion.value._id === id) {
        publicacion.value = res.data.publicacion;
      }
      await listarPublicaciones();
      return res.data;
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response?.data?.msg || "Error al eliminar imagen",
      });
      console.error("Error al eliminar imagen:", error);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // DELETE - Eliminar publicación
  const eliminarPublicacion = async (id) => {
    try {
      loading.value = true;
      const token = localStorage.getItem('token');
      const res = await axios.delete(`${API_URL}/eliminar/${id}`, {
        headers: { "x-token": token }
      });
      Notify.create({ 
        type: "positive", 
        message: res.data.msg || "Publicación eliminada exitosamente" 
      });
      await listarPublicaciones();
      return res.data;
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response?.data?.msg || "Error al eliminar publicación",
      });
      console.error("Error al eliminar publicación:", error);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // ===== UTILIDADES =====

  // Limpiar publicación actual
  const limpiarPublicacion = () => {
    publicacion.value = null;
  };

  // Limpiar publicaciones
  const limpiarPublicaciones = () => {
    publicaciones.value = [];
  };



  // Obtener publicaciones por tipo (filtro local)
  const obtenerPublicacionesPorTipo = (tipo) => {
    return publicaciones.value.filter(pub => pub.tipo === tipo);
  };

  // Obtener publicaciones recientes (filtro local - últimas 5)
  const obtenerPublicacionesRecientes = (limite = 5) => {
    return publicaciones.value.slice(0, limite);
  };

  return {
    // Estado
    publicaciones,
    publicacion,
    loading,
    
    // GET - Métodos de consulta
    listarPublicaciones,
    
    // POST - Métodos de creación
    crearPublicacion,
    
    // PUT - Métodos de actualización
    editarPublicacion,
    activarPublicacion,
    desactivarPublicacion,
    
    // DELETE - Métodos de eliminación
    eliminarImagenPublicacion,
    eliminarPublicacion,
    
    // Utilidades
    limpiarPublicacion,
    limpiarPublicaciones,
    obtenerPublicacionesPorTipo,
    obtenerPublicacionesRecientes,
  };
});
