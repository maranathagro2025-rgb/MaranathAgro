# 🧪 Prueba de Integración - Finca con MongoDB

## 📋 Datos de la Finca Cargados

Según la información proporcionada, tienes los siguientes datos en MongoDB:

```javascript
{
  _id: "690b7f1a949673f07a29fca9",
  nombre: "Finca los SAUCES",
  ubicacion: "Vereda El Paraíso, Municipio Verde, Colombia",
  descripcion: "Finca familiar dedicada a la producción de frutas y verduras orgánicas…",
  mision: "Producir alimentos sanos y naturales respetando el medio ambiente",
  vision: "Ser reconocidos como la mejor finca orgánica de la región para 2030",
  alcance: "Mercado local, regional y nacional",
  telefono: "+57 300 123 4567",
  email: "info@fincanaranjos.com",
  direccion: "Km 15 vía al pueblo, Vereda El Paraíso",
  instagram: "https://instagram.com/fincanaranjos",
  facebook: "https://facebook.com/fincanaranjos",
  whatsapp: "+57 300 123 4567",
  horarioAtencion: "Lunes a Sábado: 7:00 AM - 4:00 PM, Domingos: 8:00 AM - 12:00 PM",
  tipoProductos: [
    "Frutas orgánicas",
    "Verduras frescas",
    "Hierbas aromáticas",
    "Productos procesados"
  ],
  certificaciones: [/* Array de 3 elementos */],
  logo: "https://res.cloudinary.com/dyjko9uf4/image/upload/v1762379866/finca/kd…",
  imagenesFinca: [/* Array de 1 imagen */],
  estado: 1,
  createdAt: "2025-11-05T16:45:14.509+00:00",
  updatedAt: "2025-11-10T13:58:57.304+00:00"
}
```

---

## 🚀 Pasos para Probar

### 1. Verifica que el Backend esté corriendo

```bash
# El backend debe estar en:
http://localhost:1598
```

### 2. Prueba el Endpoint Directamente

Abre tu navegador o Postman y prueba:

```
GET http://localhost:1598/api/finca/publica
```

**Respuesta esperada:**
```json
{
  "ok": true,
  "finca": {
    "nombre": "Finca los SAUCES",
    // ... todos los campos
  }
}
```

### 3. Inicia el Frontend

```bash
cd C:\PROYECTOSSENA\Maranathagro\frontFinca
npm run dev
```

### 4. Abre el Navegador

```
http://localhost:9000
```
(O el puerto que estés usando)

### 5. Abre la Consola del Navegador

Presiona `F12` y ve a la pestaña "Console"

---

## 🔍 Qué Deberías Ver en la Consola

Si todo funciona correctamente, deberías ver estos mensajes:

```
🚀 Iniciando carga de datos de la finca...
🌿 Solicitando información de la finca desde: http://localhost:1598/api/finca/publica
✅ Información de la finca recibida: {...}
✅ Datos cargados exitosamente
📊 Información de la finca: { nombre: "Finca los SAUCES", ... }
📋 Info procesada: { nombre: "Finca los SAUCES", descripcion: "...", ... }
📞 Contacto: { telefono: "+57 300 123 4567", whatsapp: "+57 300 123 4567", ... }
🖼️ Galería: [...]
🏢 Institucional: { tipoProductos: [...], certificaciones: [...] }
```

---

## ✅ Verificación Visual en el Home

### Header
- ✅ Debería decir "FINCA LOS SAUCES" (en mayúsculas si así está en BD)

### Hero Banner
- ✅ Título: "Finca Maranatha" (estático)
- ✅ Subtítulo: "Calidad y tradición agropecuaria" (estático)

### Sección "Sobre Nosotros"
- ✅ **Título**: "Finca los SAUCES"
- ✅ **Ubicación**: "📍 Vereda El Paraíso, Municipio Verde, Colombia"
- ✅ **Descripción**: "Finca familiar dedicada a la producción de frutas y verduras orgánicas…"
- ✅ **Misión**: "Producir alimentos sanos y naturales respetando el medio ambiente"
- ✅ **Visión**: "Ser reconocidos como la mejor finca orgánica de la región para 2030"
- ✅ **Logo**: Imagen de Cloudinary (si se cargó correctamente)
- ✅ **Galería**: Carousel con la(s) imagen(es)
- ✅ **Horario**: Card con "Lunes a Sábado: 7:00 AM - 4:00 PM, Domingos: 8:00 AM - 12:00 PM"

### Sección "¿Qué Producimos?"
- ✅ Chips con:
  - Frutas orgánicas
  - Verduras frescas
  - Hierbas aromáticas
  - Productos procesados

### Sección de Contacto
- ✅ **WhatsApp**: "+57 300 123 4567"
- ✅ **Teléfono**: "+57 300 123 4567"
- ✅ **Email**: "info@fincanaranjos.com"
- ✅ **Dirección**: "Km 15 vía al pueblo, Vereda El Paraíso"
- ✅ **Redes Sociales**: Botones de Facebook e Instagram

---

## 🐛 Solución de Problemas

### Problema 1: No se carga nada

**Posibles causas:**
1. El backend no está corriendo
2. El puerto del backend es diferente a 1598
3. CORS bloqueado

**Solución:**
```bash
# Verifica que el backend esté corriendo
# Abre: http://localhost:1598/api/finca/publica

# Si el puerto es diferente, edita:
# src/stores/finca.js línea 6
const API_URL = "http://localhost:TU_PUERTO/api/finca";
```

### Problema 2: Error CORS

**Solución en el Backend:**
```javascript
// Asegúrate de tener CORS habilitado en tu backend
app.use(cors({
  origin: 'http://localhost:9000', // Tu puerto del frontend
  credentials: true
}));
```

### Problema 3: La información aparece como "null" o "undefined"

**Verifica en la consola:**
```javascript
// Si ves esto:
📊 Información de la finca: null

// Significa que el endpoint no está retornando datos
// Verifica el backend y la base de datos
```

### Problema 4: Las imágenes no se cargan

**Verifica:**
1. Que las URLs de Cloudinary estén completas
2. Que el campo `logo` e `imagenesFinca` tengan URLs válidas
3. En la consola, busca errores 404

---

## 🎯 Checklist de Verificación

### Backend
- [ ] Backend corriendo en `http://localhost:1598`
- [ ] Endpoint `/api/finca/publica` responde correctamente
- [ ] Los datos están en MongoDB
- [ ] CORS está habilitado

### Frontend
- [ ] Frontend corriendo (npm run dev)
- [ ] No hay errores en la consola del navegador
- [ ] Los console.log muestran la información correctamente

### Visualización
- [ ] El nombre de la finca aparece en el header
- [ ] La sección "Sobre Nosotros" muestra todos los datos
- [ ] El logo se carga (si existe)
- [ ] La galería muestra imágenes (si existen)
- [ ] Los tipos de productos aparecen como chips
- [ ] La información de contacto está completa
- [ ] Los botones de redes sociales funcionan

---

## 📸 Captura de Pantalla de Consola Esperada

```
🚀 Iniciando carga de datos de la finca...
🌿 Solicitando información de la finca desde: http://localhost:1598/api/finca/publica

✅ Información de la finca recibida: 
{
  ok: true,
  finca: {
    nombre: "Finca los SAUCES",
    ubicacion: "Vereda El Paraíso, Municipio Verde, Colombia",
    descripcion: "Finca familiar dedicada a la producción...",
    mision: "Producir alimentos sanos y naturales...",
    vision: "Ser reconocidos como la mejor finca...",
    telefono: "+57 300 123 4567",
    email: "info@fincanaranjos.com",
    whatsapp: "+57 300 123 4567",
    tipoProductos: ["Frutas orgánicas", "Verduras frescas", ...],
    logo: "https://res.cloudinary.com/...",
    imagenesFinca: ["https://res.cloudinary.com/..."]
  }
}

✅ Datos cargados exitosamente
📊 Información de la finca: {nombre: "Finca los SAUCES", ...}
📋 Info procesada: {nombre: "Finca los SAUCES", descripcion: "...", ...}
📞 Contacto: {telefono: "+57 300 123 4567", whatsapp: "+57 300 123 4567", ...}
🖼️ Galería: ["https://res.cloudinary.com/..."]
🏢 Institucional: {tipoProductos: Array(4), certificaciones: Array(3), ...}
```

---

## 🎉 Si Todo Funciona...

Deberías ver:
1. ✅ Nombre de la finca en el header: **"FINCA LOS SAUCES"**
2. ✅ Todos los datos de contacto funcionando
3. ✅ Las imágenes de Cloudinary cargadas
4. ✅ Los 4 tipos de productos en chips
5. ✅ Misión y visión mostradas
6. ✅ Horario de atención visible

---

## 📞 Siguiente Paso

Si todo funciona correctamente, puedes:
1. Quitar los `console.log` de debug (opcional)
2. Agregar más imágenes a la galería
3. Completar las certificaciones
4. Personalizar los estilos según tu marca

---

**¡Felicidades! Tu finca está conectada a MongoDB correctamente! 🌿**
