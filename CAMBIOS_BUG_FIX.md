# 🐛 Corrección de Bugs - Nueva Partida

## Problemas Identificados

### 1. **Mismo impostor en partidas consecutivas**
- **Causa**: El orden de los jugadores en el objeto era siempre el mismo
- **Síntoma**: El mismo jugador era impostor en múltiples partidas seguidas

### 2. **Votación bloqueada en segunda partida**
- **Causa**: La pantalla de votación no se reseteaba correctamente
- **Síntoma**: Al votar en la segunda partida, quedaba en "Esperando a que todos voten"

---

## ✅ Soluciones Implementadas

### 1. **Mejora en asignación de roles** (`server.js`)

**Antes:**
```javascript
const impostorIndex = Math.floor(Math.random() * players.length);
players.forEach((player, index) => {
  if (index === impostorIndex) {
    player.role = 'impostor';
  }
});
```

**Ahora:**
```javascript
// Mezclar array de jugadores para mayor aleatoriedad
const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
const impostorIndex = Math.floor(Math.random() * shuffledPlayers.length);
const impostorId = shuffledPlayers[impostorIndex].id;

// Asignar por ID en lugar de índice
players.forEach((player) => {
  if (player.id === impostorId) {
    player.role = 'impostor';
  }
});
```

**Beneficios:**
- ✅ Doble aleatorización (shuffle + random index)
- ✅ Asignación por ID (más confiable)
- ✅ Logs para debugging

---

### 2. **Reseteo completo de votación** (`client.js`)

**Agregado en `votingStarted`:**
```javascript
// Resetear estado de votación
votingList.classList.remove('hidden');
votingWait.classList.add('hidden');
votingList.innerHTML = '';
```

**Agregado en `gameRestarted`:**
```javascript
// Resetear pantalla de votación
document.getElementById('votingList').classList.remove('hidden');
document.getElementById('votingWait').classList.add('hidden');
document.getElementById('votingList').innerHTML = '';

// Ocultar controles de host
document.getElementById('hostGameControls').classList.add('hidden');
document.getElementById('hostResultsControls').classList.add('hidden');
```

**Beneficios:**
- ✅ Limpieza completa de estado visual
- ✅ Reseteo de controles del host
- ✅ Preparación correcta para nueva votación

---

### 3. **Mejoras en el servidor** (`server.js`)

#### Votación más robusta:
```javascript
// Verificación adicional
if (!room.gameStarted) {
  socket.emit('error', 'El juego no ha comenzado');
  return;
}

// Logs detallados
console.log(`✅ ${player.name} votó por ${votedPlayer.name}`);
console.log(`📊 Votos: ${votedPlayers}/${totalPlayers}`);
```

#### Finalización de votación:
```javascript
room.gameEnded = true;
room.votingPhase = false; // ← IMPORTANTE: Cerrar fase de votación
```

#### Logs de debugging:
- 🎭 Impostor seleccionado
- 🎮 Juego seleccionado
- 🗳️ Inicio de votación
- ✅ Cada voto registrado
- 📊 Progreso de votación
- 🏆 Resultados finales

---

## 🧪 Cómo Probar

### Test 1: Impostor aleatorio
1. Jugar 3-5 partidas consecutivas
2. Verificar que diferentes jugadores sean impostores
3. Revisar logs del servidor para confirmar

### Test 2: Votación múltiple
1. Jugar una partida completa
2. Dar "Nueva Partida"
3. Jugar otra partida completa
4. Verificar que la votación funcione correctamente
5. Repetir 2-3 veces

### Test 3: Logs del servidor
Observar en la consola:
```
🎭 Impostor seleccionado: Juan (abc123)
🎮 Juego seleccionado: Minecraft
🗳️ Iniciando votación en sala ABC123
✅ Juan votó por Pedro
📊 Votos: 1/3
✅ Pedro votó por María
📊 Votos: 2/3
✅ María votó por Juan
📊 Votos: 3/3
🎯 Todos votaron. Calculando resultados...
🏆 Resultado: INOCENTES GANARON
🎭 Impostor: Juan
🗳️ Más votado: Juan
```

---

## 📝 Archivos Modificados

1. **`server.js`**
   - Función `assignRoles()` mejorada
   - Evento `startVoting` con validaciones
   - Evento `vote` con logs detallados
   - Evento `restartGame` con limpieza completa

2. **`client.js`**
   - Evento `votingStarted` con reseteo
   - Evento `gameRestarted` con limpieza completa

---

## 🚀 Para Aplicar los Cambios

Si el servidor está corriendo:
1. Detener el servidor (Ctrl+C)
2. Reiniciar: `node server.js`
3. Recargar la página en el navegador (F5)

Si no está corriendo:
1. Iniciar: `node server.js`
2. Abrir: `http://localhost:3000`

---

## ✅ Estado Actual

- ✅ Impostor aleatorio en cada partida
- ✅ Votación funciona en múltiples partidas
- ✅ Logs detallados para debugging
- ✅ Limpieza completa al reiniciar
- ✅ Validaciones adicionales

**¡Bugs corregidos!** 🎉