# 📝 Guía: Cómo Llenar la Información de la Finca en MongoDB

## 🎯 Objetivo

Esta guía te ayudará a crear y actualizar la información de la **Finca Maranatha** en MongoDB para que se muestre correctamente en el componente Home.vue.

---

## 📋 Paso 1: Preparar los Datos

### Estructura Completa del Documento

```javascript
{
  // ===== INFORMACIÓN BÁSICA =====
  nombre: "Finca Maranatha",
  descripcion: "Somos una finca agropecuaria familiar dedicada a la producción sostenible de alimentos frescos y de alta calidad. Con más de 20 años de experiencia, nos especializamos en cultivar productos orgánicos que respetan el medio ambiente y promueven la salud de nuestros clientes.",
  ubicacion: "Vereda San José, Km 5 vía Municipio - Vereda, Departamento, Colombia",
  
  // ===== INFORMACIÓN INSTITUCIONAL =====
  mision: "Producir alimentos de alta calidad mediante prácticas agrícolas sostenibles, garantizando la seguridad alimentaria de nuestras comunidades y el cuidado del medio ambiente.",
  vision: "Ser reconocidos como líderes en producción agropecuaria sostenible a nivel regional, promoviendo el desarrollo rural y el bienestar de las familias campesinas.",
  objetivos: "Implementar técnicas de agricultura ecológica, fortalecer la economía local y educar a la comunidad sobre prácticas agrícolas responsables.",
  alcance: "Atendemos a nivel local y regional, distribuyendo nuestros productos a mercados campesinos, tiendas naturistas y directamente a consumidores finales.",
  historia: "Fundada en el año 2000 por la familia Martínez, la Finca Maranatha comenzó como un pequeño cultivo familiar. Con el paso de los años y el compromiso con la calidad, hemos crecido hasta convertirnos en un referente de producción sostenible en la región.",
  
  // ===== TIPOS DE PRODUCTOS =====
  tipoProductos: [
    "Frutas Frescas",
    "Verduras Orgánicas",
    "Lácteos Artesanales",
    "Huevos de Campo",
    "Mieles y Derivados"
  ],
  
  // ===== CERTIFICACIONES =====
  certificaciones: [
    "Producción Orgánica",
    "Buenas Prácticas Agrícolas (BPA)",
    "Certificación de Agricultura Familiar",
    "Sello de Comercio Justo"
  ],
  
  // ===== CONTACTO =====
  telefono: "6012345678",
  whatsapp: "573001234567",
  email: "info@fincamaranatha.com",
  direccion: "Vereda San José, Km 5 vía Municipio - Vereda",
  facebook: "https://www.facebook.com/fincamaranatha",
  instagram: "https://www.instagram.com/fincamaranatha",
  horarioAtencion: "Lunes a Viernes: 7:00 AM - 5:00 PM | Sábados: 8:00 AM - 12:00 PM",
  
  // ===== IMÁGENES =====
  logo: "http://localhost:1598/uploads/finca/logo-maranatha.png",
  imagenesFinca: [
    "http://localhost:1598/uploads/finca/imagen1.jpg",
    "http://localhost:1598/uploads/finca/imagen2.jpg",
    "http://localhost:1598/uploads/finca/imagen3.jpg",
    "http://localhost:1598/uploads/finca/imagen4.jpg"
  ]
}
```

---

## 🔧 Paso 2: Crear la Información de la Finca

### Opción A: Usando Postman o Insomnia

**Endpoint:** `POST http://localhost:1598/api/finca/crear`

**Headers:**
```
Content-Type: multipart/form-data
x-token: TU_TOKEN_DE_ADMIN
```

**Body (form-data):**

| Key | Value | Type |
|-----|-------|------|
| nombre | Finca Maranatha | text |
| descripcion | Somos una finca agropecuaria... | text |
| ubicacion | Vereda San José, Km 5... | text |
| mision | Producir alimentos de alta calidad... | text |
| vision | Ser reconocidos como líderes... | text |
| historia | Fundada en el año 2000... | text |
| objetivos | Implementar técnicas de agricultura... | text |
| alcance | Atendemos a nivel local y regional... | text |
| telefono | 6012345678 | text |
| whatsapp | 573001234567 | text |
| email | info@fincamaranatha.com | text |
| direccion | Vereda San José, Km 5... | text |
| facebook | https://www.facebook.com/fincamaranatha | text |
| instagram | https://www.instagram.com/fincamaranatha | text |
| horarioAtencion | Lunes a Viernes: 7:00 AM - 5:00 PM | text |
| tipoProductos[] | Frutas Frescas | text |
| tipoProductos[] | Verduras Orgánicas | text |
| tipoProductos[] | Lácteos Artesanales | text |
| certificaciones[] | Producción Orgánica | text |
| certificaciones[] | Buenas Prácticas Agrícolas (BPA) | text |
| logo | (archivo logo.png) | file |
| imagenesFinca | (archivo imagen1.jpg) | file |
| imagenesFinca | (archivo imagen2.jpg) | file |
| imagenesFinca | (archivo imagen3.jpg) | file |

---

### Opción B: Usando cURL

```bash
curl -X POST http://localhost:1598/api/finca/crear \
  -H "x-token: TU_TOKEN_DE_ADMIN" \
  -F "nombre=Finca Maranatha" \
  -F "descripcion=Somos una finca agropecuaria familiar dedicada a la producción sostenible..." \
  -F "ubicacion=Vereda San José, Km 5 vía Municipio" \
  -F "mision=Producir alimentos de alta calidad mediante prácticas agrícolas sostenibles..." \
  -F "vision=Ser reconocidos como líderes en producción agropecuaria sostenible..." \
  -F "telefono=6012345678" \
  -F "whatsapp=573001234567" \
  -F "email=info@fincamaranatha.com" \
  -F "direccion=Vereda San José, Km 5" \
  -F "horarioAtencion=Lunes a Viernes: 7:00 AM - 5:00 PM" \
  -F "tipoProductos[]=Frutas Frescas" \
  -F "tipoProductos[]=Verduras Orgánicas" \
  -F "certificaciones[]=Producción Orgánica" \
  -F "logo=@/ruta/a/logo.png" \
  -F "imagenesFinca=@/ruta/a/imagen1.jpg" \
  -F "imagenesFinca=@/ruta/a/imagen2.jpg"
```

---

### Opción C: Desde el Panel de Administración

1. Inicia sesión como administrador
2. Ve a la sección "Configuración de Finca" o similar
3. Completa el formulario con todos los campos
4. Sube el logo y las imágenes de la finca
5. Guarda los cambios

---

## 🖼️ Paso 3: Preparar las Imágenes

### Recomendaciones para las Imágenes

#### Logo de la Finca
- **Formato:** PNG (con fondo transparente) o JPG
- **Dimensiones recomendadas:** 400x400px o similar (cuadrado)
- **Peso máximo:** 500KB
- **Calidad:** Alta resolución

#### Imágenes de la Finca (Galería)
- **Formato:** JPG o PNG
- **Dimensiones recomendadas:** 1200x800px (landscape)
- **Peso máximo por imagen:** 2MB
- **Cantidad recomendada:** 4-6 imágenes
- **Contenido sugerido:**
  - Vista panorámica de la finca
  - Cultivos principales
  - Instalaciones
  - Productos cosechados
  - Personal trabajando (opcional)

---

## ✅ Paso 4: Verificar la Información

### 1. Verificar desde el Backend

**Endpoint de verificación:**
```
GET http://localhost:1598/api/finca/publica
```

**Respuesta esperada:**
```json
{
  "ok": true,
  "finca": {
    "nombre": "Finca Maranatha",
    "descripcion": "...",
    // ... todos los campos
  }
}
```

### 2. Verificar desde el Frontend

1. Abre el navegador en `http://localhost:9000` (o tu puerto)
2. Deberías ver:
   - ✅ El nombre de la finca en el header
   - ✅ La descripción en "Sobre Nosotros"
   - ✅ El logo (si lo subiste)
   - ✅ La galería de imágenes
   - ✅ Los datos de contacto
   - ✅ Los tipos de productos
   - ✅ Las certificaciones

---

## 🔄 Paso 5: Actualizar la Información

Si necesitas modificar la información después de crearla:

**Endpoint:** `PUT http://localhost:1598/api/finca/actualizar`

Usa el mismo formato que para crear, pero con el método PUT.

---

## 📝 Ejemplos de Contenido

### Descripción Atractiva

```
Somos una finca agropecuaria familiar ubicada en el corazón de [tu región], 
dedicada a la producción sostenible y responsable de alimentos frescos. Con más 
de [X] años de experiencia, cultivamos la tierra con amor y respeto, ofreciendo 
a nuestros clientes productos de la más alta calidad, libres de químicos y 
cultivados bajo prácticas orgánicas certificadas.

Nuestra finca es un espacio donde la tradición se encuentra con la innovación, 
donde cada cultivo es cuidado con esmero y donde el bienestar de nuestros 
clientes es nuestra prioridad. Creemos en la agricultura como un arte que 
alimenta el cuerpo y el alma, y nos comprometemos a llevar a tu mesa lo mejor 
de nuestra tierra.
```

### Misión Inspiradora

```
Producir alimentos de alta calidad mediante prácticas agrícolas sostenibles, 
garantizando la seguridad alimentaria de nuestras comunidades, promoviendo el 
desarrollo rural y cuidando el medio ambiente para las generaciones futuras.
```

### Visión Ambiciosa

```
Ser reconocidos como líderes en producción agropecuaria sostenible a nivel 
regional, siendo un modelo de agricultura familiar que inspire a otras fincas 
a adoptar prácticas responsables y a valorar el trabajo de las familias 
campesinas.
```

---

## 🎨 Tips de Redacción

### Para la Descripción:
- ✅ Usa un lenguaje cálido y cercano
- ✅ Menciona tu experiencia (años en el negocio)
- ✅ Destaca lo que te hace único
- ✅ Habla de tus valores (sostenibilidad, calidad, tradición)
- ✅ Invita a conocer más sobre tus productos

### Para la Misión:
- ✅ Explica qué haces (tu actividad principal)
- ✅ Menciona cómo lo haces (tu enfoque)
- ✅ Indica para quién lo haces (tus clientes/comunidad)

### Para la Visión:
- ✅ Proyecta hacia el futuro
- ✅ Define dónde quieres estar en 5-10 años
- ✅ Inspira y motiva

---

## 🚨 Errores Comunes y Soluciones

### Error: "Ya existe información de la finca"

**Solución:** Usa el endpoint de actualización (PUT) en lugar del de creación (POST).

### Error: "Token inválido"

**Solución:** Asegúrate de estar autenticado como administrador y de incluir el token en los headers.

### Error: Las imágenes no se suben

**Solución:** 
- Verifica que el backend acepte `multipart/form-data`
- Asegúrate de que la carpeta de uploads tenga permisos de escritura
- Revisa el tamaño máximo de archivo permitido

### Error: Los arrays no se guardan correctamente

**Solución:** Usa la sintaxis correcta:
- `tipoProductos[]` en lugar de `tipoProductos`
- `certificaciones[]` en lugar de `certificaciones`

---

## 📊 Checklist Final

Antes de ir a producción, verifica:

- [ ] El nombre de la finca está correcto
- [ ] La descripción es atractiva y sin errores
- [ ] La ubicación es precisa
- [ ] La misión y visión están definidas
- [ ] Los datos de contacto están actualizados
- [ ] El logo está subido y se ve bien
- [ ] Las imágenes de la galería son de buena calidad
- [ ] Los tipos de productos son correctos
- [ ] Las certificaciones están listadas
- [ ] El horario de atención es actual
- [ ] Los enlaces de redes sociales funcionan

---

## 🎯 Resultado Final

Una vez completados todos los pasos, tu Home debe mostrar:

1. ✅ Header con el nombre de la finca
2. ✅ Hero banner atractivo
3. ✅ Sección "Sobre Nosotros" completa con:
   - Nombre y ubicación
   - Logo
   - Descripción
   - Misión y visión
   - Certificaciones
   - Galería de imágenes
   - Horario de atención
4. ✅ Sección "¿Qué producimos?" con chips
5. ✅ Categorías de productos
6. ✅ Productos disponibles
7. ✅ Sección de contacto con todos los datos
8. ✅ Footer con copyright

---

**¡Tu Finca Maranatha está lista para mostrar al mundo! 🌿**
