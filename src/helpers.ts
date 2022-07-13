// '♕'
// '♖'
// '♗'
// '♘'
// '♙'
// [K in `${Figure['color']}${Name}`]: Figure

import { Board, Color, Figure, FixedLengthArray, Name, Position, Row, Cell } from "./typesNShit";

export const emptyCell: Cell = { isHighlighted: false }
// blacktura: { icon: '♜', name: "tura", color: 'black' },
// blackkonj: { icon: '♞', name: "konj", color: 'black' },
// blackoficer: { icon: '♝', name: "oficer", color: 'black' },
// blackdama: { icon: '♛', name: 'dama', color: 'black' },
// blackkorolj: { icon: '♚', name: 'korolj', color: 'black' },
// blackpeshka: { icon: '♟', name: "peshka", color: 'black' },


export const figures: {
  [K in Color]: {
    [K in Name]: Figure
  }
} = {
  white: {
    // todo: might not need color
    tura: { icon: '♜', name: "tura", isHighlighted: false, color: 'white' },
    konj: { icon: '♞', name: "konj", isHighlighted: false, color: 'white' },
    oficer: { icon: '♝', name: "oficer", isHighlighted: false, color: 'white' },
    dama: { icon: '♛', name: "dama", isHighlighted: false, color: 'white' },
    korolj: { icon: '♚', name: "korolj", isHighlighted: false, color: 'white' },
    peshka: { icon: '♟', name: "peshka", isHighlighted: false, color: 'white' },
  },
  black: {
    tura: { icon: '♜', name: "tura", isHighlighted: false, color: 'black' },
    konj: { icon: '♞', name: "konj", isHighlighted: false, color: 'black' },
    oficer: { icon: '♝', name: "oficer", isHighlighted: false, color: 'black' },
    dama: { icon: '♛', name: "dama", isHighlighted: false, color: 'black' },
    korolj: { icon: '♚', name: "korolj", isHighlighted: false, color: 'black' },
    peshka: { icon: '♟', name: "peshka", isHighlighted: false, color: 'black' },
  }
}



export function createFilledRow<T extends Position | Boolean>(item: Position | Boolean): FixedLengthArray<T, 8> {
  return [...new Array(8)].fill(item) as FixedLengthArray<T, 8>
}

export const createStartingPowerRow = (color: Color): Row => [
  figures[color].tura,
  figures[color].konj,
  figures[color].oficer,
  figures[color][color === 'white' ? 'dama' : 'korolj'],
  figures[color][color === 'black' ? 'dama' : 'korolj'],
  figures[color].oficer,
  figures[color].konj,
  figures[color].tura,
]



export const createStartingBoard = (): Board => [
  // black figures
  createStartingPowerRow('black'),
  createFilledRow(figures.black.peshka),
  createFilledRow(emptyCell),
  createFilledRow(emptyCell),
  createFilledRow(emptyCell),
  createFilledRow(emptyCell),
  createFilledRow(figures.white.peshka),
  createStartingPowerRow('white'),
  // white figures
];

