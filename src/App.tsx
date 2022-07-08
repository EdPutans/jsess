import { useState } from 'react'
import './App.css'
import { FixedLengthArray } from './typesNShit';

// '♕'
// '♖'
// '♗'
// '♘'
// '♙'
// [K in `${Figure['color']}${Name}`]: Figure

// blacktura: { icon: '♜', name: "tura", color: 'black' },
// blackkonj: { icon: '♞', name: "konj", color: 'black' },
// blackoficer: { icon: '♝', name: "oficer", color: 'black' },
// blackdama: { icon: '♛', name: 'dama', color: 'black' },
// blackkorolj: { icon: '♚', name: 'korolj', color: 'black' },
// blackpeshka: { icon: '♟', name: "peshka", color: 'black' },

const figures: {
  [K in Color]: {
    [K in Name]: Figure
  }
} = {
  white: {
    // todo: might not need color
    tura: { icon: '♜', name: "tura", color: 'white' },
    konj: { icon: '♞', name: "konj", color: 'white' },
    oficer: { icon: '♝', name: "oficer", color: 'white' },
    dama: { icon: '♛', name: "dama", color: 'white' },
    korolj: { icon: '♚', name: "korolj", color: 'white' },
    peshka: { icon: '♟', name: "peshka", color: 'white' },
  },
  black: {
    tura: { icon: '♜', name: "tura", color: 'white' },
    konj: { icon: '♞', name: "konj", color: 'white' },
    oficer: { icon: '♝', name: "oficer", color: 'white' },
    dama: { icon: '♛', name: "dama", color: 'white' },
    korolj: { icon: '♚', name: "korolj", color: 'white' },
    peshka: { icon: '♟', name: "peshka", color: 'white' },
  }
}

// TODO: translate to ENG later
//  type NameEng = "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";
type Name = "peshka" | "tura" | "konj" | "oficer" | "dama" | "korolj";
type Icon = '♜' | '♞' | '♝' | '♛' | '♚' | '♟';
type Color = 'black' | 'white';
type Figure = { icon: Icon; name: Name; color: Color };
type Position = Figure | null;
type Row = FixedLengthArray<Position, 8>
type Board = FixedLengthArray<Row, 8>;

function createFilledRow<T extends Position>(item: T): FixedLengthArray<T, 8> {
  return [...new Array(8)].fill(item) as FixedLengthArray<T, 8>
}

const createStartingPowerRow = (color: Figure['color']): Row => [
  figures[color].tura,
  figures[color].konj,
  figures[color].oficer,
  figures[color][color === 'white' ? 'dama' : 'korolj'],
  figures[color][color === 'black' ? 'dama' : 'korolj'],
  figures[color].oficer,
  figures[color].konj,
  figures[color].tura,
]

const createStartingBoard = (): Board => [
  // black figures
  createStartingPowerRow('black'),
  createFilledRow(figures.black.peshka),
  createFilledRow(null),
  createFilledRow(null),
  createFilledRow(null),
  createFilledRow(null),
  createFilledRow(figures.white.peshka),
  createStartingPowerRow('white'),
  // white figures

];

function getShowPossibleMoves(
  figure: Position, rowIndexOnBoard: number, cellIndexInRow: number) {
  if (!figure) return undefined;
  // soooooooo many rules will go here
  if (figure.name !== 'oficer') return undefined;

  // test algorithm to get moves for a bishop:
  // WIP

  return () => console.log(figure)
}

function App() {
  const [board, setBoard] = useState(createStartingBoard());

  return <div className='board'>
    {board.map((row, rowIndexOnBoard) =>
      row.map((figure, cellIndexInRow) => {
        const backgroundColorClass = (rowIndexOnBoard + cellIndexInRow) % 2 === 0 ? 'black' : 'white';
        const color = figure?.color;
        const isHighlighted = false;

        return <div
          onClick={getShowPossibleMoves(figure, rowIndexOnBoard, cellIndexInRow)}
          style={{ cursor: figure?.icon ? 'pointer' : 'auto', backgroundColor: isHighlighted ? 'pink' : undefined }}
          className={`cell cell-${backgroundColorClass} figure-${color}`}
        >
          {figure?.icon || null}
        </div>
      }))
    }
  </div>
}

export default App

