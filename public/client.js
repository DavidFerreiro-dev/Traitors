const socket = io();

// Estado del juego
let gameState = {
    playerName: '',
    roomCode: '',
    isHost: false,
    role: null,
    game: null
};

// Elementos del DOM
const screens = {
    start: document.getElementById('startScreen'),
    lobby: document.getElementById('lobbyScreen'),
    game: document.getElementById('gameScreen'),
    voting: document.getElementById('votingScreen'),
    results: document.getElementById('resultsScreen')
};

// Funciones de utilidad
function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenName].classList.add('active');
    
    // Scroll to top cuando cambia de pantalla
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    
    // Agregar emoji según el tipo
    let emoji = '';
    switch(type) {
        case 'success': emoji = '✅ '; break;
        case 'error': emoji = '❌ '; break;
        case 'info': emoji = 'ℹ️ '; break;
    }
    
    notification.textContent = emoji + message;
    notification.className = `notification ${type}`;
    notification.classList.remove('hidden');
    
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 4000);
}

// Pantalla de inicio
document.getElementById('createRoomBtn').addEventListener('click', () => {
    const playerName = document.getElementById('playerNameInput').value.trim();
    
    if (!playerName) {
        showNotification('Por favor, ingresa tu nombre', 'error');
        return;
    }
    
    gameState.playerName = playerName;
    socket.emit('createRoom', playerName);
});

document.getElementById('joinRoomBtn').addEventListener('click', () => {
    const joinForm = document.getElementById('joinRoomForm');
    joinForm.classList.toggle('hidden');
});

document.getElementById('joinRoomConfirmBtn').addEventListener('click', () => {
    const playerName = document.getElementById('playerNameInput').value.trim();
    const roomCode = document.getElementById('roomCodeInput').value.trim().toUpperCase();
    
    if (!playerName) {
        showNotification('Por favor, ingresa tu nombre', 'error');
        return;
    }
    
    if (!roomCode) {
        showNotification('Por favor, ingresa el código de sala', 'error');
        return;
    }
    
    gameState.playerName = playerName;
    gameState.roomCode = roomCode;
    socket.emit('joinRoom', { roomCode, playerName });
});

// Eventos del servidor - Lobby
socket.on('roomCreated', ({ roomCode, playerName }) => {
    gameState.roomCode = roomCode;
    gameState.isHost = true;
    document.getElementById('roomCodeDisplay').textContent = roomCode;
    document.getElementById('hostControls').classList.remove('hidden');
    showScreen('lobby');
    showNotification(`Sala ${roomCode} creada exitosamente`, 'success');
});

socket.on('roomJoined', ({ roomCode, playerName, isHost }) => {
    gameState.roomCode = roomCode;
    gameState.isHost = isHost;
    document.getElementById('roomCodeDisplay').textContent = roomCode;
    
    if (isHost) {
        document.getElementById('hostControls').classList.remove('hidden');
    }
    
    showScreen('lobby');
    showNotification('Te has unido a la sala', 'success');
});

socket.on('updatePlayers', (players) => {
    const playersList = document.getElementById('playersList');
    playersList.innerHTML = '';
    
    players.forEach((player, index) => {
        const li = document.createElement('li');
        li.textContent = player.name;
        if (player.id === socket.id) {
            li.textContent += ' 👈 (Tú)';
            li.style.fontWeight = '700';
            li.style.background = 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)';
        }
        playersList.appendChild(li);
    });
});

socket.on('playerLeft', (playerName) => {
    showNotification(`${playerName} ha salido de la sala`, 'info');
});

socket.on('youAreHost', () => {
    gameState.isHost = true;
    document.getElementById('hostControls').classList.remove('hidden');
    showNotification('Ahora eres el host de la sala', 'info');
});

// Iniciar partida
document.getElementById('startGameBtn').addEventListener('click', () => {
    socket.emit('startGame', gameState.roomCode);
});

socket.on('gameStarted', () => {
    showNotification('¡La partida ha comenzado!', 'success');
});

socket.on('roleAssigned', ({ role, game }) => {
    gameState.role = role;
    gameState.game = game;
    
    // Pequeño delay para crear suspense
    setTimeout(() => {
        if (role === 'impostor') {
            document.getElementById('impostorRole').classList.remove('hidden');
            document.getElementById('innocentRole').classList.add('hidden');
            showNotification('¡Eres el IMPOSTOR! 🎭', 'error');
        } else {
            document.getElementById('innocentRole').classList.remove('hidden');
            document.getElementById('impostorRole').classList.add('hidden');
            document.getElementById('gameTitle').textContent = game.title;
            document.getElementById('gameHint').textContent = game.hint;
            showNotification('Eres INOCENTE ✅', 'success');
        }
        
        if (gameState.isHost) {
            document.getElementById('hostGameControls').classList.remove('hidden');
        }
        
        showScreen('game');
    }, 500);
});

// Chat
document.getElementById('sendMessageBtn').addEventListener('click', sendMessage);
document.getElementById('chatInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    socket.emit('sendMessage', {
        roomCode: gameState.roomCode,
        message: message
    });
    
    input.value = '';
}

socket.on('newMessage', ({ playerName, message, timestamp }) => {
    const chatMessages = document.getElementById('chatMessages');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message';
    
    messageDiv.innerHTML = `
        <div class="message-header">
            <span class="player-name">${playerName}</span>
            <span class="timestamp">${timestamp}</span>
        </div>
        <div class="message-text">${message}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Votación
document.getElementById('startVotingBtn').addEventListener('click', () => {
    socket.emit('startVoting', gameState.roomCode);
});

socket.on('votingStarted', (players) => {
    const votingList = document.getElementById('votingList');
    const votingWait = document.getElementById('votingWait');
    
    // Resetear estado de votación
    votingList.innerHTML = '';
    votingList.classList.remove('hidden');
    votingWait.classList.add('hidden');
    
    players.forEach(player => {
        if (player.id === socket.id) return; // No puedes votarte a ti mismo
        
        const voteOption = document.createElement('div');
        voteOption.className = 'vote-option';
        voteOption.textContent = '👤 ' + player.name;
        voteOption.dataset.playerId = player.id;
        
        voteOption.addEventListener('click', () => {
            // Remover selección anterior
            document.querySelectorAll('.vote-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Seleccionar esta opción
            voteOption.classList.add('selected');
            
            // Enviar voto
            socket.emit('vote', {
                roomCode: gameState.roomCode,
                votedPlayerId: player.id
            });
            
            showNotification(`Has votado por ${player.name}`, 'info');
            
            // Mostrar pantalla de espera
            setTimeout(() => {
                votingList.classList.add('hidden');
                votingWait.classList.remove('hidden');
            }, 800);
        });
        
        votingList.appendChild(voteOption);
    });
    
    showScreen('voting');
    showNotification('¡Es hora de votar! 🗳️', 'info');
});

// Resultados
socket.on('gameEnded', (results) => {
    const resultsContent = document.getElementById('resultsContent');
    const voteBreakdown = document.getElementById('voteBreakdown');
    
    // Determinar si ganaron
    const won = results.won;
    const wasImpostor = gameState.role === 'impostor';
    
    let resultHTML = '';
    
    if (won) {
        resultHTML += '<div class="result-win">🎉 ¡Los inocentes ganaron!</div>';
        resultHTML += `<div class="result-info">🎭 El impostor era: <strong>${results.impostor.name}</strong></div>`;
        resultHTML += `<div class="result-info">🗳️ Votaron a: <strong>${results.mostVoted.name}</strong></div>`;
        showNotification('¡Victoria de los inocentes!', 'success');
    } else {
        resultHTML += '<div class="result-lose">😈 ¡El impostor ganó!</div>';
        resultHTML += `<div class="result-info">🎭 El impostor era: <strong>${results.impostor.name}</strong></div>`;
        resultHTML += `<div class="result-info">🗳️ Votaron a: <strong>${results.mostVoted ? results.mostVoted.name : 'Nadie'}</strong></div>`;
        showNotification('¡El impostor escapó!', 'error');
    }
    
    resultHTML += `<div class="result-info">🎮 El videojuego era: <strong>${results.game.title}</strong></div>`;
    resultHTML += `<div class="result-info">💡 Pista: "${results.game.hint}"</div>`;
    
    resultsContent.innerHTML = resultHTML;
    
    // Desglose de votos
    voteBreakdown.innerHTML = '';
    
    // Contar votos por jugador
    const voteCounts = {};
    results.players.forEach(player => {
        const votedForName = results.players.find(p => p.id === player.votedFor)?.name || 'Nadie';
        if (!voteCounts[votedForName]) {
            voteCounts[votedForName] = 0;
        }
        voteCounts[votedForName]++;
    });
    
    // Mostrar desglose
    for (const [playerName, count] of Object.entries(voteCounts)) {
        if (playerName === 'Nadie') continue;
        
        const item = document.createElement('div');
        item.className = 'vote-breakdown-item';
        item.innerHTML = `
            <span>${playerName}</span>
            <span class="vote-count">${count} voto${count !== 1 ? 's' : ''}</span>
        `;
        voteBreakdown.appendChild(item);
    }
    
    if (gameState.isHost) {
        document.getElementById('hostResultsControls').classList.remove('hidden');
    }
    
    showScreen('results');
});

// Reiniciar partida
document.getElementById('restartGameBtn').addEventListener('click', () => {
    socket.emit('restartGame', gameState.roomCode);
});

socket.on('gameRestarted', () => {
    // Resetear estado del juego
    gameState.role = null;
    gameState.game = null;
    
    // Limpiar chat
    document.getElementById('chatMessages').innerHTML = '';
    
    // Resetear pantalla de votación
    document.getElementById('votingList').classList.remove('hidden');
    document.getElementById('votingWait').classList.add('hidden');
    document.getElementById('votingList').innerHTML = '';
    
    // Ocultar controles de host
    document.getElementById('hostGameControls').classList.add('hidden');
    document.getElementById('hostResultsControls').classList.add('hidden');
    
    // Volver al lobby
    showScreen('lobby');
    showNotification('Nueva partida iniciada', 'success');
});

// Manejo de errores
socket.on('error', (message) => {
    showNotification(message, 'error');
});

// Manejo de desconexión
socket.on('disconnect', () => {
    showNotification('Desconectado del servidor', 'error');
});