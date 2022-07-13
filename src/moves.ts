import { Board, Figure, Position } from "./typesNShit";

type HighlightProps = {
  boardParam: Board,
  rowIndexOnBoard: number,
  cellIndexInRow: number,
}

function clearBoardHighlights({
  boardParam
}: { boardParam: Board }): Board {

  const board: Board = [...boardParam].map<Position[]>(row => row.map<Position>((item) => ({ ...item, isHighlighted: false }))) as Board;
  return board;
}

function isOccupied(cell: Position): cell is Figure {
  return (cell && ("color" in cell));
}

export function highlightDiagonals({
  boardParam, rowIndexOnBoard, cellIndexInRow
}: HighlightProps): Board {
  const figure = boardParam[rowIndexOnBoard][cellIndexInRow] as Figure;

  const board: Board = clearBoardHighlights({ boardParam })
  board[rowIndexOnBoard][cellIndexInRow].isHighlighted = true;

  const x = Number(cellIndexInRow);
  const y = Number(rowIndexOnBoard);

  let upLeftOff = false
  let upRightOff = false
  let downLeftOff = false
  let downRightOff = false

  for (let i = 1; i <= 7; i++) {
    if (board[y + i] !== undefined) {

      let currentCell = board[y + i][x + i]
      if (isOccupied(currentCell) && !downRightOff) downRightOff = figure.color === currentCell.color;
      if (currentCell !== undefined && !downRightOff) currentCell.isHighlighted = true
      if (isOccupied(currentCell)) downRightOff = true

      currentCell = board[y + i][x - i]
      if (isOccupied(currentCell) && !downLeftOff) downLeftOff = figure.color === currentCell.color
      if (currentCell !== undefined && !downLeftOff) currentCell.isHighlighted = true
      if (isOccupied(currentCell)) downLeftOff = true
    }

    if (board[y - i] !== undefined) {
      let currentCell = board[y - i][x + i];

      if (isOccupied(currentCell) && !upRightOff) upRightOff = figure.color === currentCell.color
      if (currentCell !== undefined && !upRightOff) currentCell.isHighlighted = true
      if (isOccupied(currentCell)) upRightOff = true

      currentCell = board[y - i][x - i];
      if (isOccupied(currentCell) && !upLeftOff) upLeftOff = figure.color === currentCell.color
      if (currentCell && !upLeftOff) currentCell.isHighlighted = true
      if (isOccupied(currentCell)) upLeftOff = true
    }
  }

  return board;
}


export function highlightStraights({ boardParam, rowIndexOnBoard, cellIndexInRow }: HighlightProps): Board {
  const figure = boardParam[rowIndexOnBoard][cellIndexInRow] as Figure;

  const board: Board = clearBoardHighlights({ boardParam });
  board[rowIndexOnBoard][cellIndexInRow].isHighlighted = true;

  const x = Number(cellIndexInRow);
  const y = Number(rowIndexOnBoard);

  let leftOff = false
  let rightOff = false
  let downOff = false
  let upOff = false

  for (let i = 1; i < 7; i++) {
    if (board[y + i] !== undefined) {
      let currentCell = board[y + i][x];

      if (isOccupied(currentCell) && !downOff) downOff = figure.color === currentCell.color
      if (currentCell !== undefined && !downOff) currentCell.isHighlighted = true
      if (isOccupied(currentCell)) downOff = true
    }

    if (board[y - i] !== undefined) {
      let currentCell = board[y - i][x];

      if (isOccupied(currentCell) && !upOff) upOff = figure.color === currentCell.color
      if (currentCell !== undefined && !upOff) currentCell.isHighlighted = true
      if (isOccupied(currentCell)) upOff = true
    }
    if (board[y][x + i] !== undefined) {
      let currentCell = board[y][x + i]

      if (isOccupied(currentCell) && !rightOff) rightOff = figure.color === currentCell.color
      if (currentCell !== undefined && !rightOff) currentCell.isHighlighted = true
      if (isOccupied(currentCell)) rightOff = true
    }

    if (board[y][x - i] !== undefined) {
      let currentCell = board[y][x - i]

      if (isOccupied(currentCell) && !leftOff) leftOff = figure.color === currentCell.color
      if (currentCell !== undefined && !leftOff) currentCell.isHighlighted = true
      if (isOccupied(currentCell)) leftOff = true
    }
  }
  return board;
}

export function highlightVertsAndHorizontals({
  boardParam, rowIndexOnBoard, cellIndexInRow
}: HighlightProps) {

  let board = highlightDiagonals({ boardParam, cellIndexInRow, rowIndexOnBoard })
  board = highlightStraights({ boardParam, cellIndexInRow, rowIndexOnBoard })
  return board
}