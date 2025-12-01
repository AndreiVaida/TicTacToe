import { Cell, Difficulty, type Game, type Player, type Position } from "../model/GameModels";

export class TicTacToeService {
    public getInitialGame = (game?: Game): Game => {
        const table = this.createEmptyTable();
        const playerX: Player = game?.playerX ?? { symbol: Cell.X, isComputer: false };
        const player0: Player = game?.player0 ?? { symbol: Cell.ZERO, isComputer: false };
        return {
            table,
            playerX,
            player0,
            currentPlayer: playerX,
            isGameOver: false,
        };
    };

    public isCellPlayable = (i: number, j: number, game: Game): boolean => game.table[i][j] === Cell.EMPTY && !game.winner;

    public nextMove = (game: Game, position: Position): Game => {
        const newTable = this.copyTable(game.table);
        newTable[position.row][position.column] = game.currentPlayer!.symbol;

        const winnerSymbol = this.getGameWinner(newTable);
        const nextPlayer = this.getNextPlayer(winnerSymbol, game);
        const winner = this.createWinnerPlayer(winnerSymbol, game);
        const isGameOver = winnerSymbol !== null;

        const newGame = {
            ...game,
            table: newTable,
            currentPlayer: nextPlayer,
            winner,
            isGameOver
        };

        if (!isGameOver && nextPlayer!.isComputer) {
            const computerMove = this.nextComputerMove(newTable, nextPlayer!);
            return this.nextMove(newGame, computerMove);
        }
        return newGame;
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
    
    /**
     * @param table - the current game table
     * @returns The winner Cell (X or 0), Cell.EMPTY in case of a draw, or null if the game is still ongoing
     */
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

    /**
     * @param winnerSymbol The symbol of the winner (X, 0, or EMPTY in case of a draw), or null if the game is still ongoing
     * @param game The current game state
     * @returns The next player, or null if the game is over (win or draw)
     */
    private getNextPlayer = (winnerSymbol: Cell | null, game: Game): Player | null => {
        if (winnerSymbol !== null) return null;
        return game.currentPlayer!.symbol === Cell.X ? game.player0 : game.playerX;
    };

    private createWinnerPlayer = (winnerSymbol: Cell | null, game: Game): Player | undefined => {
        if (winnerSymbol === null || winnerSymbol === Cell.EMPTY) return undefined;
        return winnerSymbol == Cell.X ? game.playerX : game.player0;
    };

    private nextComputerMove = (table: Cell[][], player: Player): Position =>
        this.findWinningMove(table, player.symbol)
        ?? this.findDefensiveMove(table, player.symbol)
        ?? this.getMoveForComputerDifficulty(table, player);

    /**
     * Searches for a move that wins the game (1 move, the next move).
     * @param table The current game
     * @param player The symbol of the player that wants to win (X or 0)
     * @returns the coordinates of the winning move, or null if no winning move is found
     */
    private findWinningMove = (table: Cell[][], player: Cell): Position | null => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (table[i][j] === Cell.EMPTY) {
                    const nextTable = this.copyTable(table);
                    nextTable[i][j] = player;
                    if (this.getGameWinner(nextTable) === player)
                        return {row: i, column: j};
                }
            }
        }
        return null;
    };

    /**
     * Blocks the opponent from winning in their next move, if the opponent can win in their next move.
     * @param table The current game
     * @param symbol The symbol of the player that wants to block the opponent (X or 0)
     * @returns The coordinates of the blocking move, or null if no blocking move is found (i.e. the opponent cannot win in their next move)
     */
    private findDefensiveMove = (table: Cell[][], player: Cell): Position | null => this.findWinningMove(table, player === Cell.X ? Cell.ZERO : Cell.X);

    /**
     * @returns A random empty position on the table
     */
    private findRandomMove = (table: Cell[][]): Position => {
        const emptyPositions: Position[] = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (table[i][j] === Cell.EMPTY) {
                    emptyPositions.push({row: i, column: j});
                }
            }
        }
        const randomIndex = Math.floor(Math.random() * emptyPositions.length);
        return emptyPositions[randomIndex];
    };

    private getMoveForComputerDifficulty = (table: Cell[][], player: Player): Position =>
        player.computerDifficulty === Difficulty.NORMAL
            ? this.findRandomMove(table)
            : (this.findExpertWinMove(table, player.symbol)
                ?? this.findExpertDefensiveMove(table, player.symbol)
                ?? this.findRandomMove(table));

    /**
     * Searches for a move that will lead to 2 possible win moves in the next move. The opponent will be able to block only 1 of the 2 future moves.
     * The table must have at least 2 moves of the player.
     * @param table The current game, where the player already has at ≥2 moves
     * @param player The symbol of the player that wants to do the expert move (X or 0)
     * @returns the coordinates of the expert move, or null if no expert move is found
     */
    private findExpertWinMove = (table: Cell[][], player: Cell): Position | null => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (table[i][j] === Cell.EMPTY) {
                    const nextTable = this.copyTable(table);
                    nextTable[i][j] = player;
                    if (this.getNrOfWinMoves(nextTable, player) >= 2)
                        return {row: i, column: j};
                }
            }
        }
        return null;
    };

    /**
     * If the opponent can do an expert winning move, block it.
     * But if the opponent can do 2 expert winning moves (i.e. still has a wining move after blocking it) then force them to play elsewhere by aligning 2 symbols.
     * @param table The current game
     * @param player The symbol of the player that wants to do the expert move (X or 0)
     * @returns the coordinates of the expert move, or null if no expert move is found
     */
    private findExpertDefensiveMove = (table: Cell[][], player: Cell): Position | null => {
        const opponent = player === Cell.X ? Cell.ZERO : Cell.X;
        const defensiveExpertMove = this.findExpertWinMove(table, opponent);
        
        if (defensiveExpertMove) {
            const nextTable = this.copyTable(table);
            nextTable[defensiveExpertMove.row][defensiveExpertMove.column] = player;

            const opponentExpertWinMove = this.findExpertWinMove(nextTable, opponent);
            if (opponentExpertWinMove) {
                // don't allow the opponent to do the expert move - by forcing them to play elsewhere
                return this.findMoveToAlign2Inline(nextTable, player);
            }
            return defensiveExpertMove;
        };
        return null;
    };

    /**
     * Counts the number of winning moves the player has in the current table.
     * I.e. on how many lines the player has 2 symbols and an empty cell.
     * @param table The current game
     * @param player The symbol of the player that wants to do the expert move (X or 0)
     */
    private getNrOfWinMoves(table: Cell[][], player: Cell): number {
        let nrOfWiningMoves = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (table[i][j] === Cell.EMPTY) {
                    const nextTable = this.copyTable(table);
                    nextTable[i][j] = player;
                    if (this.getGameWinner(nextTable) === player)
                        nrOfWiningMoves++;
                }
            }
        }
        return nrOfWiningMoves;
    }

    private findMoveToAlign2Inline(table: Cell[][], player: Cell): Position | null {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (table[i][j] === Cell.EMPTY) {
                    const nextTable = this.copyTable(table);
                    nextTable[i][j] = player;
                    if (this.getNrOfWinMoves(nextTable, player) >= 1)
                        return {row: i, column: j};
                }
            }
        }
        return null;
    }
}