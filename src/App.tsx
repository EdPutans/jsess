import { useEffect, useState } from 'react'
import './App.css'
import { createStartingBoard, figures } from './helpers';
import { highlightDama, highlightKonj, highlightKorolj, highlightOficer, highlightTura } from './moves';
import { Board, Figure, Position } from './typesNShit';

function App() {
  const [board, setBoard] = useState(createStartingBoard());
  const [selectedFigure, setSelectedFigure] = useState<Figure | null>(null);

  function showPossibleMoves(rowIndexOnBoard: number, cellIndexInRow: number) {
    let figure: Position = board[rowIndexOnBoard][cellIndexInRow];
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
      case 'konj':
        _board = highlightKonj(props);
        break;
      default:
        break;
    }

    setBoard(_board);
  }

  useEffect(() => {
    let _board = [...board] as Board;
    _board[3][4] = figures.white.konj
    _board[5][4] = figures.white.tura
    setBoard(_board);
  }, [])

  // console.log(board)
  return <div className='board'>
    {board.map((row, rowIndexOnBoard) =>
      row.map((figure, cellIndexInRow) => {
        const isFigure = 'color' in figure;
        const cellColorClass = (rowIndexOnBoard + cellIndexInRow) % 2 === 0 ? 'black' : 'white';
        const figureColor = isFigure ? figure.color : undefined;

        function getAction(figure: Position) {
          // if (!('name' in figure)) return;
          if (!selectedFigure) {
            return () => {
              showPossibleMoves(rowIndexOnBoard, cellIndexInRow);
              setSelectedFigure(figure ||);
            }
          }
          // move;
          return () => {
            const canMoveHere = board[rowIndexOnBoard][cellIndexInRow].isHighlighted;
            if (canMoveHere) {
              console.log('moving to', rowIndexOnBoard, cellIndexInRow);
              return;
            }
            setSelectedFigure(figure);
          }
        }

        return <div
          key={cellIndexInRow + rowIndexOnBoard}
          onClick={getAction(figure)}
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

