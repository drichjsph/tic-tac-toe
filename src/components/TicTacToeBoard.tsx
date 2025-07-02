'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TicTacToeBoard() {
  const [board, setBoard] = useState(Array(9).fill(''));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [playerX, setPlayerX] = useState('');
  const [playerO, setPlayerO] = useState('');
  const [winner, setWinner] = useState<string | null>(null);
  const [draw, setDraw] = useState(false);
  const [score, setScore] = useState({ X: 0, O: 0 });
  const [winningCells, setWinningCells] = useState<number[] | null>(null);

  // Load sound effects
  const clickSound = typeof Audio !== "undefined" ? new Audio('/sounds/click.mp3') : null;
  const winSound = typeof Audio !== "undefined" ? new Audio('/sounds/win.mp3') : null;
  const drawSound = typeof Audio !== "undefined" ? new Audio('/sounds/draw.mp3') : null;

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const checkWinner = (newBoard: string[]) => {
    for (let combination of winningCombinations) {
      const [a, b, c] = combination;
      if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
        setWinningCells(combination);
        return newBoard[a];
      }
    }
    return null;
  };

  const checkDraw = (newBoard: string[]) => {
    return newBoard.every(cell => cell !== '');
  };

  const handleClick = (index: number) => {
    if (board[index] !== '' || winner) return;

    if (clickSound) clickSound.play();

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const winResult = checkWinner(newBoard);
    if (winResult) {
      const winnerName = winResult === 'X' ? playerX : playerO;
      setWinner(winnerName || winResult);
      if (winSound) winSound.play();
      setScore(prev => ({
        ...prev,
        [winResult]: prev[winResult as 'X' | 'O'] + 1
      }));
      return;
    }

    if (checkDraw(newBoard)) {
      setDraw(true);
      if (drawSound) drawSound.play();
      return;
    }

    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  };

  const resetGame = () => {
    setBoard(Array(9).fill(''));
    setCurrentPlayer('X');
    setWinner(null);
    setDraw(false);
    setWinningCells(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-4">
      <h1 className="text-4xl font-bold mb-6">Tic-Tac-Toe</h1>

      {/* Player Name Inputs */}
      <div className="flex flex-col gap-4 mb-4">
        <Input
          placeholder="Enter Player X Name"
          value={playerX}
          onChange={(e) => setPlayerX(e.target.value)}
          className="w-64"
        />
        <Input
          placeholder="Enter Player O Name"
          value={playerO}
          onChange={(e) => setPlayerO(e.target.value)}
          className="w-64"
        />
      </div>

      {/* Scoreboard */}
      <div className="flex gap-8 text-lg mb-4">
        <div className="text-blue-600 font-semibold">
          {playerX || 'Player X'} (X): {score.X}
        </div>
        <div className="text-red-600 font-semibold">
          {playerO || 'Player O'} (O): {score.O}
        </div>
      </div>

      {/* Turn or Result Display */}
      {!winner && !draw ? (
        <h2 className="text-2xl mb-4">
          Your Turn: {currentPlayer === 'X' ? playerX || 'Player X' : playerO || 'Player O'} ({currentPlayer})
        </h2>
      ) : winner ? (
        <h2 className="text-2xl mb-4 font-bold text-green-600">🎉 Winner: {winner} 🎉</h2>
      ) : (
        <h2 className="text-2xl mb-4 font-bold text-yellow-500">😮 It's a Draw!</h2>
      )}

      {/* Game Board */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {board.map((cell, index) => (
          <Button
            key={index}
            className={`w-24 h-24 text-3xl ${
              winningCells && winningCells.includes(index) ? 'bg-green-300' : ''
            }`}
            onClick={() => handleClick(index)}
          >
            <span className={cell === 'X' ? 'text-blue-600' : cell === 'O' ? 'text-red-600' : ''}>
              {cell}
            </span>
          </Button>
        ))}
      </div>

      {/* Reset Button */}
      <Button onClick={resetGame} className="text-lg px-6">
        Reset Game
      </Button>
    </div>
  );
}
