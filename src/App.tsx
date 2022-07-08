import { useState } from 'react'
import './App.css'
import { createHighlightBoard, createStartingBoard, figures } from './helpers';
import { Position } from './typesNShit';


function App() {
  const [board, setBoard] = useState(createStartingBoard());
  const [highlights, setHighlights] = useState(createHighlightBoard());


  function showPossibleMoves(figure: Position, rowIndexOnBoard: number, cellIndexInRow: number) {

    const _highlights = createHighlightBoard();
    setHighlights(_highlights)

    if (!figure) return;
    // soooooooo many rules will go here

    // test algorithm to get moves for a bishop:
    if (figure.name !== 'oficer') return;

    _highlights[rowIndexOnBoard][cellIndexInRow] = true;

    function highlightDiagonals() {
      for (let _y in highlights) {
        const row = highlights[_y];

        for (let _x in row) {
          const x = Number(cellIndexInRow);
          const y = Number(rowIndexOnBoard);

          let upLeftOff = false
          let upRightOff = false
          let downLeftOff = false
          let downRightOff = false

          for (let i = 1; i <= 7; i++) {
            if (_highlights[y + i] !== undefined) {
              const row = _highlights[y + i];
              if (board[y + i][x + i] !== null) downRightOff = figure?.color === board[y + i][x + i]?.color
              if (row[x + i] !== undefined && !downRightOff) row[x + i] = true
              if (board[y + i][x + i] !== null) downRightOff = true

              if (board[y + i][x + i] !== null) downLeftOff = figure?.color === board[y + i][x - i]?.color
              if (row[x - i] !== undefined && !downLeftOff) row[x - i] = true
              if (board[y + i][x - i] !== null) downLeftOff = true

            }
            if (_highlights[y - i] !== undefined) {
              const row = _highlights[y - i];
              if (board[y - i][x + i] !== null) upRightOff = figure?.color === board[y + i][x + i]?.color
              if (row[x + i] !== undefined && !upRightOff) row[x + i] = true
              if (board[y - i][x + i] !== null) upRightOff = true

              if (board[y - i][x + i] !== null) upRightOff = figure?.color === board[y + i][x - i]?.color
              if (row[x - i] !== undefined && !upLeftOff) row[x - i] = true
              if (board[y - i][x - i] !== null) upLeftOff = true
            }
          }
        }
      }
    }
    highlightDiagonals()

    setHighlights(_highlights);
  }

  board[3][4] = figures.white.oficer

  return <div className='board'>
    {board.map((row, rowIndexOnBoard) =>
      row.map((figure, cellIndexInRow) => {
        const backgroundColorClass = (rowIndexOnBoard + cellIndexInRow) % 2 === 0 ? 'black' : 'white';
        const color = figure?.color;
        const isHighlighted = highlights[rowIndexOnBoard][cellIndexInRow];

        return <div
          key={cellIndexInRow + rowIndexOnBoard}
          onClick={() => showPossibleMoves(figure, rowIndexOnBoard, cellIndexInRow)}
          style={{ cursor: figure?.icon ? 'pointer' : 'auto', backgroundColor: isHighlighted ? 'pink' : undefined }}
          className={`cell cell-${backgroundColorClass} figure-${color}`}
        >
          <div style={{ position: 'absolute', fontSize: 7, color: 'red' }}>x: {cellIndexInRow}, y: {rowIndexOnBoard}</div>
          {figure?.icon || null}
        </div>
      }))
    }
  </div>
}

export default App

