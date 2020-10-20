const { tamaño_grid } = require('./constantes');
module.exports = {
    InicioJuego,
    gameloop,
    getUpdateVelocidad,

}

function InicioJuego() {
    const state = createGameState()
    randomFood(state);
    return state;
}

function createGameState() {
    return {
        players: [{
            pos: {
                x: 3,
                y: 10,
            },
            vel: {
                x: 1,
                y: 0,
            },
            snake: [
                { x: 1, y: 10 },
                { x: 2, y: 10 },
                { x: 3, y: 10 },
            ],
        }, {
            pos: {
                x: 18,
                y: 10,
            },
            vel: {
                x: 0,
                y: 0,
            },
            snake: [
                { x: 20, y: 10 },
                { x: 19, y: 10 },
                { x: 18, y: 10 },
            ],
        }],
        food: {},
        gridsize: tamaño_grid,
    };
}

function gameloop(state) {
    if (!state) {
        return;
    }
    const jugadorOne = state.players[0];
    const jugadorTwo = state.players[1];

    /// se actualiza la poscion de acuero a la velocidad en cad ainteraccion del gameloop moveremos la coordenada de x 
    jugadorOne.pos.x += jugadorOne.vel.x;
    jugadorOne.pos.y += jugadorOne.vel.y;

    jugadorTwo.pos.x += jugadorTwo.vel.x;
    jugadorTwo.pos.y += jugadorTwo.vel.y;

    if (jugadorOne.pos.x < 0 || jugadorOne.pos.x > tamaño_grid || jugadorOne.pos.y < 0 || jugadorOne.pos.y > tamaño_grid) {

        return 2;

    }
    if (jugadorTwo.pos.x < 0 || jugadorTwo.pos.x > tamaño_grid || jugadorTwo.pos.y < 0 || jugadorTwo.pos.y > tamaño_grid) {

        return 1;

    }

    if (state.food.x == jugadorOne.pos.x && state.food.y == jugadorOne.pos.y) {
        jugadorOne.snake.push({...jugadorOne.pos });
        jugadorOne.pos.x += jugadorOne.vel.x;
        jugadorOne.pos.y += jugadorOne.vel.y;
        randomFood(state);
    }
    if (state.food.x == jugadorTwo.pos.x && state.food.y == jugadorTwo.pos.y) {
        jugadorTwo.snake.push({...jugadorTwo.pos });
        jugadorTwo.pos.x += jugadorTwo.vel.x;
        jugadorTwo.pos.y += jugadorTwo.vel.y;
        randomFood(state);
    }
    // se verifica la serpiente se est moviendo antes de mover el cuerpo de la serpiente
    if (jugadorOne.vel.x || jugadorOne.vel.y) {
        for (let cell of jugadorOne.snake) { // aqui se verificara la posicion de la cabeza de la serpiente para ver sus colisiones
            if (cell.x === jugadorOne.pos.x && cell.y === jugadorOne.pos.y) {
                return 2
            }
        }
        jugadorOne.snake.push({...jugadorOne.pos });
        jugadorOne.snake.shift();

    }
    if (jugadorTwo.vel.x || jugadorTwo.vel.y) {
        for (let cell of jugadorTwo.snake) { // aqui se verificara la posicion de la cabeza de la serpiente para ver sus colisiones
            if (cell.x === jugadorTwo.pos.x && cell.y === jugadorTwo.pos.y) {
                return 1
            }
        }
        jugadorTwo.snake.push({...jugadorTwo.pos });
        jugadorTwo.snake.shift();

    }

    return false;
}

function randomFood(state) {
    food = {
            x: Math.floor(Math.random() * tamaño_grid),
            y: Math.floor(Math.random() * tamaño_grid),
        }
        // tenemos que verificar si la comida se genera encima del jugador por lo cual tendremos que verificar las posiciones de la comida
        // y podemos llamar recursivamente a  la funcion para que si se genera encima de la comida 
        // se genere aleatoriamente otra vez
    for (let cell of state.players[0].snake) {
        if (cell.x === food.x && cell.y === food.y) {
            return randomFood(state);
        }
    }
    for (let cell of state.players[1].snake) {
        if (cell.x === food.x && cell.y === food.y) {
            return randomFood(state);
        }
    }
    state.food = food;
}


function getUpdateVelocidad(keyCode) {
    switch (keyCode) {
        case 37: // tecla izquierda
            {
                return { x: -1, y: 0 };
            }
        case 38: // tecla abajo
            {
                return { x: 0, y: -1 };
            }
        case 39: // tecla derecha
            {
                return { x: 1, y: 0 };
            }
        case 40: // tecla arriba
            {
                return { x: 0, y: 1 };
            }


    }
}