import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { Notify } from "quasar";
import { useStoreUsuarios } from "./usuario.js"; // Importa el store de usuario

const API_URL = "http://localhost:1598/api/marca";

export const useMarcaStore = defineStore("marca", () => {
  const marcas = ref([]);
  const marca = ref(null);

  // Función para insertar el token en axios
  function insertarToken() {
    const usuarioStore = useStoreUsuarios();
    if (usuarioStore.token) {
      axios.defaults.headers.common["x-token"] = usuarioStore.token;
    }
  }

  // Listar todas las marcas
  const listarMarcas = async () => {
    try {
      insertarToken();
      const r = await axios.get(`${API_URL}/listarMarcas`);
      marcas.value = r.data;
    } catch (error) {
      Notify.create({
        type: "negative",
        message: "Error al cargar marcas",
      });
      console.log(error);
    }
  };

  // Obtener marca por ID
  const obtenerMarcaPorId = async (id) => {
    try {
      insertarToken();
      const r = await axios.get(`${API_URL}/listar/${id}`);
      marca.value = r.data;
      return r.data;
    } catch (error) {
      Notify.create({
        type: "negative",
        message: "Error al cargar la marca",
      });
      console.log(error);
      return null;
    }
  };

  // Crear nueva marca
  const crearMarca = async (payload) => {
    try {
      insertarToken();
      const res = await axios.post(`${API_URL}/crear`, payload);
      Notify.create({ type: "positive", message: "Marca creada exitosamente" });
      return res.data;
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response?.data?.error || "Error al crear marca",
      });
      console.log(error);
      return null;
    }
  };

  // Editar marca
  const editarMarca = async (id, payload) => {
    try {
      insertarToken();
      const r = await axios.put(`${API_URL}/editar/${id}`, payload);
      return r.data;
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response?.data?.error || "Error al editar marca",
      });
      console.log(error);
      return null;
    }
  };

  // Activar marca
  const activarMarca = async (id) => {
    try {
      insertarToken();
      const r = await axios.put(`${API_URL}/activar/${id}`);
      return r.data;
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response?.data?.error || "Error al activar marca",
      });
      console.log(error);
      return null;
    }
  };

  // Desactivar marca
  const desactivarMarca = async (id) => {
    try {
      insertarToken();
      const r = await axios.put(`${API_URL}/desactivar/${id}`);
      return r.data;
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response?.data?.error || "Error al desactivar marca",
      });
      console.log(error);
      return null;
    }
  };

  return {
    marcas,
    marca,
    listarMarcas,
    obtenerMarcaPorId,
    crearMarca,
    editarMarca,
    activarMarca,
    desactivarMarca,
  };
});
