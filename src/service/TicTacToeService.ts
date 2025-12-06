import { Cell, type Game, type Player, type Position } from "../model/GameModels";
import { LogUtils } from "../utils/LogUtils";
import { ComputerService } from "./ComputerService";
import { TableService } from "./TableService";

/**
 * Service handling general playing logic.
 */
export class TicTacToeService {
    private tableService: TableService;
    private computerService: ComputerService;

    constructor(tableService: TableService, computerService: ComputerService) {
        this.tableService = tableService;
        this.computerService = computerService;
    }

    public getInitialGame = (game?: Game): Game => {
        console.info("▶️ New game");

        const table = this.tableService.createEmptyTable();
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

    public doNextMove = (game: Game, position: Position): Game => {
        console.info(LogUtils.getPlayerMoveInfo(game.currentPlayer, position));
        const newTable = this.tableService.copyTable(game.table);
        newTable[position.row][position.column] = game.currentPlayer!.symbol;

        const winnerSymbol = this.tableService.getGameWinner(newTable);
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
            const computerMove = this.computerService.nextComputerMove(newTable, nextPlayer!);
            return this.doNextMove(newGame, computerMove);
        }
        return newGame;
    };
   
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
}