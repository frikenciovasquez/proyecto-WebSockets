const BG_color = '#231f20';
const snake_color = '#E67E22';
const food_color = '#239B56';


const socket = io('http://localhost:3000'); /// toma el url para conectar el front con el server
socket.on('init', handleinit);
socket.on('gameState', handleGameState);
socket.on('gameOver', handleGameOver); // ahora llamamos a paintgame cada vez que el servidor nos envie una actualizacion  del game state
socket.on('gameCode', handleGameCode);
socket.on('unknowngame', handleUnknowngame);
socket.on('tooManyJugadores', handleToomanyjugadores);

const pantallaJuego = document.getElementById('pantallaJuego');
const pantallaInicial = document.getElementById('initialScreen');
const botonNuevoJuego = document.getElementById('newGameButton');
const UnirseBoton = document.getElementById('joinGameButton');
const CodigoJuego = document.getElementById('gameCodeInput');
const CodigoJuegoDisplay = document.getElementById('gameCodeDisplay');


botonNuevoJuego.addEventListener('click', Nuevojuego);
UnirseBoton.addEventListener('click', Unirsejuego);


function Nuevojuego() {
    socket.emit('Nuevojuego');
    init();
}

function Unirsejuego() {
    const codigo = CodigoJuego.value;
    socket.emit('Unirsejuego', codigo);

    init();
}
let canvas, ctx;
let NumeroJugador;
let gameActive = false;

//los objetos que componen el juego la posicion del jugador, las posciones de las serpietes
// las posciones del cuerpo de las serpientes la posicion de la comida y el tamaño del mapa
// todo como objeto que se ira actualizando constantemente dentro del servidor pero que nos sirve como
//posiciones / caracteristicas iniciales 

function init() {
    pantallaInicial.style.display = 'none';
    pantallaJuego.style.display = 'block';


    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    canvas.width = canvas.height = 600;

    ctx.fillStyle = BG_color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    document.addEventListener('keydown', keydown);
    gameActive = true;

}

function keydown(e) {
    console.log(e.keyCode);
    socket.emit('keydown', e.keyCode);
}



// pinta los elementos del juego
function paintGame(state) {

    ctx.fillStyle = BG_color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    const food = state.food;
    const gridsize = state.gridsize;
    ///esto calcula los puxeles por espacio en el cuadrado del juego
    /// tenemos 600 px del tablero / 20 cuadrados  nos dan 30 comidas aprox
    const size = canvas.width / gridsize;

    ctx.fillStyle = food_color;
    ctx.fillRect(food.x * size, food.y * size, size, size);

    paintPlayer(state.players[0], size, snake_color);
    paintPlayer(state.players[1], size, 'red');
}

function paintPlayer(playerState, size, color) {
    const snake = playerState.snake;

    ctx.fillStyle = color;

    for (let cell of snake) {

        ctx.fillRect(cell.x * size, cell.y * size, size, size);
    }
}

///paintGame(gameState); //se llama manual los dibujos del front

function handleinit(number) {
    NumeroJugador = number;



}

function handleGameState(gameState) {
    if (!gameActive) {
        return;
    }
    gameState = JSON.parse(gameState);
    requestAnimationFrame(() => paintGame(gameState)) // cada ves que el seridor envia un menajse con el estado del game state se recibira y se repintara con la informacion entrante
}

function handleGameOver(data) {
    if (!gameActive) {
        return;
    }
    data = JSON.parse(data);

    if (data.winner === NumeroJugador) {
        alert('Ganaste!!!1')
    } else {
        alert('Perdiste!');
    }
    gameActive = false;
}

function handleGameCode(gameCode) {
    CodigoJuegoDisplay.innerText = gameCode;
}

function handleUnknowngame() {
    reset();
    alert('Codigo de juego desconocido')
}

function handleToomanyjugadores() {
    reset();
    alert('Este Juego esta empezado')
}

function reset() {
    NumeroJugador = null;
    gameCodeInput.value = "";
    gameCodeDisplay.innerText = "";
    initialScreen.style.display = 'block';
    pantallaJuego.style.display = 'none';
}