import { defineStore } from "pinia";
import { ref, watch } from "vue";
import axios from "axios";
import { Notify } from "quasar";

const API_URL = "http://localhost:1598/api/carrito";

export const useCarritoStore = defineStore("carrito", () => {
  const carritos = ref([]);
  const carrito = ref({ productos: [] });
  const total = ref(0);

  // Crear o actualizar carrito
  const crearCarrito = async (productos) => {
    try {
      const res = await axios.post(`${API_URL}/crear`, { productos });
      carrito.value = res.data.carrito;
      total.value = res.data.total;
      Notify.create({ type: "positive", message: res.data.msg || "Añadido, Carrito actualizado" });
      return res.data;
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response?.data?.msg || error.response?.data?.error || "Error al crear/actualizar carrito",
      });
      console.log(error);
      return null;
    }

  };

  // Listar carritos
  const listarCarritos = async () => {
    try {
      const r = await axios.get(`${API_URL}/listar`);
      carritos.value = r.data;
    } catch (error) {
      Notify.create({
        type: "negative",
        message: "Error al cargar carritos",
      });
      console.log(error);
    }
  };

  // Obtener carrito por ID
  const obtenerCarritoPorId = async (id) => {
    try {
      const r = await axios.get(`${API_URL}/listar/${id}`);
      carrito.value = r.data;
      return r.data;
    } catch (error) {
      Notify.create({
        type: "negative",
        message: "Error al cargar el carrito",
      });
      console.log(error);
      return null;
    }
  };

  // Editar carrito (quitar productos)
  const editarCarrito = async (id, productos) => {
    try {
      // CAMBIO: usa la ruta /quitar/:id
      const res = await axios.put(`${API_URL}/quitar/${id}`, { productos });
      carrito.value = res.data.carrito;
      total.value = res.data.total;
      // Notify.create({ type: "positive", message: res.data.msg || "Carrito eliminado" });
      return res.data;
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response?.data?.msg || error.response?.data?.error || "Error al quitar carrito",
      });
      console.log(error);
      return null;
    }
  };

  // Eliminar carrito
  const eliminarCarrito = async (id) => {
    try {
      const res = await axios.delete(`${API_URL}/eliminar/${id}`);
      Notify.create({ type: "negative", message: res.data.msg || "Carrito eliminado" });
      carrito.value = null;
      total.value = 0;
      await listarCarritos();
      return res.data;
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response?.data?.msg || error.response?.data?.error || "Error al eliminar carrito",
      });
      console.log(error);
      return null;
    }
  };

  // Activar carrito
  const activarCarrito = async (id) => {
    try {
      const res = await axios.put(`${API_URL}/activar/${id}`);
      Notify.create({ type: "positive", message: res.data.msg || "Carrito activado" });
      return res.data;
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response?.data?.msg || error.response?.data?.error || "Error al activar carrito",
      });
      console.log(error);
      return null;
    }
  };

  // Desactivar carrito
  const desactivarCarrito = async (id) => {
    try {
      const res = await axios.put(`${API_URL}/desactivar/${id}`);
      Notify.create({ type: "positive", message: res.data.msg || "Carrito desactivado" });
      return res.data;
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response?.data?.msg || error.response?.data?.error || "Error al desactivar carrito",
      });
      console.log(error);
      return null;
    }
  };



  watch(() => carrito.value.productos, (newVal) => {
    // tu lógica aquí
  }, { deep: true })

  return {
    carritos,
    carrito,
    total,
    crearCarrito,
    listarCarritos,
    obtenerCarritoPorId,
    editarCarrito,
    eliminarCarrito,
    activarCarrito,
    desactivarCarrito,
  };
  
});
