const io = require('socket.io')();
const { InicioJuego, gameloop, getUpdateVelocidad } = require('./game');
const { Frame_rate } = require('./constantes');
const { makeid } = require('./utilidades');
const state = {};
const salaCliente = {};

io.on('connection', client => {

    client.on('keydown', handleKeydown);
    client.on('Nuevojuego', handleNuevojuego);
    client.on('unirsejuego', handleUnirsejuego);

    function handleUnirsejuego(nombreSala) {
        const sala = io.sockets.adapter.rooms[nombreSala];

        let todosusuarios;
        if (sala) {
            todosusuarios = sala.sockets;
        }

        let Numeroclientes = 0;
        if (todosusuarios) {
            Numeroclientes = Object.keys(todosusuarios).length;
        }
        if (Numeroclientes === 0) {
            client.emit('unknowncode');
            return;
        } else if (Numeroclientes > 1) {
            client.emit('tooManyJugadores');
            return;
        }
        salaCliente[client.id] = nombreSala;

        client.join(nombreSala);
        client.number = 2;
        client.emit('init', 2);

        startGameInterval(nombreSala);


    }
    // queremos el acceso a las teclas del cliente.  por eso la funcion dentro de la conexion con el cliente
    function handleNuevojuego() {
        let nombreSala = makeid(5);
        salaCliente[client.id] = nombreSala;
        client.emit('gameCode', nombreSala);

        state[nombreSala] = InicioJuego();

        client.join(nombreSala);
        client.number = 1;
        client.emit('init', 1)
    }

    function handleKeydown(keyCode) {
        const nombreSala = salaCliente[client.id];
        if (!nombreSala) {
            return;
        }
        try {
            keyCode = parseInt(keyCode);
        } catch (e) {
            console.error(e);
            return;

        }
        const vel = getUpdateVelocidad(keyCode);
        if (vel) {
            state[nombreSala].players[client.number - 1].vel = vel

        }
    }


});


function startGameInterval(nombreSala) {
    // loq ue se hara es aqui es crear ticks para el framerate 
    const interlvalID = setInterval(() => {
        // donde vamos a invocar cada mecanica del juego em cada loop
        const winner = gameloop(state[nombreSala]);

        //comprobamos si hay un ganador o que esta pasando 
        if (!winner) {
            emitGameState(nombreSala, state[nombreSala]);
        } else {
            emitGameOver(nombreSala, winner);
            state[nombreSala] = null;
            clearInterval(interlvalID);
        }

    }, 1000 / Frame_rate);
}

function emitGameState(sala, gameState) {
    io.sockets.in(sala).emit('gameState', JSON.stringify(gameState));

}

function emitGameOver(sala, winner) {
    io.sockets.in(sala).emit('gameOver', JSON, stringify({ winner }));
}
io.listen(3000);