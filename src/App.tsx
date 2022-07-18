import { useEffect, useState } from 'react'
import './App.css'
import { createClearBoard, createStartingBoard, figures } from './helpers';
import { clearBoardHighlights, findKingsIndexes, highlightDama, highlightFigureMovesOnBoard, highlightKonj, highlightKorolj, highlightOficer, highlightPeshka, highlightTura, isOccupied } from './moves';
import { Board, Color, Figure, Position } from './typesNShit';

type SelectedFigure = {
  figure: Figure;
  x: number;
  y: number;
}

function App() {
  const [board, setBoard] = useState(
    // createStartingBoard()
    createClearBoard()
  );
  const [selectedFigure, setSelectedFigure] = useState<SelectedFigure | null>(null);
  const [currentMove, setCurrentMove] = useState<Color>(
    // 'black'
    'white'
  );
  const [victor, setVictor] = useState<Color | null>(null)

  function showPossibleMoves(rowIndexOnBoard: number, cellIndexInRow: number) {
    setBoard(highlightFigureMovesOnBoard(clearBoardHighlights({ boardParam: board }), rowIndexOnBoard, cellIndexInRow));
  }

  useEffect(() => {

  }, [board])

  useEffect(() => {
    // testing
    let _board = [...board] as Board;
    _board[3][4] = figures.black.korolj
    _board[5][3] = figures.white.dama
    _board[1][5] = figures.white.dama
    setBoard(_board);


    const fakeBoard = [..._board] as Board;
    const kingIndexes = findKingsIndexes(fakeBoard);

    // check white victory
    if (!kingIndexes.black) return;
    if (!kingIndexes.white) return;
    const blackKingMoves = highlightKorolj({ boardParam: fakeBoard, rowIndexOnBoard: kingIndexes.black.y, cellIndexInRow: kingIndexes.black.x });
    const nbBlackKingMoves = blackKingMoves.reduce((agg, row) => {
      const nbItemsInRow = row.filter(item => item.isHighlighted).length;
      return agg + nbItemsInRow;
    }, 0)
    if (nbBlackKingMoves === 0) return setVictor('white');

    // check black victory
    if (!kingIndexes.white) return;
    const whiteKingMoves = highlightKorolj({ boardParam: fakeBoard, rowIndexOnBoard: kingIndexes.white.y, cellIndexInRow: kingIndexes.white.x });
    const nbWhiteKingMoves = whiteKingMoves.reduce((agg, row) => {
      const nbItemsInRow = row.filter(item => item.isHighlighted).length;
      return agg + nbItemsInRow;
    }, 0)

    if (nbWhiteKingMoves === 0) return setVictor('black');


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
    {victor && <h1>VICTORY FOR {victor.toUpperCase()}!!</h1>}

    <div className='board'>
      {board.map((row, rowIndexOnBoard) =>
        row.map((position, cellIndexInRow) => {
          const isFigure = isOccupied(position);
          const cellColorClass = (rowIndexOnBoard + cellIndexInRow) % 2 === 0 ? 'black' : 'white';
          const figureColor = isFigure ? position.color : undefined;

          function getIsClickable() {
            if (selectedFigure && position.isHighlighted) return true;
            if (isFigure && (figureColor === currentMove)) return true;

            return false;
          }

          function getAction(cell: Position) {
            function selectFigure() {
              if (!isOccupied(position)) return;
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
                if (isOccupied(position)) {
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
            //TODO: make it a class
            style={{ backgroundColor: selectedFigure?.x === cellIndexInRow && selectedFigure?.y === rowIndexOnBoard ? 'pink' : '' }}
          >
            <div style={{ position: 'absolute', fontSize: 7 }}>x: {cellIndexInRow}, y: {rowIndexOnBoard}</div>
            {(isFigure && position?.icon) || null}
          </div>
        }))
      }
    </div>
  </>
}

export default App

