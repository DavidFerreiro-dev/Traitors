# 🎮 Impostores - Juego Multijugador de Deducción

![Impostores](icon.png)

## 📖 Descripción

**Impostores** es un emocionante juego multijugador de deducción social donde los jugadores deben descubrir quién es el impostor entre ellos. Inspirado en juegos de deducción clásicos, Impostores ofrece una experiencia única con dos modos de juego diferentes.

## 🎯 ¿Cómo se juega?

### Objetivo del Juego

- **Jugadores Inocentes**: Todos comparten un videojuego en común. Deben descubrir quién es el impostor sin revelar demasiada información.
- **El Impostor**: No conoce el videojuego. Debe descubrir cuál es sin ser descubierto, haciendo preguntas sutiles y mezclándose con los demás.

### Fases del Juego

1. **Lobby**: Los jugadores se unen a una sala usando un código de 6 caracteres
2. **Asignación de Roles**: El sistema asigna aleatoriamente quién será el impostor
3. **Discusión**: Los jugadores chatean y hacen preguntas para descubrir al impostor
4. **Votación**: Todos votan por quién creen que es el impostor
5. **Resultados**: Se revela si los inocentes ganaron o si el impostor logró escapar

## 🎮 Modos de Juego

### Modo Normal
El modo clásico donde:
- Los jugadores inocentes comparten un videojuego
- El impostor debe descubrir cuál es sin ser detectado
- Todos discuten y votan al final

### Modo Doble Juego
Un modo misterioso donde:
- **Uno de los jugadores tiene un videojuego diferente al resto**
- **Nadie sabe quién tiene el juego distinto** (ni siquiera ellos mismos lo saben con certeza)
- Todos deben descubrir quién es el diferente
- Añade una capa extra de misterio y paranoia

## ✨ Características

- 🌐 **Multijugador en tiempo real** usando WebSockets
- 💬 **Chat integrado** para la fase de discusión
- 🎲 **Más de 200 videojuegos** en la base de datos
- 🎨 **Interfaz Y2K retro** con estética del año 2000
- 📱 **Diseño responsive** optimizado para móviles
- 🔒 **Sistema de salas privadas** con códigos únicos
- 🎭 **Dos modos de juego** distintos para mayor variedad

## 🎯 Requisitos del Juego

- **Mínimo 3 jugadores** para comenzar una partida
- Conexión a internet estable
- Navegador web moderno (Chrome, Firefox, Edge, Safari)

## 🛠️ Tecnologías Utilizadas

- **Backend**: Node.js, Express.js
- **WebSockets**: Socket.IO para comunicación en tiempo real
- **Frontend**: HTML5, CSS3, JavaScript vanilla
- **Base de datos**: JSON para almacenamiento de juegos

## 📂 Estructura del Proyecto

```
Impostores/
├── public/
│   ├── index.html      # Interfaz principal
│   ├── client.js       # Lógica del cliente
│   └── style.css       # Estilos
├── server.js           # Servidor Node.js
├── games.json          # Base de datos de juegos
├── background.mp3      # Música de fondo
├── icon.png           # Logo del juego
└── README.md          # Este archivo
```

## 🎮 Consejos para Jugar

### Para Inocentes:
- Haz preguntas específicas pero no demasiado obvias
- Observa quién hace preguntas genéricas
- Coordina con otros jugadores para identificar al impostor
- No reveles el juego directamente

### Para el Impostor:
- Haz preguntas que puedan aplicarse a muchos juegos
- Observa las respuestas de los demás
- Intenta mezclarte y actuar como si supieras el juego
- En modo Doble Juego, usa tu juego para crear confusión

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Si deseas contribuir:

1. Haz un Fork del proyecto
2. Crea una rama para tu característica (`git checkout -b feature/NuevaCaracteristica`)
3. Commit tus cambios (`git commit -m 'Añadir nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🔗 Enlaces

- **Repositorio**: [GitHub](https://github.com/DavidFerreiro-dev/Traitors)
- **Studios Riba**: [itch.io](https://studiosriba.itch.io)

## 👥 Créditos

- **Creado por**: David Ferreiro
- **Desarrollo**: David Ferreiro, Studios Riba (con uso de Zencoder)
- **Director de Arte**: Studios Riba

## 📧 Contacto

Para reportar bugs, sugerencias o preguntas, por favor abre un issue en el repositorio de GitHub.

---

¡Diviértete jugando a Impostores! 🎮🎭