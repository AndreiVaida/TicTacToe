export type Game = {
    table: Cell[][];
    currentPlayer: Cell;
}

export enum Cell {
    EMPTY = "",
    X = "X",
    ZERO = "0"
}