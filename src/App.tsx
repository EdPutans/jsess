import { useEffect, useState } from 'react'
import './App.css'
import { createStartingBoard, figures } from './helpers';
import { highlightDiagonals, highlightStraights, highlightVertsAndHorizontals } from './moves';
import { Board, Position } from './typesNShit';


function App() {
  const [board, setBoard] = useState(createStartingBoard());

  function showPossibleMoves(figure: Position, rowIndexOnBoard: number, cellIndexInRow: number) {
    if (!('name' in figure)) return;

    let _board = [...board] as Board;
    // test algorithm to get moves for a bishop:
    if (figure.name === 'oficer') {
      _board = highlightDiagonals({ boardParam: board, rowIndexOnBoard, cellIndexInRow });
    }
    else if (figure.name === 'tura') {
      _board = highlightStraights({ boardParam: board, rowIndexOnBoard, cellIndexInRow });
    }
    else if (figure.name === 'dama') {
      _board = highlightVertsAndHorizontals({ boardParam: board, rowIndexOnBoard, cellIndexInRow });
    }

    setBoard(_board);
  }

  useEffect(() => {
    board[2][2] = figures.black.dama
    board[3][4] = figures.white.tura
  }, [board])

  // console.log(board)
  return <div className='board'>
    {board.map((row, rowIndexOnBoard) =>
      row.map((figure, cellIndexInRow) => {
        const isFigure = 'color' in figure;

        const cellColorClass = (rowIndexOnBoard + cellIndexInRow) % 2 === 0 ? 'black' : 'white';
        const figureColor = isFigure ? figure.color : undefined;

        return <div
          key={cellIndexInRow + rowIndexOnBoard}
          onClick={() => showPossibleMoves(figure, rowIndexOnBoard, cellIndexInRow)}
          style={{ cursor: isFigure && figure?.icon ? 'pointer' : 'auto', backgroundColor: figure.isHighlighted ? 'pink' : undefined }}
          className={`cell cell-${cellColorClass} figure-${figureColor}`}
        >
          <div style={{ position: 'absolute', fontSize: 7, color: 'red' }}>x: {cellIndexInRow}, y: {rowIndexOnBoard}</div>
          {(isFigure && figure?.icon) || null}
        </div>
      }))
    }
  </div>
}

export default App

