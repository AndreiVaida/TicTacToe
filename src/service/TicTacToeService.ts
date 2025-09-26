import { Cell, type Game } from "../model/GameModels";

export class TicTacToeService {
    public getInitialGame = (): Game => {
        const table = this.createEmptyTable();
        return {
            table,
            currentPlayer: Cell.X
        };
    };

    public isCellPlayable = (i: number, j: number, game: Game): boolean =>
        game.table[i][j] === Cell.EMPTY;

    public nextMove = (game: Game, row: number, column: number): Game => {
      const newTable: Cell[][] = [];
      
      for (let i = 0; i < 3; i++) {
        const newLine: Cell[] = [];
        for (let j = 0; j < 3; j++) {
            const cell = row === i && column === j ? game.currentPlayer : game.table[i][j];
            newLine.push(cell);
        }
        newTable.push(newLine);
      }
      const nextPlayer = game.currentPlayer === Cell.X ? Cell.ZERO : Cell.X;
        return {
            table: newTable,
            currentPlayer: nextPlayer
        };
    };

    private createEmptyTable(): Cell[][] {
        const table: Cell[][] = [];
        
        for (let i = 0; i < 3; i++) {
            const line: Cell[] = [];
            for (let j = 0; j < 3; j++) {
                line.push(Cell.EMPTY);
            }
            table.push(line);
        }
        return table;
    }
}