import { useEffect, useState } from 'react'
import './App.css'
import { createStartingBoard, figures } from './helpers';
import { clearBoardHighlights, highlightDama, highlightKonj, highlightKorolj, highlightOficer, highlightTura } from './moves';
import { Board, Figure, Position } from './typesNShit';

type SelectedFigure = {
  figure: Figure;
  x: number;
  y: number;
}

function App() {
  const [board, setBoard] = useState(createStartingBoard());
  const [selectedFigure, setSelectedFigure] = useState<SelectedFigure | null>(null);

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


  function moveSelectedFigureTo(to: { x: number, y: number }) {
    if (!selectedFigure) return;

    let _board = [...board] as Board;
    _board[to.y][to.x] = selectedFigure.figure;
    _board[selectedFigure.y][selectedFigure.x] = { isHighlighted: false };
    _board = clearBoardHighlights({ boardParam: _board });

    setBoard(_board);
    setSelectedFigure(null);

  }

  return <div className='board'>
    {board.map((row, rowIndexOnBoard) =>
      row.map((figure, cellIndexInRow) => {
        const isFigure = 'color' in figure;
        const cellColorClass = (rowIndexOnBoard + cellIndexInRow) % 2 === 0 ? 'black' : 'white';
        const figureColor = isFigure ? figure.color : undefined;


        function getCursor() {
          if (!isFigure) return 'default';
          if (figure.isHighlighted) return 'pointer'

          return 'default';
        }

        function getAction(cell: Position) {

          // if not selected ->
          //   if empty do nothing
          //   if figure -> highlightMoves for figure

          // if selected ->
          //   if cell is highlighted -> move there and unselect
          //   else -> nothing

          function selectFigure() {
            if (!('name' in figure)) return;
            console.log('is figure')
            if (!('name' in cell)) return;

            setSelectedFigure({ figure, x: cellIndexInRow, y: rowIndexOnBoard });
            showPossibleMoves(rowIndexOnBoard, cellIndexInRow);
          }


          if (!selectedFigure) selectFigure()

          else {
            if (cell.isHighlighted) {

              const x = cellIndexInRow;
              const y = rowIndexOnBoard;
              if (selectedFigure.x === x && selectedFigure.y === y) return;

              console.log(`Moving ${selectedFigure.figure.name} to y: ${rowIndexOnBoard} x: ${cellIndexInRow}`)

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
          onClick={() => getAction(figure)}
          style={{ cursor: getCursor(), backgroundColor: figure.isHighlighted ? 'pink' : undefined }}
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

