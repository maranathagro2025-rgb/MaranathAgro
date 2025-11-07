import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { Notify } from "quasar";

const API_URL = "http://localhost:1598/api/producto";

export const useProductoStore = defineStore("producto", () => {
  const productos = ref([]);
  const producto = ref(null);

  // Listar todos los productos
  const listarProductos = async () => {
    try {
      const r = await axios.get(`${API_URL}/listarProductos`);
      productos.value = r.data;
    } catch (error) {
      Notify.create({
        type: "negative",
        message: "Error al cargar productos",
      });
      console.log(error);
    }
  };

  // Obtener producto por ID
  const obtenerProductoPorId = async (id) => {
    try {
      const r = await axios.get(`${API_URL}/listarId/${id}`);
      producto.value = r.data.producto || r.data;
      return r.data.producto || r.data;
    } catch (error) {
      Notify.create({
        type: "negative",
        message: "Error al cargar el producto",
      });
      console.log(error);
      return null;
    }
  };

  // Crear nuevo producto (con imagen)
  const crearProducto = async (formData) => {
    try {
      if (!(formData instanceof FormData)) {
        throw new Error("crearProducto requiere una instancia de FormData");
      }
      const res = await axios.post(`${API_URL}/crear`, formData);
      Notify.create({ type: "positive", message: "Producto creado exitosamente" });
      return res.data;
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response?.data?.msg || error.response?.data?.error || "Error al crear producto",
      });
      console.log(error);
      return null;
    }
  };

  // Editar producto
  const editarProducto = async (id, formData) => {
    try {
      const res = await axios.put(`${API_URL}/editar/${id}`, formData);
      Notify.create({ type: "positive", message: "Producto editado exitosamente" });
      return res.data;
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response?.data?.msg || error.response?.data?.error || "Error al editar producto",
      });
      console.log(error);
      return null;
    }
  };

  // Eliminar producto
  const eliminarProducto = async (id) => {
    try {
      await axios.delete(`${API_URL}/eliminar/${id}`);
      Notify.create({ type: "positive", message: "Producto eliminado exitosamente" });
      // Actualizar la lista de productos después de eliminar
      await listarProductos();
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response?.data?.msg || error.response?.data?.error || "Error al eliminar producto",
      });
      console.log(error);
    }
  };

  // Activar producto
  const activarProducto = async (id) => {
    try {
      await axios.put(`${API_URL}/activar/${id}`);
      Notify.create({ type: "positive", message: "Producto activado exitosamente" });
      await listarProductos();
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response?.data?.msg || error.response?.data?.error || "Error al activar producto",
      });
      console.log(error);
    }
  };

  // Desactivar producto
  const desactivarProducto = async (id) => {
    try {
      await axios.put(`${API_URL}/desactivar/${id}`);
      Notify.create({ type: "warning", message: "Producto desactivado exitosamente" });
      await listarProductos();
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response?.data?.msg || error.response?.data?.error || "Error al desactivar producto",
      });
      console.log(error);
    }
  };

  return {
    productos,
    producto,
    listarProductos,
    obtenerProductoPorId,
    crearProducto,
    editarProducto,
    eliminarProducto,
    activarProducto,
    desactivarProducto
  };
});