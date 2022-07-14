import { useEffect, useState } from 'react'
import './App.css'
import { createStartingBoard, figures } from './helpers';
import { highlightDama, highlightKorolj, highlightOficer, highlightTura } from './moves';
import { Board, Position } from './typesNShit';

function App() {
  const [board, setBoard] = useState(createStartingBoard());

  function showPossibleMoves(figure: Position, rowIndexOnBoard: number, cellIndexInRow: number) {
    if (!('name' in figure)) return;

    let _board = [...board] as Board;
    const props = { boardParam: _board, rowIndexOnBoard, cellIndexInRow };

    switch (figure.name) {
      case 'dama':
        _board = highlightDama(props);
        break;
      case 'oficer':
        _board = highlightOficer(props);
        break;
      case 'tura':
        _board = highlightTura(props);
        break;
      case 'korolj':
        _board = highlightKorolj(props);
        break;
      default:
        break;
    }

    setBoard(_board);
  }

  useEffect(() => {
    let _board = [...board] as Board;
    _board[2][2] = figures.black.dama
    _board[3][4] = figures.white.tura
    _board[4][4] = figures.white.korolj
    setBoard(_board);
  }, [])

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

