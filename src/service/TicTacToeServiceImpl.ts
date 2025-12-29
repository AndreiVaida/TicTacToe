import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { Cell, type Game, type Player, type Position } from "../model/GameModels";
import { LogUtils } from "../utils/LogUtils";
import { ComputerService } from "./ComputerService";
import { TableService } from "./TableService";
import type { TicTacToeService } from "./TicTacToeService";
import type { Observable } from "rxjs/internal/Observable";
import { timer } from "rxjs/internal/observable/timer";

/**
 * Service handling general playing logic.
 */
export class TicTacToeServiceImpl implements TicTacToeService {
    private static readonly COMPUTER_NEXTMOVE_DELAY = 500;
    private tableService: TableService;
    private computerService: ComputerService;
    private gameSubject: BehaviorSubject<Game>;
    public gameUpdates: Observable<Game>;

    constructor(tableService: TableService, computerService: ComputerService) {
        this.tableService = tableService;
        this.computerService = computerService;
        this.gameSubject = new BehaviorSubject<Game>(this.getNewGame());
        this.gameUpdates = this.gameSubject.asObservable();
    }

    public startNewGame(game?: Game) {
        console.info("▶️ New game");
        this.gameSubject.next(this.getNewGame(game));
    };

    public doNewMove(position: Position, gameFromUI?: Game) {
        let game = this.gameSubject.value;
        if (gameFromUI) {
            game = {
                ...game,
                playerX: gameFromUI.playerX,
                player0: gameFromUI.player0
            }
        }

        const nextGame = this.getNextGame(game, position);
        this.gameSubject.next(nextGame);

        if (!nextGame.isGameOver && nextGame.currentPlayer!.isComputer) {
            timer(TicTacToeServiceImpl.COMPUTER_NEXTMOVE_DELAY).subscribe(() => {
                const computerMove = this.computerService.nextComputerMove(nextGame.table, nextGame.currentPlayer!);
                this.doNewMove(computerMove, nextGame);
            });
        }
    };

    private getNewGame(game?: Game): Game {
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
    }
   
    private getNextGame(game: Game, position: Position): Game {
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
        return newGame;
    }

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