import { useState, useEffect } from "react";
import { getBoard, reloadBoard, createGame, getWinner, turno, joinGame, leaveGame, getInGame, resetGame, getXIsNext, setXIsNext } from "./Api";

export default function Board() {
  const [squares, setSquares] = useState(getBoard() || Array(9).fill(null));
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    if (!getInGame()) return;

    const interval = setInterval(() => {
      reloadBoard().then(() => {
        const newBoard = getBoard();
        if (JSON.stringify(squares) !== JSON.stringify(newBoard)) {
          setSquares(newBoard || Array(9).fill(null));
          setXIsNext(!getXIsNext());

          const currentWinner = getWinner();
          if (currentWinner) {
            setWinner(currentWinner);
          }
        }
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [squares]);

  function handleClick(i) {
    console.log(getWinner());
    if (squares[i] || getWinner()) return;

    turno(i).then(() => {
      setSquares(getBoard() || Array(9).fill(null));
      setWinner(getWinner());
    })
    .catch((error) => {
      console.error("Error al hacer el movimiento:", error);
      alert("No es tu turno de mover");
    });
  }

  function handleNewGame() {
    createGame();
    setSquares(getBoard() || Array(9).fill(null));
    setWinner(null);
  }

  function handleLeaveGame() {
    leaveGame()
    .then(() => {
      setSquares(Array(9).fill(null));
      setWinner(null);
    })
    .catch((error) => {
      console.error("Error al salir del juego:", error);
    });
  }

  function handleResetGame() {
    resetGame()
    .then(() => {
      setSquares(Array(9).fill(null));
      setWinner(null);
    })
    .catch((error) => {
      console.error("Error al reiniciar el juego:", error);
    });
  }

  function handleJoinGame() {
    joinGame()
    .then(() => {
      console.log("Unido al juego");
      setSquares(getBoard() || Array(9).fill(null));
      setWinner(null);
    })
    .catch((error) => {
      console.error("Error al unirse al juego:", error);
    });
  }

  useEffect(() => {
    const newGameButton = document.getElementById("newGame");
    const joinGameButton = document.getElementById("joinGame");
    const leaveGameButton = document.getElementById("leaveGame");
    const resetGameButton = document.getElementById("resetGame");

    if (newGameButton) {
      newGameButton.addEventListener("click", handleNewGame);
    }

    if (joinGameButton) {
      joinGameButton.addEventListener("click", handleJoinGame);
    }

    if (leaveGameButton) {
      leaveGameButton.addEventListener("click", handleLeaveGame);
    }

    if (resetGameButton) {
      resetGameButton.addEventListener("click", handleResetGame);
    }

    return () => {
      if (newGameButton) {
        newGameButton.removeEventListener("click", handleNewGame);
      }
      if (joinGameButton) {
        joinGameButton.removeEventListener("click", handleJoinGame);
      }
      if (leaveGameButton) {
        leaveGameButton.removeEventListener("click", handleLeaveGame);
      }
      if (resetGameButton) {
        resetGameButton.removeEventListener("click", handleResetGame);
      }
    };
  }, []);

  let status;
  if (getInGame() === false) {
    status = "No estás en un juego.";
  } else {
    status = getWinner() ? `Ganador: ${getWinner()}!` : `Siguiente jugador: ${getXIsNext() ? "X" : "O"}`;
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}