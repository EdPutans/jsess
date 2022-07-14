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

  boardParam[rowIndexOnBoard][cellIndexInRow].isHighlighted = true;

  const x = Number(cellIndexInRow);
  const y = Number(rowIndexOnBoard);

  let upLeftOff = false
  let upRightOff = false
  let downLeftOff = false
  let downRightOff = false

  for (let i = 1; i <= 7; i++) {
    if (boardParam[y + i] !== undefined) {

      let currentCell = boardParam[y + i][x + i]
      if (isOccupied(currentCell) && !downRightOff) downRightOff = figure.color === currentCell.color;
      if (currentCell !== undefined && !downRightOff) currentCell.isHighlighted = true
      if (isOccupied(currentCell)) downRightOff = true

      currentCell = boardParam[y + i][x - i]
      if (isOccupied(currentCell) && !downLeftOff) downLeftOff = figure.color === currentCell.color
      if (currentCell !== undefined && !downLeftOff) currentCell.isHighlighted = true
      if (isOccupied(currentCell)) downLeftOff = true
    }

    if (boardParam[y - i] !== undefined) {
      let currentCell = boardParam[y - i][x + i];

      if (isOccupied(currentCell) && !upRightOff) upRightOff = figure.color === currentCell.color
      if (currentCell !== undefined && !upRightOff) currentCell.isHighlighted = true
      if (isOccupied(currentCell)) upRightOff = true

      currentCell = boardParam[y - i][x - i];
      if (isOccupied(currentCell) && !upLeftOff) upLeftOff = figure.color === currentCell.color
      if (currentCell && !upLeftOff) currentCell.isHighlighted = true
      if (isOccupied(currentCell)) upLeftOff = true
    }
  }

  return boardParam;
}


export function highlightStraights({ boardParam, rowIndexOnBoard, cellIndexInRow }: HighlightProps): Board {
  const figure = boardParam[rowIndexOnBoard][cellIndexInRow] as Figure;

  boardParam[rowIndexOnBoard][cellIndexInRow].isHighlighted = true;

  const x = Number(cellIndexInRow);
  const y = Number(rowIndexOnBoard);

  let leftOff = false
  let rightOff = false
  let downOff = false
  let upOff = false

  for (let i = 1; i < 7; i++) {
    if (boardParam[y + i] !== undefined) {
      let currentCell = boardParam[y + i][x];

      if (isOccupied(currentCell) && !downOff) downOff = figure.color === currentCell.color
      if (currentCell !== undefined && !downOff) currentCell.isHighlighted = true
      if (isOccupied(currentCell)) downOff = true
    }

    if (boardParam[y - i] !== undefined) {
      let currentCell = boardParam[y - i][x];

      if (isOccupied(currentCell) && !upOff) upOff = figure.color === currentCell.color
      if (currentCell !== undefined && !upOff) currentCell.isHighlighted = true
      if (isOccupied(currentCell)) upOff = true
    }
    if (boardParam[y][x + i] !== undefined) {
      let currentCell = boardParam[y][x + i]

      if (isOccupied(currentCell) && !rightOff) rightOff = figure.color === currentCell.color
      if (currentCell !== undefined && !rightOff) currentCell.isHighlighted = true
      if (isOccupied(currentCell)) rightOff = true
    }

    if (boardParam[y][x - i] !== undefined) {
      let currentCell = boardParam[y][x - i]

      if (isOccupied(currentCell) && !leftOff) leftOff = figure.color === currentCell.color
      if (currentCell !== undefined && !leftOff) currentCell.isHighlighted = true
      if (isOccupied(currentCell)) leftOff = true
    }
  }
  return boardParam;
}

export function highlightOficer({ boardParam, rowIndexOnBoard, cellIndexInRow }: HighlightProps): Board {
  let board = clearBoardHighlights({ boardParam })

  highlightDiagonals({ boardParam: board, cellIndexInRow, rowIndexOnBoard })
  return board;
}

export function highlightTura({ boardParam, rowIndexOnBoard, cellIndexInRow }: HighlightProps): Board {
  let board = clearBoardHighlights({ boardParam })

  highlightStraights({ boardParam: board, cellIndexInRow, rowIndexOnBoard })
  return board;
}
export function highlightDama({
  boardParam, rowIndexOnBoard, cellIndexInRow
}: HighlightProps) {
  let board = clearBoardHighlights({ boardParam })

  highlightDiagonals({ boardParam: board, cellIndexInRow, rowIndexOnBoard })
  highlightStraights({ boardParam: board, cellIndexInRow, rowIndexOnBoard })
  return board
}