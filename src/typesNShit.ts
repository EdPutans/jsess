// yeeted from https://stackoverflow.com/a/60762482
type Grow<T, A extends Array<T>> = ((x: T, ...xs: A) => void) extends ((...a: infer X) => void) ? X : never;
type GrowToSize<T, A extends Array<T>, N extends number> = { 0: A, 1: GrowToSize<T, Grow<T, A>, N> }[A['length'] extends N ? 0 : 1];

// force an array to only have a certain size
export type FixedLengthArray<T, N extends number> = GrowToSize<T, [], N>;

export type Cell = { isHighlighted: boolean; }

// TODO: translate to ENG later
//  type NameEng = "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";
export type Name = "peshka" | "tura" | "konj" | "oficer" | "dama" | "korolj";
export type Icon = '♜' | '♞' | '♝' | '♛' | '♚' | '♟';
export type Color = 'black' | 'white';
export type Figure = Cell & { icon: Icon; name: Name; color: Color };

export type Position = Figure | Cell;
export type Row = FixedLengthArray<Position, 8>
export type Board = FixedLengthArray<Row, 8>;

