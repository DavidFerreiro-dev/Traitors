# 📦 Guía de Instalación

## Requisitos Previos

Necesitas tener instalado **Node.js** en tu sistema.

### ¿No tienes Node.js instalado?

1. Descarga Node.js desde: https://nodejs.org/
2. Instala la versión LTS (recomendada)
3. Verifica la instalación abriendo PowerShell o CMD y ejecutando:
   ```
   node --version
   npm --version
   ```

## Pasos de Instalación

### 1. Instalar Dependencias

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
npm install
```

Esto instalará:
- `express` - Framework web para Node.js
- `socket.io` - Biblioteca para comunicación en tiempo real
- `nodemon` - Herramienta de desarrollo (opcional)

### 2. Iniciar el Servidor

Una vez instaladas las dependencias, inicia el servidor:

```bash
npm start
```

O para desarrollo con auto-reinicio:

```bash
npm run dev
```

### 3. Abrir el Juego

Abre tu navegador y ve a:

```
http://localhost:3000
```

## 🌐 Jugar en Red Local

Si quieres que otros jugadores en tu red local se conecten:

1. Encuentra tu IP local:
   - Windows: `ipconfig` (busca "Dirección IPv4")
   - Mac/Linux: `ifconfig` o `ip addr`

2. Los otros jugadores deben acceder a:
   ```
   http://TU_IP_LOCAL:3000
   ```
   Ejemplo: `http://192.168.1.100:3000`

3. Asegúrate de que el firewall permita conexiones en el puerto 3000

## 🔧 Solución de Problemas

### Error: "npm no se reconoce"
- Node.js no está instalado o no está en el PATH
- Solución: Instala Node.js desde nodejs.org

### Error: "Puerto 3000 ya en uso"
- Otro programa está usando el puerto 3000
- Solución: Cambia el puerto en `server.js` (línea 9) o cierra el otro programa

### Error: "Cannot find module 'express'"
- Las dependencias no están instaladas
- Solución: Ejecuta `npm install`

### Los jugadores no pueden conectarse
- Verifica que todos estén en la misma red
- Verifica el firewall de Windows
- Asegúrate de usar la IP correcta

## 📱 Acceso desde Móviles

Los jugadores pueden unirse desde sus teléfonos móviles:

1. Asegúrate de que estén en la misma red WiFi
2. Usa la IP local del servidor
3. Abre el navegador móvil y accede a `http://IP_LOCAL:3000`

## ✅ Verificación

Si todo está correcto, deberías ver en la terminal:

```
🎮 Servidor corriendo en http://localhost:3000
```

¡Y ya puedes empezar a jugar!