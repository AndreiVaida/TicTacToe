export type Game = {
    table: Cell[][];
    currentPlayer: Cell;
    winner?: Cell;
}

export enum Cell {
    EMPTY = "",
    X = "X",
    ZERO = "0"
}