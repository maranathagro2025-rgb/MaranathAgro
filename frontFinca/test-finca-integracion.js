// 🧪 Script de Prueba Rápida - Finca Maranatha
// Copia y pega este código en la consola del navegador (F12)

console.log('%c🧪 Iniciando Prueba de Integración con MongoDB', 'color: green; font-size: 16px; font-weight: bold');

// Verificar que axios esté disponible
if (typeof axios === 'undefined') {
  console.log('%c⚠️ Axios no está disponible en window, usando fetch...', 'color: orange');
  
  // Usar fetch como alternativa
  fetch('http://localhost:1598/api/finca/publica')
    .then(response => response.json())
    .then(data => {
      console.log('%c✅ Respuesta del servidor:', 'color: green; font-weight: bold');
      console.log(data);
      
      if (data.ok && data.finca) {
        console.log('%c🎉 ¡Datos recibidos correctamente!', 'color: green; font-size: 14px');
        console.table({
          'Nombre': data.finca.nombre,
          'Ubicación': data.finca.ubicacion,
          'Email': data.finca.email,
          'WhatsApp': data.finca.whatsapp,
          'Tiene Logo': data.finca.logo ? '✅ Sí' : '❌ No',
          'Cant. Imágenes': data.finca.imagenesFinca?.length || 0,
          'Cant. Productos': data.finca.tipoProductos?.length || 0,
        });
        
        console.log('\n📋 Información completa de la finca:');
        console.log(data.finca);
        
        // Verificar campos importantes
        console.log('\n🔍 Verificación de campos:');
        const campos = [
          'nombre', 'descripcion', 'ubicacion', 'mision', 'vision',
          'telefono', 'whatsapp', 'email', 'direccion',
          'facebook', 'instagram', 'horarioAtencion',
          'logo', 'imagenesFinca', 'tipoProductos', 'certificaciones'
        ];
        
        campos.forEach(campo => {
          const valor = data.finca[campo];
          const tieneValor = Array.isArray(valor) 
            ? valor.length > 0 
            : valor !== null && valor !== undefined && valor !== '';
          
          console.log(
            `${tieneValor ? '✅' : '⚠️'} ${campo}:`,
            tieneValor ? (Array.isArray(valor) ? `${valor.length} elementos` : '✓') : 'No disponible'
          );
        });
      } else {
        console.log('%c❌ Error: No se recibieron datos de la finca', 'color: red');
      }
    })
    .catch(error => {
      console.log('%c❌ Error al conectar con el backend:', 'color: red; font-weight: bold');
      console.error(error);
      console.log('\n💡 Verifica que:');
      console.log('1. El backend esté corriendo en http://localhost:1598');
      console.log('2. El endpoint /api/finca/publica exista');
      console.log('3. CORS esté habilitado en el backend');
    });
} else {
  // Si axios está disponible, usarlo
  console.log('%c✅ Axios disponible, usando axios...', 'color: green');
  
  axios.get('http://localhost:1598/api/finca/publica')
    .then(response => {
      const data = response.data;
      console.log('%c✅ Respuesta del servidor:', 'color: green; font-weight: bold');
      console.log(data);
      
      if (data.ok && data.finca) {
        console.log('%c🎉 ¡Datos recibidos correctamente!', 'color: green; font-size: 14px');
        console.table({
          'Nombre': data.finca.nombre,
          'Ubicación': data.finca.ubicacion,
          'Email': data.finca.email,
          'WhatsApp': data.finca.whatsapp,
          'Tiene Logo': data.finca.logo ? '✅ Sí' : '❌ No',
          'Cant. Imágenes': data.finca.imagenesFinca?.length || 0,
          'Cant. Productos': data.finca.tipoProductos?.length || 0,
        });
        
        console.log('\n📋 Información completa de la finca:');
        console.log(data.finca);
      }
    })
    .catch(error => {
      console.log('%c❌ Error al conectar con el backend:', 'color: red; font-weight: bold');
      console.error(error);
    });
}

// Verificar si el store de Pinia está disponible
setTimeout(() => {
  console.log('\n%c🔍 Verificando stores de Pinia...', 'color: blue; font-size: 14px');
  
  // Intentar acceder al store (esto solo funciona si Vue DevTools está disponible)
  if (window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
    console.log('✅ Vue DevTools detectado');
    console.log('💡 Abre las Vue DevTools para ver los stores de Pinia');
  } else {
    console.log('⚠️ Vue DevTools no detectado');
    console.log('💡 Instala Vue DevTools para ver los stores en tiempo real');
  }
}, 1000);

console.log('\n%c📖 Guía rápida:', 'color: blue; font-size: 14px; font-weight: bold');
console.log('1. Verifica los mensajes de arriba');
console.log('2. Si ves ✅, la integración funciona correctamente');
console.log('3. Si ves ❌, revisa el backend y CORS');
console.log('4. Abre Vue DevTools para ver los stores de Pinia');
console.log('5. Navega por el Home y verifica que los datos se muestren');
