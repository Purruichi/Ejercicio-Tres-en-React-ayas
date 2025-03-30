const API_BASE_URL = "http://192.168.1.41:8080";

const outputGameId = document.getElementById('outputGameId');

let gameId;
let playerId;
let board;
let winner;
let inGame = false;
let xIsNext;

export function getGameId(){
    return gameId;
}

export function getBoard(){
    return board;
}

export function getWinner(){
    return winner;
}

export function getInGame(){
    return inGame;
}

export function getXIsNext(){
    return xIsNext;
}

export function setXIsNext(value){
    xIsNext = value;
}

export async function createGame(){
    return fetch(`${API_BASE_URL}/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({}),
    })
    .then(response => response.json())
    .then(data => {
        gameId = data.idPartida;
        playerId = data.idPlayerX;
        board = data.board;
        winner = data.ganador || null;
        inGame = true;
        xIsNext = true;

        outputGameId.textContent = `Game ID: ${gameId}`;
    })
    .catch(error => {
        console.error(`Error: ${error}`);
    });
}

export async function joinGame() {
    gameId = document.getElementById("gameId").value;
    return fetch(`${API_BASE_URL}/join/${gameId}`)
        .then(response => response.json())
        .then(data => {
            gameId = data.idPartida;
            playerId = data.idPlayerO;
            board = data.board;
            winner = data.ganador || null;
            inGame = true;
            console.log(data.turnoActual || "No hay turno actual");
            if(data.turnoActual === 'X'){
                xIsNext = true;
            }else{
                xIsNext = false;
            }

            outputGameId.textContent = `Game ID: ${gameId}`;
        })
        .catch(error => {
            console.error(`Error: ${error}`);
        });
}

export async function turno(casilla) {
    console.log(playerId);
    return fetch(`${API_BASE_URL}/turno/${gameId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ casilla, idJugador: playerId }),
    })
    .then(async(response) => {
        if (response.status === 404) {
            const errorText = await response.text();
            if (errorText === "Partida terminada por el host") {
                alert(errorText);
                gameId = null;
                playerId = null;
                board = Array(9).fill(null);
                winner = null;

                outputGameId.textContent = "";
            }
            throw new Error(errorText);
        } else {
            return response.json();
        }
    })
    .then(data => {
        board = data.board;
        winner = data.ganador || null;
        xIsNext = !xIsNext;
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

export async function reloadBoard() {
    console.log(gameId);
    return fetch(`${API_BASE_URL}/actualizar/${gameId}`)
    .then(async(response) => {
        if (response.status === 404) {
            const errorText = await response.text();
            if (errorText === "Partida terminada por el host") {
                alert(errorText);
                gameId = null;
                playerId = null;
                board = Array(9).fill(null);
                winner = null;

                outputGameId.textContent = "";
            }
            throw new Error(errorText);
        } else {
            return response.json();
        }
    })
    .then(data => {
        board = data.board;
        winner = data.ganador || null;
    })
    .catch(error => console.error("Error:", error));
}

export async function leaveGame() {
    return fetch(`${API_BASE_URL}/delete/${gameId}/${playerId}`, {
        method: "DELETE",
    })
        .then(response => response.json())
        .then(data => {
            gameId = null;
            playerId = null;
            board = Array(9).fill(null);
            winner = null;
            inGame = false;

            outputGameId.textContent = "";
        })
        .catch(error => {
            console.error(`Error: ${error}`);
        });
}

export async function resetGame() {
    return fetch(`${API_BASE_URL}/reset/${gameId}`, {
        method: "PUT",
    })
        .then(response => response.json())
        .then(data => {
            board = Array(9).fill(null); // Reiniciar el tablero
            winner = null;
        })
        .catch(error => {
            console.error(`Error: ${error}`);
        });
}