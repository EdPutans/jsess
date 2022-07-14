import { useEffect, useState } from 'react'
import './App.css'
import { createStartingBoard, figures } from './helpers';
import { clearBoardHighlights, highlightDama, highlightKonj, highlightKorolj, highlightOficer, highlightPeshka, highlightTura } from './moves';
import { Board, Color, Figure, Position } from './typesNShit';

type SelectedFigure = {
  figure: Figure;
  x: number;
  y: number;
}

function App() {
  const [board, setBoard] = useState(createStartingBoard());
  const [selectedFigure, setSelectedFigure] = useState<SelectedFigure | null>(null);
  const [currentMove, setCurrentMove] = useState<Color>('white');

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
      case 'peshka':
        _board = highlightPeshka(props);
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


  function moveSelectedFigureTo(to: { x: number, y: number }) {
    if (!selectedFigure) return;

    const updatedFigure: Figure = {
      ...selectedFigure.figure,
      numberOfMoves: selectedFigure.figure.numberOfMoves + 1
    };

    let _board = [...board] as Board;
    _board[to.y][to.x] = updatedFigure;
    _board[selectedFigure.y][selectedFigure.x] = { isHighlighted: false };
    _board = clearBoardHighlights({ boardParam: _board });

    setBoard(_board);
    setSelectedFigure(null);
    setCurrentMove(currentMove === 'white' ? 'black' : 'white');
  }

  return <>
    <h1>Current move: {currentMove}</h1>
    <div className='board'>
      {board.map((row, rowIndexOnBoard) =>
        row.map((position, cellIndexInRow) => {
          const isFigure = 'color' in position;
          const cellColorClass = (rowIndexOnBoard + cellIndexInRow) % 2 === 0 ? 'black' : 'white';
          const figureColor = isFigure ? position.color : undefined;

          function getIsClickable() {
            if (selectedFigure && position.isHighlighted) return true;
            if (isFigure && (figureColor === currentMove)) return true;

            return false;
          }

          function getAction(cell: Position) {
            function selectFigure() {
              if (!('name' in position)) return;
              if (figureColor !== currentMove) return;

              setSelectedFigure({ figure: position, x: cellIndexInRow, y: rowIndexOnBoard });
              showPossibleMoves(rowIndexOnBoard, cellIndexInRow);
            }

            if (!selectedFigure) {
              selectFigure()
            } else {
              if (cell.isHighlighted) {
                if (
                  selectedFigure.x === cellIndexInRow &&
                  selectedFigure.y === rowIndexOnBoard
                ) return;
                moveSelectedFigureTo({ x: cellIndexInRow, y: rowIndexOnBoard });
              } else {
                if ('name' in cell) {
                  selectFigure()
                } else {
                  console.log(`can't move here yo!`)
                }
              }
            }
          }

          return <div
            key={cellIndexInRow + rowIndexOnBoard}
            onClick={() => getAction(position)}
            className={`
              cell
              cell-${cellColorClass}
              figure-${figureColor}
              ${position.isHighlighted ? 'highlighted' : ''}
              ${getIsClickable() ? 'clickable' : 'nonclickable'}
            `}
          >
            <div style={{ position: 'absolute', fontSize: 7, color: 'red' }}>x: {cellIndexInRow}, y: {rowIndexOnBoard}</div>
            {(isFigure && position?.icon) || null}
          </div>
        }))
      }
    </div>
  </>
}

export default App

