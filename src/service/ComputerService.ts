import { Cell, Difficulty, type Player, type Position } from "../model/GameModels";
import type { TableService } from "./TableService";

/**
 * Service handling the computer player's moves.„
 */
export class ComputerService {
    private tableService: TableService;

    constructor(tableService: TableService) {
        this.tableService = tableService;
    }

    public nextComputerMove = (table: Cell[][], player: Player): Position => {
        const winingMove = this.findWinningMove(table, player.symbol);
        if (winingMove) {
            console.info(`> 💻 ${player.symbol} plays wining move [${winingMove.row} ${winingMove.column}]`);
            return winingMove;
        }

        const defensiveMove = this.findDefensiveMove(table, player.symbol);
        if (defensiveMove) {
            console.info(`> 💻 ${player.symbol} plays defensive move [${defensiveMove.row} ${defensiveMove.column}]`);
            return defensiveMove;
        }

        return this.getMoveForComputerDifficulty(table, player);
    };

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
                    const nextTable = this.tableService.copyTable(table);
                    nextTable[i][j] = player;
                    if (this.tableService.getGameWinner(nextTable) === player)
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
        const randomMove = emptyPositions[randomIndex];
        console.info(`> 💻 random move [${randomMove.row} ${randomMove.column}]`);
        return randomMove;
    };

    private getMoveForComputerDifficulty = (table: Cell[][], player: Player): Position => {
        if (player.computerDifficulty !== Difficulty.EXPERT)
            return this.findRandomMove(table);

        const expertWinMove = this.findExpertWinMove(table, player.symbol);
        if (expertWinMove) {
            console.info(`> 💻 ${player.symbol} plays expert win move [${expertWinMove.row} ${expertWinMove.column}]`);
            return expertWinMove;
        }

        const defensiveExpertMove = this.findExpertDefensiveMove(table, player.symbol);
        if (defensiveExpertMove) {
            console.info(`> 💻 ${player.symbol} plays expert defensive move [${defensiveExpertMove.row} ${defensiveExpertMove.column}]`);
            return defensiveExpertMove;
        }

        return this.findRandomMove(table);
    };

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
                    const nextTable = this.tableService.copyTable(table);
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
     * But be aware where we force them to play elsewhere, as they might get an expert winning move.
     * @param table The current game
     * @param player The symbol of the player that wants to do the expert move (X or 0)
     * @returns the coordinates of the expert move, or null if no expert move is found
     */
    private findExpertDefensiveMove = (table: Cell[][], player: Cell): Position | null => {
        const opponent = player === Cell.X ? Cell.ZERO : Cell.X;
        const defensiveExpertMove = this.findExpertWinMove(table, opponent);
        
        if (defensiveExpertMove) {
            const nextTable = this.tableService.copyTable(table);
            nextTable[defensiveExpertMove.row][defensiveExpertMove.column] = player;

            const opponentExpertWinMove = this.findExpertWinMove(nextTable, opponent);
            if (opponentExpertWinMove) {
                // don't allow the opponent to do the expert move - by forcing them to play elsewhere
                return this.findExpertMoveToAlign2Inline(table, player);
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
                    const nextTable = this.tableService.copyTable(table);
                    nextTable[i][j] = player;
                    if (this.tableService.getGameWinner(nextTable) === player)
                        nrOfWiningMoves++;
                }
            }
        }
        return nrOfWiningMoves;
    }

    private findExpertMoveToAlign2Inline(table: Cell[][], player: Cell): Position | null {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (table[i][j] === Cell.EMPTY) {
                    const nextTable = this.tableService.copyTable(table);
                    nextTable[i][j] = player;
                    const move = {row: i, column: j};

                    if (this.getNrOfWinMoves(nextTable, player) >= 1) {
                        // we have 2 symbols in line, so opponent is forced to block
                        const opponent = player === Cell.X ? Cell.ZERO : Cell.X;
                        const oppononeBlock = this.findDefensiveMove(nextTable, opponent);
                        if (oppononeBlock === null) return move;

                        const nextTable2 = this.tableService.copyTable(nextTable);
                        nextTable2[oppononeBlock.row][oppononeBlock.column] = opponent;

                        // check if the opponent has an expert win move
                        const opponenthasExpertWinMove = this.getNrOfWinMoves(nextTable2, opponent) >= 2;
                        if (!opponenthasExpertWinMove)
                            return move;
                    }
                }
            }
        }
        return null;
    }
}