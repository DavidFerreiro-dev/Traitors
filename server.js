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
  
  // Seleccionar impostor aleatorio
  const impostorIndex = Math.floor(Math.random() * players.length);
  
  players.forEach((player, index) => {
    if (index === impostorIndex) {
      player.role = 'impostor';
      player.game = null;
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
}

io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  // Crear sala
  socket.on('createRoom', (playerName) => {
    const roomCode = generateRoomCode();
    
    rooms[roomCode] = {
      code: roomCode,
      host: socket.id,
      players: {},
      gameStarted: false,
      votingPhase: false,
      gameEnded: false,
      currentGame: null,
      votes: {}
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
    socket.emit('roomCreated', { roomCode, playerName });
    io.to(roomCode).emit('updatePlayers', Object.values(rooms[roomCode].players));
    
    console.log(`Sala ${roomCode} creada por ${playerName}`);
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
    socket.emit('roomJoined', { roomCode, playerName, isHost: socket.id === room.host });
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
      io.to(player.id).emit('roleAssigned', {
        role: player.role,
        game: player.game
      });
    });

    io.to(roomCode).emit('gameStarted');
    console.log(`Partida iniciada en sala ${roomCode}`);
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

    room.votingPhase = true;
    room.votes = {};
    
    // Resetear votos
    Object.values(room.players).forEach(player => {
      player.hasVoted = false;
      player.votedFor = null;
    });

    io.to(roomCode).emit('votingStarted', Object.values(room.players));
    console.log(`Votación iniciada en sala ${roomCode}`);
  });

  // Votar
  socket.on('vote', ({ roomCode, votedPlayerId }) => {
    const room = rooms[roomCode];

    if (!room || !room.votingPhase) {
      return;
    }

    const player = room.players[socket.id];
    if (!player || player.hasVoted) {
      return;
    }

    player.hasVoted = true;
    player.votedFor = votedPlayerId;

    if (!room.votes[votedPlayerId]) {
      room.votes[votedPlayerId] = 0;
    }
    room.votes[votedPlayerId]++;

    // Verificar si todos han votado
    const allVoted = Object.values(room.players).every(p => p.hasVoted);
    
    if (allVoted) {
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

      console.log(`Partida terminada en sala ${roomCode}. Ganaron: ${won ? 'Inocentes' : 'Impostor'}`);
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

    // Resetear estado del juego
    room.gameStarted = false;
    room.votingPhase = false;
    room.gameEnded = false;
    room.currentGame = null;
    room.votes = {};

    Object.values(room.players).forEach(player => {
      player.role = null;
      player.game = null;
      player.hasVoted = false;
      player.votedFor = null;
    });

    io.to(roomCode).emit('gameRestarted');
    io.to(roomCode).emit('updatePlayers', Object.values(room.players));
    
    console.log(`Partida reiniciada en sala ${roomCode}`);
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