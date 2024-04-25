import React, { useState, useEffect } from 'react';
import './App.css';

const initialState = Array(9).fill(null);

const App = () => {
  const [board, setBoard] = useState(initialState);
  const [xIsNext, setXIsNext] = useState(true);
  const [isSinglePlayer, setIsSinglePlayer] = useState(false);

  useEffect(() => {
    if (!xIsNext && isSinglePlayer) {
      // AI makes a random move after a delay
      const timer = setTimeout(() => {
        makeRandomMove();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [xIsNext, isSinglePlayer]);

  const handleClick = (index) => {
    const newBoard = [...board];
    if (calculateWinner(newBoard) || newBoard[index]) return;
    newBoard[index] = xIsNext ? '❤️' : '💜';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const makeRandomMove = () => {
    const availableMoves = board.reduce((acc, cell, index) => {
      if (!cell) acc.push(index);
      return acc;
    }, []);
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    handleClick(availableMoves[randomIndex]);
  };

  const togglePlayerMode = () => {
    setIsSinglePlayer(!isSinglePlayer);
    setBoard(initialState);
    setXIsNext(true);
  };

  const renderSquare = (index) => {
    const winner = calculateWinner(board);
    const isWinningSquare = winner && winner.line.includes(index);

    return (
      <div
        className={`square ${isWinningSquare ? 'winning' : ''}`}
        onClick={() => handleClick(index)}
      >
        {board[index]}
      </div>
    );
  };

  const resetGame = () => {
    setBoard(initialState);
    setXIsNext(true);
  };

  const winner = calculateWinner(board);
  let status;
  if (winner) {
    status = `Winner: ${winner.player}`;
  } else if (!board.includes(null)) {
    status = 'It\'s a draw!';
  } else {
    status = `Next player: ${xIsNext ? '❤️' : '💜'}`;
  }

  return (
    <div className="app">
      <h1>Tic Tac Toe</h1>
      <div className="board">
        {Array(9)
          .fill(null)
          .map((_, index) => (
            <div key={index} className="square">
              {renderSquare(index)}
            </div>
          ))}
      </div>
      <div className="status">{status}</div>
      <button className="reset-button" onClick={resetGame}>
        New Game
      </button>
      <button className="mode-button" onClick={togglePlayerMode}>
        {isSinglePlayer ? 'Switch to Two Players' : 'Play with AI'}
      </button>
    </div>
  );
};

// Function to calculate the winner
const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        player: squares[a],
        line: [a, b, c],
      };
    }
  }
  return null;
};

export default App;
