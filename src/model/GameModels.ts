export type Game = {
    table: Cell[][];
    currentPlayer: Player | null;
    isGameOver: boolean;
    winner?: Player;
}

export enum Cell {
    EMPTY = "",
    X = "X",
    ZERO = "0"
}

export type Player = {
    symbol: Cell.X | Cell.ZERO;
    isComputer: boolean;
}