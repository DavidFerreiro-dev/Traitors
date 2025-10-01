# 🎮 ¿Quién es el Impostor? - Juego Multijugador

Un juego web multijugador tipo "¿Quién es el impostor?" donde los jugadores deben descubrir quién no conoce el videojuego secreto.

## 🎯 Objetivo del Juego

- **Inocentes**: Descubrir quién es el impostor sin revelar demasiado sobre el videojuego
- **Impostor**: Descubrir cuál es el videojuego sin ser descubierto

## 🛠️ Tecnologías

- **Backend**: Node.js, Express, Socket.IO
- **Frontend**: HTML5, CSS3, JavaScript vanilla
- **Datos**: JSON con lista de videojuegos

## 📦 Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Iniciar el servidor:
```bash
npm start
```

3. Abrir en el navegador:
```
http://localhost:3000
```

## 🎮 Cómo Jugar

### 1. Crear o Unirse a una Sala
- Un jugador crea una sala y recibe un código
- Otros jugadores se unen con ese código
- Se necesitan mínimo 3 jugadores

### 2. Inicio de Partida
- El host inicia la partida
- El sistema asigna aleatoriamente:
  - **1 impostor** (no recibe información del juego)
  - **Resto de jugadores** (reciben el nombre y pista del videojuego)

### 3. Fase de Discusión
- Todos pueden chatear en tiempo real
- Los inocentes deben hacer preguntas sutiles
- El impostor debe intentar mezclarse

### 4. Votación
- El host inicia la votación
- Cada jugador vota a quien cree que es el impostor
- No puedes votarte a ti mismo

### 5. Resultados
- Se revela quién era el impostor
- Se muestra si los inocentes ganaron
- Se puede iniciar una nueva partida

## 📂 Estructura del Proyecto

```
/impostor-game
│
├── server.js              # Servidor Node.js + Socket.IO
├── package.json           # Dependencias del proyecto
├── games.json             # Lista de videojuegos con pistas
├── README.md              # Este archivo
│
└── public/
    ├── index.html         # Interfaz principal
    ├── style.css          # Estilos del juego
    └── client.js          # Lógica del cliente
```

## 🎲 Agregar Más Juegos

Edita el archivo `games.json` y agrega más videojuegos con este formato:

```json
{
  "title": "Nombre del Juego",
  "hint": "Pista descriptiva del juego"
}
```

## 🔧 Desarrollo

Para desarrollo con auto-reinicio:

```bash
npm run dev
```

## 📝 Características

✅ Salas privadas con códigos únicos  
✅ Chat en tiempo real  
✅ Asignación aleatoria de roles  
✅ Sistema de votación  
✅ Interfaz responsive  
✅ Notificaciones visuales  
✅ Reconexión automática del host  
✅ 20 videojuegos incluidos  

## 🎨 Personalización

### Cambiar el puerto
Edita `server.js` o usa variable de entorno:
```bash
PORT=8080 npm start
```

### Modificar estilos
Edita `public/style.css` para cambiar colores, fuentes, etc.

## 🐛 Solución de Problemas

**El servidor no inicia:**
- Verifica que Node.js esté instalado: `node --version`
- Instala las dependencias: `npm install`

**No se conectan los jugadores:**
- Verifica que todos usen la misma URL
- Revisa el firewall si usas red local

**El chat no funciona:**
- Verifica la consola del navegador (F12)
- Asegúrate de que Socket.IO esté cargado correctamente

## 📄 Licencia

MIT License - Siéntete libre de usar y modificar este proyecto.

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Siéntete libre de:
- Agregar más videojuegos
- Mejorar la interfaz
- Agregar nuevas características
- Reportar bugs

---

**¡Diviértete jugando!** 🎉