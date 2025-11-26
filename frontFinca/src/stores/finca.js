import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { Notify } from "quasar";

const API_URL = "http://localhost:9815/api/finca";

export const useFincaStore = defineStore("finca", () => {
  const finca = ref(null);
  const fincaPublica = ref(null);
  const infoBasica = ref(null);
  const contacto = ref(null);
  const institucional = ref(null);
  const galeria = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // ===== RUTAS GET =====

  // GET - Obtener información de la finca (administración) - Requiere autenticación
  const obtenerFinca = async () => {
    try {
      loading.value = true;
      error.value = null;
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${API_URL}/info`, {
        headers: {
          "x-token": token,
        },
      });
      console.log('✅ Finca (admin):', data);
      finca.value = data.finca;
      return data;
    } catch (err) {
      error.value = err.message;
      console.error("❌ Error al obtener finca:", err);
      Notify.create({
        type: "negative",
        message: err.response?.data?.msg || "Error al cargar información de la finca",
      });
      return null;
    } finally {
      loading.value = false;
    }
  };

  // GET - Información pública de la finca (sin autenticación) ⭐ CORREGIDO
  const obtenerFincaPublica = async () => {
    try {
      loading.value = true;
      error.value = null;
      console.log('🌿 Solicitando información de la finca desde:', `${API_URL}/publica`);
      
      const { data } = await axios.get(`${API_URL}/publica`);
      

      
      // ⭐ CORRECCIÓN: Acceder a data.finca
      fincaPublica.value = data.finca;
      
      return data;
    } catch (err) {
      error.value = err.message;
      console.error("❌ Error al obtener finca pública:", err);
      console.error("📋 Detalles del error:", err.response?.data);
      
      Notify.create({
        type: "negative",
        message: err.response?.data?.msg || "Error al cargar información pública de la finca",
      });
      return null;
    } finally {
      loading.value = false;
    }
  };

  // GET - Solo información básica (nombre, ubicación, descripción, logo) ⭐ CORREGIDO
  const obtenerInfoBasica = async () => {
    try {
      loading.value = true;
      error.value = null;
      const { data } = await axios.get(`${API_URL}/basica`);
      console.log('✅ Info básica:', data);
      infoBasica.value = data.finca; // ⭐ CORRECCIÓN
      return data;
    } catch (err) {
      error.value = err.message;
      console.error("❌ Error al obtener info básica:", err);
      Notify.create({
        type: "negative",
        message: err.response?.data?.msg || "Error al cargar información básica",
      });
      return null;
    } finally {
      loading.value = false;
    }
  };

  // GET - Solo información de contacto ⭐ CORREGIDO
  const obtenerContacto = async () => {
    try {
      loading.value = true;
      error.value = null;
      const { data } = await axios.get(`${API_URL}/contacto`);
      console.log('✅ Contacto:', data);
      contacto.value = data.contacto; // ⭐ CORRECCIÓN
      return data;
    } catch (err) {
      error.value = err.message;
      console.error("❌ Error al obtener contacto:", err);
      Notify.create({
        type: "negative",
        message: err.response?.data?.msg || "Error al cargar información de contacto",
      });
      return null;
    } finally {
      loading.value = false;
    }
  };

  // GET - Solo información institucional ⭐ CORREGIDO
  const obtenerInstitucional = async () => {
    try {
      loading.value = true;
      error.value = null;
      const { data } = await axios.get(`${API_URL}/institucional`);
      console.log('✅ Institucional:', data);
      institucional.value = data.institucional; // ⭐ CORRECCIÓN
      return data;
    } catch (err) {
      error.value = err.message;
      console.error("❌ Error al obtener info institucional:", err);
      Notify.create({
        type: "negative",
        message: err.response?.data?.msg || "Error al cargar información institucional",
      });
      return null;
    } finally {
      loading.value = false;
    }
  };

  // GET - Solo galería de imágenes ⭐ CORREGIDO
  const obtenerGaleria = async () => {
    try {
      loading.value = true;
      error.value = null;
      const { data } = await axios.get(`${API_URL}/galeria`);
      console.log('✅ Galería:', data);
      galeria.value = data.galeria; // ⭐ CORRECCIÓN
      return data;
    } catch (err) {
      error.value = err.message;
      console.error("❌ Error al obtener galería:", err);
      Notify.create({
        type: "negative",
        message: err.response?.data?.msg || "Error al cargar galería",
      });
      return null;
    } finally {
      loading.value = false;
    }
  };

  // ===== RUTAS POST =====

  // POST - Crear información de finca (solo si no existe)
  const crearFinca = async (formData) => {
    try {
      if (!(formData instanceof FormData)) {
        throw new Error("crearFinca requiere una instancia de FormData");
      }
      loading.value = true;
      error.value = null;
      const token = localStorage.getItem("token");
      const { data } = await axios.post(`${API_URL}/crear`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-token": token,
        },
      });
      console.log('✅ Finca creada:', data);
      finca.value = data.finca;
      Notify.create({
        type: "positive",
        message: data.msg || "Información de finca creada exitosamente",
      });
      return data;
    } catch (err) {
      error.value = err.message;
      console.error("❌ Error al crear finca:", err);
      Notify.create({
        type: "negative",
        message: err.response?.data?.msg || "Error al crear información de finca",
      });
      return null;
    } finally {
      loading.value = false;
    }
  };

  // ===== RUTAS PUT =====

  // PUT - Actualizar información de la finca
  const actualizarFinca = async (formData) => {
    try {
      if (!(formData instanceof FormData)) {
        throw new Error("actualizarFinca requiere una instancia de FormData");
      }
      loading.value = true;
      error.value = null;
      const token = localStorage.getItem("token");
      const { data } = await axios.put(`${API_URL}/actualizar`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-token": token,
        },
      });
      console.log('✅ Finca actualizada:', data);
      finca.value = data.finca;
      Notify.create({
        type: "positive",
        message: data.msg || "Información de finca actualizada exitosamente",
      });
      return data;
    } catch (err) {
      error.value = err.message;
      console.error("❌ Error al actualizar finca:", err);
      Notify.create({
        type: "negative",
        message: err.response?.data?.msg || "Error al actualizar información de finca",
      });
      return null;
    } finally {
      loading.value = false;
    }
  };

  // ===== RUTAS DELETE =====

  // DELETE - Eliminar imagen de finca por índice
  const eliminarImagenFinca = async (index) => {
    try {
      loading.value = true;
      error.value = null;
      const token = localStorage.getItem("token");
      const { data } = await axios.delete(`${API_URL}/imagen/${index}`, {
        headers: {
          "x-token": token,
        },
      });
      console.log('✅ Imagen eliminada:', data);
      finca.value = data.finca;
      
      // Actualizar galería si existe
      if (galeria.value) {
        await obtenerGaleria();
      }
      
      Notify.create({
        type: "positive",
        message: data.msg || "Imagen eliminada exitosamente",
      });
      return data;
    } catch (err) {
      error.value = err.message;
      console.error("❌ Error al eliminar imagen:", err);
      Notify.create({
        type: "negative",
        message: err.response?.data?.msg || "Error al eliminar imagen",
      });
      return null;
    } finally {
      loading.value = false;
    }
  };

  // ===== UTILIDADES =====

  // Limpiar estado
  const limpiarFinca = () => {
    finca.value = null;
  };

  const limpiarFincaPublica = () => {
    fincaPublica.value = null;
  };

  const limpiarTodo = () => {
    finca.value = null;
    fincaPublica.value = null;
    infoBasica.value = null;
    contacto.value = null;
    institucional.value = null;
    galeria.value = null;
    error.value = null;
  };

  // Helper para construir FormData
  const construirFormData = (datos) => {
    const formData = new FormData();

    // Campos de texto
    const camposTexto = [
      'nombre', 'ubicacion', 'descripcion', 'mision', 'vision', 
      'objetivos', 'alcance', 'historia', 'telefono', 'email', 
      'direccion', 'instagram', 'facebook', 'whatsapp', 'horarioAtencion'
    ];

    camposTexto.forEach(campo => {
      if (datos[campo] !== undefined && datos[campo] !== null) {
        formData.append(campo, datos[campo]);
      }
    });

    // Arrays
    if (datos.tipoProductos && Array.isArray(datos.tipoProductos)) {
      datos.tipoProductos.forEach(tipo => {
        formData.append('tipoProductos[]', tipo);
      });
    }

    if (datos.certificaciones && Array.isArray(datos.certificaciones)) {
      datos.certificaciones.forEach(cert => {
        formData.append('certificaciones[]', cert);
      });
    }

    // Logo (archivo único)
    if (datos.logo && datos.logo instanceof File) {
      formData.append('logo', datos.logo);
    }

    // Imágenes de la finca (múltiples archivos)
    if (datos.imagenesFinca && Array.isArray(datos.imagenesFinca)) {
      datos.imagenesFinca.forEach(imagen => {
        if (imagen instanceof File) {
          formData.append('imagenesFinca', imagen);
        }
      });
    }

    return formData;
  };

  return {
    // Estado
    finca,
    fincaPublica,
    infoBasica,
    contacto,
    institucional,
    galeria,
    loading,
    error,

    // GET - Métodos de consulta
    obtenerFinca,
    obtenerFincaPublica,
    obtenerInfoBasica,
    obtenerContacto,
    obtenerInstitucional,
    obtenerGaleria,

    // POST - Métodos de creación
    crearFinca,

    // PUT - Métodos de actualización
    actualizarFinca,

    // DELETE - Métodos de eliminación
    eliminarImagenFinca,

    // Utilidades
    limpiarFinca,
    limpiarFincaPublica,
    limpiarTodo,
    construirFormData,
  };
});
