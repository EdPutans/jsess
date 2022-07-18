import { Board, Color, Figure, Position } from "./typesNShit";

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

export function isOccupied(cell: Position): cell is Figure {
  if (!cell) return false;

  return "color" in cell;
}

export function highlightDiagonals({
  boardParam, rowIndexOnBoard, cellIndexInRow, limit
}: HighlightDirectionProps): Board {
  const figure = boardParam[rowIndexOnBoard][cellIndexInRow] as Figure;


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
  // let board = clearBoardHighlights({ boardParam })

  let board = [...boardParam] as Board;
  highlightDiagonals({ boardParam: board, cellIndexInRow, rowIndexOnBoard, limit: 7 })
  return board;
}

export function highlightTura({ boardParam, rowIndexOnBoard, cellIndexInRow }: HighlightProps): Board {
  // let board = clearBoardHighlights({ boardParam })

  let board = [...boardParam] as Board;
  highlightStraights({ boardParam: board, cellIndexInRow, rowIndexOnBoard, limit: 7 })
  return board;
}

export function highlightDama({
  boardParam, rowIndexOnBoard, cellIndexInRow
}: HighlightProps) {
  let board = [...boardParam] as Board;
  // clearBoardHighlights({ boardParam })

  highlightDiagonals({ boardParam: board, cellIndexInRow, rowIndexOnBoard, limit: 7 })
  highlightStraights({ boardParam: board, cellIndexInRow, rowIndexOnBoard, limit: 7 })
  return board
}

export function highlightKorolj({
  boardParam, rowIndexOnBoard, cellIndexInRow
}: HighlightProps): Board {
  const figure = boardParam[rowIndexOnBoard][cellIndexInRow];
  if (!isOccupied(figure)) return boardParam;

  // let board = clearBoardHighlights({ boardParam })
  let board = [...boardParam] as Board;

  highlightStraights({ boardParam: board, cellIndexInRow, rowIndexOnBoard, limit: 1 })
  highlightDiagonals({ boardParam: board, cellIndexInRow, rowIndexOnBoard, limit: 1 })

  const { color } = figure;
  const enemyColor: Color = color === 'white' ? 'black' : 'white'

  let enemyMovesBoard = getAllPossibleMovesForColor(board, enemyColor);

  const finalBoard = board.map((row, rowInd) => row.map((cell, cellInd) => {
    if (enemyMovesBoard[rowInd][cellInd].isHighlighted) return { ...cell, isHighlighted: false };

    return cell;
  })) as Board;

  return finalBoard;
}

export function highlightKonj({
  boardParam, rowIndexOnBoard, cellIndexInRow
}: HighlightProps): Board {
  // let board = clearBoardHighlights({ boardParam })

  let board = [...boardParam] as Board;

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
      if (cell) cell.isHighlighted = (!isOccupied(cell) || figure.color !== cell.color);

    }
  }


  return board;
}

export function highlightPeshka({
  boardParam, rowIndexOnBoard, cellIndexInRow
}: HighlightProps): Board {
  // let board = clearBoardHighlights({ boardParam })
  let board = [...boardParam] as Board;

  const x = Number(cellIndexInRow);
  const y = Number(rowIndexOnBoard);
  const figure = board[y][x] as Figure;

  // at the moment, only support white side at the bottom and black at the top.
  const shouldMoveUp = figure.color === 'white';

  if (shouldMoveUp) {
    const cellUp = board[y - 1][x]
    cellUp.isHighlighted = !isOccupied(cellUp);
    // if numberOfMoves = 0 => 2 lights fwd
    if (figure.numberOfMoves === 0) {
      const twoCellsUp = board[y - 2][x]
      twoCellsUp.isHighlighted = cellUp.isHighlighted && !isOccupied(twoCellsUp);
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
    cellUp.isHighlighted = !isOccupied(cellUp);
    // if numberOfMoves = 0 => 2 lights fwd
    if (figure.numberOfMoves === 0) {
      const twoCellsUp = board[y + 2][x]
      twoCellsUp.isHighlighted = cellUp.isHighlighted && !isOccupied(twoCellsUp);
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


export function highlightFigureMovesOnBoard(board: Board, rowIndexOnBoard: number, cellIndexInRow: number): Board {
  let figure: Position = board[rowIndexOnBoard][cellIndexInRow];
  if (!isOccupied(figure)) return board;

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
  return _board;
}

export function getAllPossibleMovesForColor(boardParam: Board, color: Color) {
  let board: Board = [...boardParam];

  for (let rowInd in board) {
    const row = board[rowInd];
    for (let cellInd in row) {
      const cell = row[cellInd];
      if (isOccupied(cell) && cell.color === color)
        board = highlightFigureMovesOnBoard(board, Number(rowInd), Number(cellInd))
    }
  }

  console.log(board.map(row => row.map(cell => cell.isHighlighted ? 'X' : 'O')))

  return board
}


type Coords = { x: number, y: number }
type Result = { white: Coords | null, black: Coords | null };
export function findKingsIndexes(board: Board): Result {
  const result: Result = {
    white: null,
    black: null,
  }

  for (let rowInd in board) {
    const row = board[rowInd];
    for (let cellInd in row) {
      const cell = row[cellInd]
      if (isOccupied(cell) && cell.name === 'korolj') {
        result[cell.color] = { y: Number(rowInd), x: Number(cellInd) }
      }
    }
  }
  return result;
}

// add handling for special moves:
// - rokirovka
// - transform peshka ->
// - check where king can go during a check!
// - check if game is over
// - can't nom nom king 🤷🏻‍♂️