import { Board, Figure, Position } from "./typesNShit";

type HighlightProps = {
  boardParam: Board,
  rowIndexOnBoard: number,
  cellIndexInRow: number,
}

type HighlightDirectionProps = HighlightProps & {
  // NOTE: limit is the max amount of cells to highlight away in one direction from a figure
  // 1 for king, 7 for bishop.
  limit: 1 | 7;
}

export function clearBoardHighlights({
  boardParam
}: { boardParam: Board }): Board {

  const board: Board = [...boardParam].map<Position[]>(row => row.map<Position>((item) => ({ ...item, isHighlighted: false }))) as Board;
  return board;
}

function isOccupied(cell: Position): cell is Figure {
  if (!cell) return false;

  return "color" in cell;
}

export function highlightDiagonals({
  boardParam, rowIndexOnBoard, cellIndexInRow, limit
}: HighlightDirectionProps): Board {
  const figure = boardParam[rowIndexOnBoard][cellIndexInRow] as Figure;

  boardParam[rowIndexOnBoard][cellIndexInRow].isHighlighted = true;

  const x = Number(cellIndexInRow);
  const y = Number(rowIndexOnBoard);

  // when true, no longer iterate in that direction
  type Dir = 'upLeftOff' | 'upRightOff' | 'downLeftOff' | 'downRightOff';
  const dirs: { [K in Dir]: boolean } = {
    upLeftOff: false,
    upRightOff: false,
    downLeftOff: false,
    downRightOff: false,
  }

  for (let i = 1; i <= limit; i++) {

    let combos: [number, number, Dir][] = [
      [i, i, 'downRightOff'],
      [i, -i, 'downLeftOff'],
      [-i, i, 'upRightOff'],
      [-i, -i, 'upLeftOff']
    ]

    for (let [xC, yC, direction] of combos) {
      if (boardParam[y + yC] !== undefined && boardParam[y + yC][x + xC] !== undefined) {
        let currentCell = boardParam[y + yC][x + xC]
        // if same color - can't move. stop right before.
        if (isOccupied(currentCell) && !dirs[direction])
          dirs[direction] = figure.color === currentCell.color;
        // if clear - hihglight
        if (currentCell !== undefined && !dirs[direction])
          currentCell.isHighlighted = true
        // if other color and occupied - can kill and stop here.
        if (isOccupied(currentCell))
          dirs[direction] = true
      }
    }
  }


  return boardParam;
}


// TODO: simplify just like diagonals
export function highlightStraights({
  boardParam, rowIndexOnBoard, cellIndexInRow, limit
}: HighlightDirectionProps): Board {
  const figure = boardParam[rowIndexOnBoard][cellIndexInRow] as Figure;

  boardParam[rowIndexOnBoard][cellIndexInRow].isHighlighted = true;

  const x = Number(cellIndexInRow);
  const y = Number(rowIndexOnBoard);

  let leftOff = false
  let rightOff = false
  let downOff = false
  let upOff = false

  for (let i = 1; i <= limit; i++) {
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

  highlightDiagonals({ boardParam: board, cellIndexInRow, rowIndexOnBoard, limit: 7 })
  return board;
}

export function highlightTura({ boardParam, rowIndexOnBoard, cellIndexInRow }: HighlightProps): Board {
  let board = clearBoardHighlights({ boardParam })

  highlightStraights({ boardParam: board, cellIndexInRow, rowIndexOnBoard, limit: 7 })
  return board;
}

export function highlightDama({
  boardParam, rowIndexOnBoard, cellIndexInRow
}: HighlightProps) {
  let board = clearBoardHighlights({ boardParam })

  highlightDiagonals({ boardParam: board, cellIndexInRow, rowIndexOnBoard, limit: 7 })
  highlightStraights({ boardParam: board, cellIndexInRow, rowIndexOnBoard, limit: 7 })
  return board
}

export function highlightKorolj({
  boardParam, rowIndexOnBoard, cellIndexInRow
}: HighlightProps): Board {
  let board = clearBoardHighlights({ boardParam })

  highlightStraights({ boardParam: board, cellIndexInRow, rowIndexOnBoard, limit: 1 })
  highlightDiagonals({ boardParam: board, cellIndexInRow, rowIndexOnBoard, limit: 1 })

  return board;
}

export function highlightKonj({
  boardParam, rowIndexOnBoard, cellIndexInRow
}: HighlightProps): Board {
  let board = clearBoardHighlights({ boardParam })

  const x = Number(cellIndexInRow);
  const y = Number(rowIndexOnBoard);
  const figure = board[y][x] as Figure;

  figure.isHighlighted = true;

  const locationsOfXandY = [
    [2, 1],
    [2, -1],
    [-2, 1],
    [-2, -1],
    [1, 2],
    [1, -2],
    [-1, 2],
    [-1, -2]
  ]

  for (let [xC, yC] of locationsOfXandY) {
    if (board[y + yC] !== undefined && board[y + yC][x + xC] !== undefined) {
      let cell = board[y + yC][x + xC]
      if (cell) cell.isHighlighted = (!('color' in cell) || figure.color !== cell.color);

    }
  }


  return board;
}

export function highlightPeshka({
  boardParam, rowIndexOnBoard, cellIndexInRow
}: HighlightProps): Board {
  let board = clearBoardHighlights({ boardParam })

  const x = Number(cellIndexInRow);
  const y = Number(rowIndexOnBoard);
  const figure = board[y][x] as Figure;

  figure.isHighlighted = true;

  // at the moment, only support white side at the bottom and black at the top.
  const shouldMoveUp = figure.color === 'white';

  if (shouldMoveUp) {
    const cellUp = board[y - 1][x]
    cellUp.isHighlighted = !('color' in cellUp);
    // if numberOfMoves = 0 => 2 lights fwd
    if (figure.numberOfMoves === 0) {
      const twoCellsUp = board[y - 2][x]
      twoCellsUp.isHighlighted = cellUp.isHighlighted && !('color' in twoCellsUp);
    }
    if (board[y - 1] && board[y - 1][x + 1]) {
      const potentialEnemy1 = board[y - 1][x + 1]
      potentialEnemy1.isHighlighted = isOccupied(potentialEnemy1) && potentialEnemy1.color === 'black'
    }
    if (board[y - 1] && board[y - 1][x - 1]) {
      const potentialEnemy2 = board[y - 1][x - 1]
      potentialEnemy2.isHighlighted = isOccupied(potentialEnemy2) && potentialEnemy2.color === 'black'
    }
  } else {
    const cellUp = board[y + 1][x]
    cellUp.isHighlighted = !('color' in cellUp);
    // if numberOfMoves = 0 => 2 lights fwd
    if (figure.numberOfMoves === 0) {
      const twoCellsUp = board[y + 2][x]
      twoCellsUp.isHighlighted = cellUp.isHighlighted && !('color' in twoCellsUp);
    }
    if (board[y + 1] && board[y + 1][x + 1]) {
      const potentialEnemy1 = board[y + 1][x + 1]
      potentialEnemy1.isHighlighted = isOccupied(potentialEnemy1) && potentialEnemy1.color === 'black'
    }
    if (board[y + 1] && board[y + 1][x - 1]) {
      const potentialEnemy2 = board[y + 1][x - 1]
      potentialEnemy2.isHighlighted = isOccupied(potentialEnemy2) && potentialEnemy2.color === 'black'
    }
  }

  // if numberOfMoves = 0 => 2 lights fwd
  // if nubmerOfMoves > 0 => 1 light fwd
  // if [y+1][x+1] or [y+1][x-1] light
  return board
};


// add handling for special moves:
// - rokirovka
// - transform peshka ->
// - checkmate
// - can't nom nom king 🤷🏻‍♂️