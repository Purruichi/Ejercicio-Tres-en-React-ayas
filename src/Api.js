const API_BASE_URL = "http://172.20.10.4:8080";

const outputGameId = document.getElementById('outputGameId');
const outputPlayerXId = document.getElementById('outputPlayerXId'); // Cambiado
const outputPlayerOId = document.getElementById('outputPlayerOId'); // Nuevo
const outputBoard = document.getElementById('outputBoard');
const outputWinner = document.getElementById('outputWinner');
const outputError = document.getElementById('outputError');

let gameId;
let playerId;
let board;
let winner;

export function getGameId(){
    return gameId;
}

export function getBoard(){
    return board;
}

export function getWinner(){
    return winner;
}

export async function createGame(){
    return fetch(`${API_BASE_URL}/create`)
    .then(response => response.json())
    .then(data => {
        gameId = data.idPartida;
        playerId = data.idPlayerX;
        board = data.board;
        winner = data.ganador;

        outputGameId.textContent = `Game ID: ${gameId}`;
        outputPlayerXId.textContent = `Player X ID: ${playerId}`; // Actualizado
        outputBoard.textContent = `Board: ${JSON.stringify(board)}`;
        outputWinner.textContent = `Winner: ${winner}`;
    })
    .catch(error => {
        outputError.textContent = `Error: ${error}`;
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
            winner = data.ganador;

            outputGameId.textContent = `Game ID: ${gameId}`;
            outputPlayerOId.textContent = `Player O ID: ${playerId}`;
            outputBoard.textContent = `Board: ${JSON.stringify(board)}`;
            outputWinner.textContent = `Winner: ${winner}`;
        })
        .catch(error => {
            outputError.textContent = `Error: ${error}`;
        });
}

export async function turno(casilla) {
    console.log(playerId);
    return fetch(`${API_BASE_URL}/turno/${gameId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ casilla, idJugador: playerId }),
    })
        .then(response => response.json())
        .then(data => {
            board = data.board;
            winner = data.ganador;

            outputBoard.textContent = `Board: ${JSON.stringify(board)}`;
            outputWinner.textContent = `Winner: ${winner}`;
        })
        .catch(error => {
            outputError.textContent = `Error: ${error}`;
        });
}

export async function reloadBoard() {
    console.log(gameId);
    return fetch(`${API_BASE_URL}/actualizar/${gameId}`)
        .then(response => response.json())
        .then(data => {
            board = data.board;
            console.log(board);
            winner = data.ganador;
            console.log(winner);
        })
        .catch(error => console.error("Error:", error));
}