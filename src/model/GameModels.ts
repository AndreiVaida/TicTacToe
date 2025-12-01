export type Game = {
    table: Cell[][];
    playerX: Player;
    player0: Player;
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
    computerDifficulty?: Difficulty;
}

export type Position = {
    row: number;
    column: number;
}

export enum Difficulty {
    NORMAL = "Normal",
    EXPERT = "Expert"
}