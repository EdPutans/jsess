import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import { FixedLengthArray } from './typesNShit';

// type NameEng = "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";
type Name = "peshka" | "tura" | "konj" | "oficer" | "dama" | "korolj";

type Figure = { name: Name; color: 'black' | 'white' };
type Position = Figure | null;
type Row = FixedLengthArray<Position, 8>
type Board = FixedLengthArray<Row, 8>;

function createFullRow<T extends Position>(item: T): FixedLengthArray<T, 8> {
  return [...new Array(8)].fill(item) as FixedLengthArray<T, 8>
}
const createStartingPowerRow = (color: Figure['color']): Row => [
  { name: "tura", color },
  { name: "konj", color },
  { name: "oficer", color },
  { name: color === 'white' ? "dama" : "korolj", color },
  { name: color === 'white' ? "korolj" : "dama", color },
  { name: "oficer", color },
  { name: "konj", color },
  { name: "tura", color },
]

const createStartingBoard = (): Board => [
  // black figures
  createStartingPowerRow('black'),
  createFullRow({ name: "peshka", color: 'black' }),
  createFullRow(null),
  createFullRow(null),
  createFullRow(null),
  createFullRow(null),
  createFullRow({ name: "peshka", color: 'white' }),
  createStartingPowerRow('white'),
  // white figures

];

function App() {
  const [board, setBoard] = useState(createStartingBoard());


}

export default App
