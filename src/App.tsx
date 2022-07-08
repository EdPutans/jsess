import { useState } from 'react'
import './App.css'
import { createHighlightBoard, createStartingBoard } from './helpers';
import { Position } from './typesNShit';


function App() {
  const [board, setBoard] = useState(createStartingBoard());
  const [highlights, setHighlights] = useState(createHighlightBoard());


  function showPossibleMoves(
    figure: Position, rowIndexOnBoard: number, cellIndexInRow: number) {
    const _highlights = createHighlightBoard();
    setHighlights(_highlights)
    if (!figure) return;
    // soooooooo many rules will go here

    // test algorithm to get moves for a bishop:
    if (figure.name !== 'oficer') return;

    const indexes: Array<{ x: number, y: number }> = [
      { y: rowIndexOnBoard, x: cellIndexInRow }
    ]

    for (let _y in highlights) {
      const row = highlights[_y];

      for (let _x in row) {
        const x = Number(_x);
        const y = Number(_y);

        if (indexes.find(indObj => indObj.x === x && indObj.y === y)) {

          for (let i = 0; i < 8; i++) {
            if (_highlights[y + i] !== undefined) {

              if (_highlights[y + i]?.[x + i] !== undefined)
                _highlights[y + i][x + i] = true

              if (_highlights[y + i]?.[x - i] !== undefined)
                _highlights[y + i][x - i] = true

            }
            if (_highlights[y - i] !== undefined) {
              if (_highlights[y - i][x + i] !== undefined)
                _highlights[y - i][x + i] = true

              if (_highlights[y - i][x - i] !== undefined)
                _highlights[y - i][x - i] = true

            }
          }
        }
      }
    }

    setHighlights(_highlights);

  }

  return <div className='board'>
    {board.map((row, rowIndexOnBoard) =>
      row.map((figure, cellIndexInRow) => {
        const backgroundColorClass = (rowIndexOnBoard + cellIndexInRow) % 2 === 0 ? 'black' : 'white';
        const color = figure?.color;
        const isHighlighted = highlights[rowIndexOnBoard][cellIndexInRow];

        return <div
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

