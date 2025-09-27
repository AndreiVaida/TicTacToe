import { Cell, type Game } from "../model/GameModels";

export class TicTacToeService {
    public getInitialGame = (): Game => {
        const table = this.createEmptyTable();
        return {
            table,
            currentPlayer: Cell.X
        };
    };

    public isCellPlayable = (i: number, j: number, game: Game): boolean => game.table[i][j] === Cell.EMPTY && !game.winner;

    public nextMove = (game: Game, row: number, column: number): Game => {
        const newTable = this.copyTable(game.table);
        newTable[row][column] = game.currentPlayer;

        const winner = this.getGameWinner(newTable);
        const nextPlayer = winner === Cell.EMPTY
            ? Cell.EMPTY
            : game.currentPlayer === Cell.X ? Cell.ZERO : Cell.X;
        
        return {
            table: newTable,
            currentPlayer: nextPlayer,
            winner: winner ?? undefined
        };
    };

    private createEmptyTable = (): Cell[][] => {
        const table: Cell[][] = [];

        for (let i = 0; i < 3; i++) {
            const line: Cell[] = [];
            for (let j = 0; j < 3; j++) {
                line.push(Cell.EMPTY);
            }
            table.push(line);
        }
        return table;
    };

    private copyTable = (table: Cell[][]): Cell[][] => table.map(line => [...line]);
    
    private getGameWinner = (table: Cell[][]): Cell | null => {
        const winner = this.getHorizontalWinner(table)
            ?? this.getVerticalWinner(table)
            ?? this.getDiagonalWinner(table);
        
        if (winner) return winner;

        const isDraw = table.every(line => line.every(cell => cell !== Cell.EMPTY));
        return isDraw ? Cell.EMPTY : null;
    };

    private getHorizontalWinner = (table: Cell[][]): Cell | null => {
        for(const line of table) {
            const winner = this.getLineWinner(line);
            if (winner) return winner;
        }
        return null;
    };

    private getVerticalWinner = (table: Cell[][]): Cell | null => {
        for (let j = 0; j < 3; j++) {
            const column = [table[0][j], table[1][j], table[2][j]];
            const winner = this.getLineWinner(column);
            if (winner) return winner;
        }
        return null;
    };

    private getDiagonalWinner = (table: Cell[][]): Cell | null =>
        this.getLineWinner([table[0][0], table[1][1], table[2][2]])
        ?? this.getLineWinner([table[0][2], table[1][1], table[2][0]]);

    private getLineWinner = (line: Cell[]): Cell | null => {
        if (line[0] !== Cell.EMPTY && this.allEqual(line))
            return line[0];

        return null;
    };

    private allEqual = (line: Cell[]): boolean => line.every(cell => cell === line[0]);
}