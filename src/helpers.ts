// '♕'
// '♖'
// '♗'
// '♘'
// '♙'
// [K in `${Figure['color']}${Name}`]: Figure

import { Board, Color, Figure, FixedLengthArray, Name, Position, Row } from "./typesNShit";

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
    tura: { icon: '♜', name: "tura", color: 'white' },
    konj: { icon: '♞', name: "konj", color: 'white' },
    oficer: { icon: '♝', name: "oficer", color: 'white' },
    dama: { icon: '♛', name: "dama", color: 'white' },
    korolj: { icon: '♚', name: "korolj", color: 'white' },
    peshka: { icon: '♟', name: "peshka", color: 'white' },
  },
  black: {
    tura: { icon: '♜', name: "tura", color: 'black' },
    konj: { icon: '♞', name: "konj", color: 'black' },
    oficer: { icon: '♝', name: "oficer", color: 'black' },
    dama: { icon: '♛', name: "dama", color: 'black' },
    korolj: { icon: '♚', name: "korolj", color: 'black' },
    peshka: { icon: '♟', name: "peshka", color: 'black' },
  }
}



export function createFilledRow<T extends Position | Boolean>(item: Position | Boolean): FixedLengthArray<T, 8> {
  return [...new Array(8)].fill(item) as FixedLengthArray<T, 8>
}

export const createStartingPowerRow = (color: Figure['color']): Row => [
  figures[color].tura,
  figures[color].konj,
  figures[color].oficer,
  figures[color][color === 'white' ? 'dama' : 'korolj'],
  figures[color][color === 'black' ? 'dama' : 'korolj'],
  figures[color].oficer,
  figures[color].konj,
  figures[color].tura,
]

export const createHighlightBoard = (): Array<Array<Boolean>> => [
  createFilledRow(false),
  createFilledRow(false),
  createFilledRow(false),
  createFilledRow(false),
  createFilledRow(false),
  createFilledRow(false),
  createFilledRow(false),
  createFilledRow(false),
];

export const createStartingBoard = (): Board => [
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

