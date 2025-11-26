import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { Notify } from "quasar";

const API_URL = "http://localhost:9815/api/producto";

export const useProductoStore = defineStore("producto", () => {
  const productos = ref([]);
  const productosDestacados = ref([]);
  const producto = ref(null);
  const loading = ref(false);

  // ===== RUTAS GET =====

  // GET - Listar todos los productos (activos e inactivos)
  const listarProductos = async (estado = 'all') => {
    try {
      loading.value = true;
      const r = await axios.get(`${API_URL}/listarProductos`, {
        params: { estado }
      });
      productos.value = r.data.productos || r.data;
      return r.data;
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response?.data?.msg || "Error al cargar productos",
      });
      console.error("Error al listar productos:", error);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // GET - Obtener producto por ID
  const obtenerProductoPorId = async (id) => {
    try {
      loading.value = true;
      const r = await axios.get(`${API_URL}/listarId/${id}`);
      producto.value = r.data.producto || r.data;
      return r.data.producto || r.data;
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response?.data?.msg || "Error al cargar el producto",
      });
      console.error("Error al obtener producto:", error);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // GET - Obtener productos destacados
  const obtenerProductosDestacados = async () => {
    try {
      loading.value = true;
      const r = await axios.get(`${API_URL}/destacados`);
      productosDestacados.value = r.data.productos || r.data;
      return r.data;
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response?.data?.msg || "Error al cargar productos destacados",
      });
      console.error("Error al obtener destacados:", error);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // ===== RUTAS POST =====

  // POST - Crear nuevo producto (con imágenes múltiples)
  const crearProducto = async (formData) => {
    try {
      if (!(formData instanceof FormData)) {
        throw new Error("crearProducto requiere una instancia de FormData");
      }
      loading.value = true;
      const res = await axios.post(`${API_URL}/crear`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await listarProductos(); // Actualizar lista
      return res.data;
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response?.data?.msg || error.response?.data?.error || "Error al crear producto",
      });
      console.error("Error al crear producto:", error);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // ===== RUTAS PUT =====

  // PUT - Editar producto (con imágenes múltiples)
  const editarProducto = async (id, formData) => {
    try {
      loading.value = true;
      const res = await axios.put(`${API_URL}/editar/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await listarProductos(); // Actualizar lista
      return res.data;
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response?.data?.msg || error.response?.data?.error || "Error al editar producto",
      });
      console.error("Error al editar producto:", error);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // PUT - Activar producto
  const activarProducto = async (id) => {
    try {
      loading.value = true;
      const res = await axios.put(`${API_URL}/activar/${id}`);
      Notify.create({ 
        type: "positive", 
        message: res.data.msg || "Producto activado exitosamente" 
      });
      return res.data;
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response?.data?.msg || "Error al activar producto",
      });
      console.error("Error al activar producto:", error);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // PUT - Desactivar producto
  const desactivarProducto = async (id) => {
    try {
      loading.value = true;
      const res = await axios.put(`${API_URL}/desactivar/${id}`);
      Notify.create({ 
        type: "warning", 
        message: res.data.msg || "Producto desactivado exitosamente" 
      });
      return res.data;
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response?.data?.msg || "Error al desactivar producto",
      });
      console.error("Error al desactivar producto:", error);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // ===== RUTAS DELETE =====

  // DELETE - Eliminar imagen de producto por índice
  const eliminarImagenProducto = async (id, index) => {
    try {
      loading.value = true;
      const res = await axios.delete(`${API_URL}/imagen/${id}/${index}`);
      Notify.create({ 
        type: "positive", 
        message: res.data.msg || "Imagen eliminada exitosamente" 
      });
      // Actualizar producto actual si existe
      if (producto.value && producto.value._id === id) {
        await obtenerProductoPorId(id);
      }
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

  // DELETE - Eliminar producto
  const eliminarProducto = async (id) => {
    try {
      loading.value = true;
      const res = await axios.delete(`${API_URL}/eliminar/${id}`);
      await listarProductos();
      return res.data;
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response?.data?.msg || "Error al eliminar producto",
      });
      console.error("Error al eliminar producto:", error);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // ===== UTILIDADES =====

  // Limpiar producto actual
  const limpiarProducto = () => {
    producto.value = null;
  };

  // Limpiar productos
  const limpiarProductos = () => {
    productos.value = [];
  };

  return {
    // Estado
    productos,
    productosDestacados,
    producto,
    loading,
    
    // GET - Métodos de consulta
    listarProductos,
    obtenerProductoPorId,
    obtenerProductosDestacados,
    
    // POST - Métodos de creación
    crearProducto,
    
    // PUT - Métodos de actualización
    editarProducto,
    activarProducto,
    desactivarProducto,
    
    // DELETE - Métodos de eliminación
    eliminarImagenProducto,
    eliminarProducto,
    
    // Utilidades
    limpiarProducto,
    limpiarProductos,
  };
});