const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Servir archivos de la raíz (background.mp3, icon.png)
app.use(express.static(__dirname));

// Cargar juegos desde JSON
const gamesData = JSON.parse(fs.readFileSync('./games.json', 'utf-8'));

// Estructura de datos para las salas
const rooms = {};

// Generar código de sala aleatorio
function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Seleccionar juego aleatorio
function getRandomGame() {
  return gamesData[Math.floor(Math.random() * gamesData.length)];
}

// Asignar roles a los jugadores
function assignRoles(room) {
  const players = Object.values(room.players);
  const game = getRandomGame();
  let impostorGame = null;
  
  // En modo Doble Juego, seleccionar un juego diferente para el impostor
  if (room.gameMode === 'double') {
    do {
      impostorGame = getRandomGame();
    } while (impostorGame.title === game.title); // Asegurar que sean diferentes
    console.log(`🎭 Modo Doble Juego: Juego del impostor: ${impostorGame.title}`);
  }
  
  // Mezclar array de jugadores para mayor aleatoriedad
  const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
  
  // Seleccionar impostor aleatorio del array mezclado
  const impostorIndex = Math.floor(Math.random() * shuffledPlayers.length);
  const impostorId = shuffledPlayers[impostorIndex].id;
  
  console.log(`🎭 Impostor seleccionado: ${shuffledPlayers[impostorIndex].name} (${impostorId})`);
  
  // Asignar roles a todos los jugadores
  players.forEach((player) => {
    if (player.id === impostorId) {
      player.role = 'impostor';
      player.game = impostorGame; // En modo normal será null, en doble será un juego
    } else {
      player.role = 'innocent';
      player.game = game;
    }
    player.hasVoted = false;
    player.votedFor = null;
  });
  
  room.gameStarted = true;
  room.votingPhase = false;
  room.gameEnded = false;
  room.currentGame = game;
  room.impostorGame = impostorGame;
  
  console.log(`🎮 Juego de los inocentes: ${game.title}`);
}

io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  // Crear sala
  socket.on('createRoom', ({ playerName, gameMode }) => {
    const roomCode = generateRoomCode();
    
    rooms[roomCode] = {
      code: roomCode,
      host: socket.id,
      players: {},
      gameStarted: false,
      votingPhase: false,
      gameEnded: false,
      currentGame: null,
      impostorGame: null,
      votes: {},
      gameMode: gameMode || 'normal'
    };

    rooms[roomCode].players[socket.id] = {
      id: socket.id,
      name: playerName,
      role: null,
      game: null,
      hasVoted: false,
      votedFor: null
    };

    socket.join(roomCode);
    socket.emit('roomCreated', { roomCode, playerName, gameMode: rooms[roomCode].gameMode });
    io.to(roomCode).emit('updatePlayers', Object.values(rooms[roomCode].players));
    
    console.log(`Sala ${roomCode} creada por ${playerName} - Modo: ${rooms[roomCode].gameMode}`);
  });

  // Unirse a sala
  socket.on('joinRoom', ({ roomCode, playerName }) => {
    const room = rooms[roomCode];

    if (!room) {
      socket.emit('error', 'Sala no encontrada');
      return;
    }

    if (room.gameStarted) {
      socket.emit('error', 'La partida ya ha comenzado');
      return;
    }

    room.players[socket.id] = {
      id: socket.id,
      name: playerName,
      role: null,
      game: null,
      hasVoted: false,
      votedFor: null
    };

    socket.join(roomCode);
    socket.emit('roomJoined', { 
      roomCode, 
      playerName, 
      isHost: socket.id === room.host,
      gameMode: room.gameMode 
    });
    io.to(roomCode).emit('updatePlayers', Object.values(room.players));
    
    console.log(`${playerName} se unió a la sala ${roomCode}`);
  });

  // Iniciar partida
  socket.on('startGame', (roomCode) => {
    const room = rooms[roomCode];

    if (!room) {
      socket.emit('error', 'Sala no encontrada');
      return;
    }

    if (socket.id !== room.host) {
      socket.emit('error', 'Solo el host puede iniciar la partida');
      return;
    }

    const playerCount = Object.keys(room.players).length;
    if (playerCount < 3) {
      socket.emit('error', 'Se necesitan al menos 3 jugadores para comenzar');
      return;
    }

    assignRoles(room);

    // Enviar roles a cada jugador
    Object.values(room.players).forEach((player) => {
      const roleData = {
        role: player.role,
        game: player.role === 'innocent' ? player.game : room.currentGame,
        impostorGame: player.role === 'impostor' ? player.game : null
      };
      io.to(player.id).emit('roleAssigned', roleData);
    });

    io.to(roomCode).emit('gameStarted');
    console.log(`Partida iniciada en sala ${roomCode} - Modo: ${room.gameMode}`);
  });

  // Enviar mensaje de chat
  socket.on('sendMessage', ({ roomCode, message }) => {
    const room = rooms[roomCode];
    
    if (!room || !room.players[socket.id]) {
      return;
    }

    const player = room.players[socket.id];
    io.to(roomCode).emit('newMessage', {
      playerName: player.name,
      message: message,
      timestamp: new Date().toLocaleTimeString()
    });
  });

  // Iniciar fase de votación
  socket.on('startVoting', (roomCode) => {
    const room = rooms[roomCode];

    if (!room) {
      socket.emit('error', 'Sala no encontrada');
      return;
    }

    if (socket.id !== room.host) {
      socket.emit('error', 'Solo el host puede iniciar la votación');
      return;
    }

    if (!room.gameStarted) {
      socket.emit('error', 'El juego no ha comenzado');
      return;
    }

    console.log(`🗳️ Iniciando votación en sala ${roomCode}`);

    // Resetear completamente la votación
    room.votingPhase = true;
    room.votes = {};
    
    // Limpiar votos de todos los jugadores
    Object.values(room.players).forEach(player => {
      player.hasVoted = false;
      player.votedFor = null;
    });

    io.to(roomCode).emit('votingStarted', Object.values(room.players));
    console.log(`✅ Votación iniciada. Jugadores: ${Object.values(room.players).length}`);
  });

  // Votar
  socket.on('vote', ({ roomCode, votedPlayerId }) => {
    const room = rooms[roomCode];

    if (!room || !room.votingPhase) {
      console.log(`⚠️ Voto rechazado: sala no encontrada o votación no activa`);
      return;
    }

    const player = room.players[socket.id];
    if (!player) {
      console.log(`⚠️ Voto rechazado: jugador no encontrado`);
      return;
    }

    if (player.hasVoted) {
      console.log(`⚠️ Voto rechazado: ${player.name} ya votó`);
      return;
    }

    player.hasVoted = true;
    player.votedFor = votedPlayerId;

    if (!room.votes[votedPlayerId]) {
      room.votes[votedPlayerId] = 0;
    }
    room.votes[votedPlayerId]++;

    const votedPlayer = room.players[votedPlayerId];
    console.log(`✅ ${player.name} votó por ${votedPlayer ? votedPlayer.name : 'desconocido'}`);

    // Verificar si todos han votado
    const totalPlayers = Object.values(room.players).length;
    const votedPlayers = Object.values(room.players).filter(p => p.hasVoted).length;
    console.log(`📊 Votos: ${votedPlayers}/${totalPlayers}`);

    const allVoted = Object.values(room.players).every(p => p.hasVoted);
    
    if (allVoted) {
      console.log(`🎯 Todos votaron. Calculando resultados...`);

      // Calcular resultados
      let maxVotes = 0;
      let mostVotedId = null;

      for (const [playerId, voteCount] of Object.entries(room.votes)) {
        if (voteCount > maxVotes) {
          maxVotes = voteCount;
          mostVotedId = playerId;
        }
      }

      // Encontrar al impostor real
      const impostor = Object.values(room.players).find(p => p.role === 'impostor');
      const mostVotedPlayer = room.players[mostVotedId];
      const won = mostVotedId === impostor.id;

      room.gameEnded = true;
      room.votingPhase = false;

      console.log(`🏆 Resultado: ${won ? 'INOCENTES GANARON' : 'IMPOSTOR GANÓ'}`);
      console.log(`🎭 Impostor: ${impostor.name}`);
      console.log(`🗳️ Más votado: ${mostVotedPlayer ? mostVotedPlayer.name : 'Nadie'}`);

      io.to(roomCode).emit('gameEnded', {
        impostor: {
          id: impostor.id,
          name: impostor.name
        },
        mostVoted: mostVotedPlayer ? {
          id: mostVotedPlayer.id,
          name: mostVotedPlayer.name
        } : null,
        won: won,
        game: room.currentGame,
        votes: room.votes,
        players: Object.values(room.players).map(p => ({
          id: p.id,
          name: p.name,
          role: p.role,
          votedFor: p.votedFor
        }))
      });
    }
  });

  // Reiniciar partida
  socket.on('restartGame', (roomCode) => {
    const room = rooms[roomCode];

    if (!room) {
      socket.emit('error', 'Sala no encontrada');
      return;
    }

    if (socket.id !== room.host) {
      socket.emit('error', 'Solo el host puede reiniciar la partida');
      return;
    }

    console.log(`🔄 Reiniciando partida en sala ${roomCode}`);

    // Resetear completamente el estado del juego
    room.gameStarted = false;
    room.votingPhase = false;
    room.gameEnded = false;
    room.currentGame = null;
    room.impostorGame = null;
    room.votes = {};

    // Limpiar todos los datos de los jugadores
    Object.values(room.players).forEach(player => {
      player.role = null;
      player.game = null;
      player.hasVoted = false;
      player.votedFor = null;
    });

    // Notificar a todos los clientes
    io.to(roomCode).emit('gameRestarted');
    io.to(roomCode).emit('updatePlayers', Object.values(room.players));
    
    console.log(`✅ Partida reiniciada en sala ${roomCode}. Jugadores: ${Object.values(room.players).map(p => p.name).join(', ')}`);
  });

  // Desconexión
  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);

    // Buscar y eliminar jugador de todas las salas
    for (const [roomCode, room] of Object.entries(rooms)) {
      if (room.players[socket.id]) {
        const playerName = room.players[socket.id].name;
        delete room.players[socket.id];

        // Si era el host, asignar nuevo host
        if (room.host === socket.id) {
          const remainingPlayers = Object.keys(room.players);
          if (remainingPlayers.length > 0) {
            room.host = remainingPlayers[0];
            io.to(room.host).emit('youAreHost');
          } else {
            // Si no quedan jugadores, eliminar sala
            delete rooms[roomCode];
            console.log(`Sala ${roomCode} eliminada (sin jugadores)`);
            continue;
          }
        }

        io.to(roomCode).emit('updatePlayers', Object.values(room.players));
        io.to(roomCode).emit('playerLeft', playerName);
        console.log(`${playerName} salió de la sala ${roomCode}`);
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`🎮 Servidor corriendo en http://localhost:${PORT}`);
});