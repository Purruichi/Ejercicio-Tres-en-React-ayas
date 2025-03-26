import { useState, useEffect } from "react";
import { getBoard, reloadBoard, createGame, getWinner, turno, joinGame } from "./Api";

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(getBoard() || Array(9).fill(null));
  const [winner, setWinner] = useState(null);
  const [isPolling, setIsPolling] = useState(true);

  useEffect(() => {
    if (!isPolling) return;

    const interval = setInterval(() => {
      reloadBoard().then(() => {
        const newBoard = getBoard();
        if (JSON.stringify(squares) !== JSON.stringify(newBoard)) {
          setSquares(newBoard || Array(9).fill(null));
          setIsPolling(false);
        }
      });

      const currentWinner = getWinner();
      if (currentWinner) {
        setWinner(currentWinner);
        setIsPolling(false);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [squares, isPolling]);

  function handleClick(i) {
    if (squares[i] || winner) return;

    turno(i).then(() => {
      setSquares(getBoard() || Array(9).fill("Err"));
      setWinner(getWinner());
      setXIsNext(!xIsNext);
      setIsPolling(true);
    });
  }

  function handleNewGame() {
    createGame();
    setSquares(getBoard() || Array(9).fill(null));
    setWinner(null);
    setIsPolling(true);
  }

  function handleJoinGame() {
    joinGame()
      .then(() => {
        console.log("Unido al juego");
        setSquares(getBoard() || Array(9).fill(null));
        setWinner(null);
        setIsPolling(true);
      })
      .catch((error) => {
        console.error("Error al unirse al juego:", error);
      });
  }

  useEffect(() => {
    const newGameButton = document.getElementById("newGame");
    const joinGameButton = document.getElementById("joinGame");

    if (newGameButton) {
      newGameButton.addEventListener("click", handleNewGame);
    }

    if (joinGameButton) {
      joinGameButton.addEventListener("click", handleJoinGame);
    }

    return () => {
      if (newGameButton) {
        newGameButton.removeEventListener("click", handleNewGame);
      }
      if (joinGameButton) {
        joinGameButton.removeEventListener("click", handleJoinGame);
      }
    };
  }, []);

  let status = winner ? `Ganador: ${winner}!` : `Siguiente jugador: ${xIsNext ? "X" : "O"}`;

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