# 🚀 Inicio Rápido - ¿Quién es el Impostor?

## ⚡ Instalación Express (3 pasos)

### 1️⃣ Instalar Dependencias
```bash
npm install
```

### 2️⃣ Iniciar el Servidor
```bash
npm start
```

### 3️⃣ Abrir en el Navegador
```
http://localhost:3000
```

---

## 🎮 Cómo Jugar (Guía Rápida)

### Para el HOST (Creador de la Sala)

1. **Ingresa tu nombre** en la pantalla de inicio
2. **Haz clic en "Crear Sala"**
3. **Comparte el código** que aparece con tus amigos
4. **Espera** a que se unan al menos 3 jugadores
5. **Haz clic en "🚀 Iniciar Partida"**
6. Durante el juego:
   - Participa en el chat
   - Cuando estés listo, haz clic en "🗳️ Iniciar Votación"
7. Después de los resultados:
   - Haz clic en "🔄 Nueva Partida" para jugar de nuevo

### Para los JUGADORES

1. **Ingresa tu nombre** en la pantalla de inicio
2. **Haz clic en "Unirse a Sala"**
3. **Ingresa el código** que te compartió el host
4. **Espera** a que el host inicie la partida
5. **Lee tu rol**:
   - Si eres **IMPOSTOR** 🎭: No sabes el juego, debes descubrirlo
   - Si eres **INOCENTE** ✅: Conoces el juego, debes encontrar al impostor
6. **Participa en el chat** para discutir
7. **Vota** cuando el host inicie la votación
8. **Ve los resultados** y descubre quién era el impostor

---

## 💡 Consejos Rápidos

### Si eres INOCENTE ✅
- ❌ **NO** digas el nombre del juego directamente
- ✅ **SÍ** da pistas sutiles
- ✅ **SÍ** haz preguntas indirectas
- ✅ **SÍ** observa quién hace preguntas muy generales

**Ejemplo:**
- ❌ "¿Es Minecraft?"
- ✅ "¿Tiene bloques?"
- ✅ "¿Es de construcción?"

### Si eres IMPOSTOR 🎭
- ✅ **SÍ** haz preguntas generales
- ✅ **SÍ** escucha atentamente las pistas
- ✅ **SÍ** intenta mezclarte con los demás
- ❌ **NO** te quedes callado (es sospechoso)

**Ejemplo:**
- ✅ "¿Es un juego popular?"
- ✅ "¿Tiene buen multijugador?"
- ✅ "¿Es difícil?"

---

## 🌐 Jugar en Red Local

### Opción 1: Misma Computadora
Todos abren: `http://localhost:3000`

### Opción 2: Red Local (WiFi)

**En Windows:**
1. Abre PowerShell o CMD
2. Ejecuta: `ipconfig`
3. Busca "Dirección IPv4" (ejemplo: 192.168.1.100)
4. Comparte con tus amigos: `http://192.168.1.100:3000`

**En Mac/Linux:**
1. Abre Terminal
2. Ejecuta: `ifconfig` o `ip addr`
3. Busca tu IP local
4. Comparte: `http://TU_IP:3000`

---

## 🔧 Solución de Problemas

### ❌ "npm no se reconoce"
**Problema:** Node.js no está instalado  
**Solución:** Descarga e instala desde https://nodejs.org/

### ❌ "Puerto 3000 ya en uso"
**Problema:** Otro programa usa el puerto  
**Solución:** Cierra otros servidores o cambia el puerto en `server.js`

### ❌ "Cannot find module"
**Problema:** Dependencias no instaladas  
**Solución:** Ejecuta `npm install`

### ❌ Los jugadores no pueden conectarse
**Problema:** Firewall o red diferente  
**Solución:** 
- Verifica que estén en la misma red WiFi
- Desactiva temporalmente el firewall
- Usa la IP correcta

---

## 📱 Jugar desde Móviles

✅ **El juego funciona perfectamente en móviles**

1. Asegúrate de que el móvil esté en la misma red WiFi
2. Abre el navegador del móvil (Chrome, Safari, etc.)
3. Ingresa la URL: `http://IP_DEL_SERVIDOR:3000`
4. ¡Juega normalmente!

---

## 🎯 Requisitos Mínimos

- ✅ Node.js 14 o superior
- ✅ Navegador moderno (Chrome, Firefox, Safari, Edge)
- ✅ Mínimo 3 jugadores
- ✅ Conexión a internet (solo para instalar dependencias)

---

## 📊 Características del Juego

- 🎮 **20 videojuegos** incluidos
- 👥 **3-8 jugadores** recomendado
- ⏱️ **5-15 minutos** por partida
- 💬 **Chat en tiempo real**
- 🗳️ **Sistema de votación**
- 🎨 **Diseño moderno** y responsive
- 📱 **Compatible con móviles**
- 🔄 **Reinicio rápido** de partidas

---

## 🎉 ¡Listo para Jugar!

Si todo está configurado correctamente, deberías ver:

```
🎮 Servidor corriendo en http://localhost:3000
```

**¡Diviértete descubriendo al impostor!** 🕵️‍♂️

---

## 📞 Ayuda Adicional

- 📖 Lee `README.md` para documentación completa
- 🎨 Lee `MEJORAS.md` para detalles de diseño
- 🎮 Lee `GUIA_JUEGO.md` para estrategias avanzadas
- 🔧 Lee `INSTALACION.md` para instalación detallada

---

**Desarrollado con ❤️ para diversión multijugador**