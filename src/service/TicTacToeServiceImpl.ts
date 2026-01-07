import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { Cell, type Game, type GameSettings, type Player, type Position } from "../model/GameModels";
import { LogUtils } from "../utils/LogUtils";
import { ComputerService } from "./ComputerService";
import { TableService } from "./TableService";
import type { TicTacToeService } from "./TicTacToeService";
import type { Observable } from "rxjs/internal/Observable";
import { timer } from "rxjs/internal/observable/timer";

const deleteMovePrefix = "\x1B[31m🗑️";

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
        const newGame = this.getNewGame(game);
        console.info(`▶️ New game #${newGame.id}`);
        this.gameSubject.next(newGame);
    };

    public doNewMove(position: Position, gameFromUI?: Game) {
        let game = this.gameSubject.value;
        if (gameFromUI) {
            game = {
                ...game,
                playerX: gameFromUI.playerX,
                player0: gameFromUI.player0,
                settings: gameFromUI.settings
            }
        }

        const nextGame = this.getNextGame(game, position);
        this.gameSubject.next(nextGame);

        if (this.isComputerTurn(nextGame)) {
            this.delayAction(TicTacToeServiceImpl.COMPUTER_NEXTMOVE_DELAY, nextGame.id, this.doComputerMove);
        }

        if (nextGame.settings?.deleteMovesAfterSeconds) {
            this.delayAction(nextGame.settings.deleteMovesAfterSeconds * 1000, nextGame.id, this.getDeleteFunctionFor(position));
        }
    };

    private getNewGame(game?: Game): Game {
        const id = (game?.id ?? 0) + 1;
        const table = this.tableService.createEmptyTable();
        const playerX: Player = game?.playerX ?? { symbol: Cell.X, isComputer: false };
        const player0: Player = game?.player0 ?? { symbol: Cell.ZERO, isComputer: false };
        const settings: GameSettings | undefined = game?.settings ?? undefined;
        return {
            id,
            table,
            playerX,
            player0,
            currentPlayer: playerX,
            isGameOver: false,
            settings
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

    private delayAction = (delayMs: number, gameId: number, action: (game: Game) => void) =>
        timer(delayMs).subscribe(() => {
            const game = this.gameSubject.value;

            if (game.isGameOver || game.id !== gameId) return;
            action(game);
        });


    private isComputerTurn = (game: Game): boolean => !game.isGameOver && game.currentPlayer!.isComputer;

    private doComputerMove = (game: Game) => {
        const computerMove = this.computerService.nextComputerMove(game.table, game.currentPlayer!);
        this.doNewMove(computerMove, game);
    }

    private getDeleteFunctionFor = (position: Position): (game: Game) => void => {
        return (game: Game) => {
            const newTable = this.tableService.copyTable(game.table);
            const deletedCell = newTable[position.row][position.column];
            newTable[position.row][position.column] = Cell.EMPTY;
            const newGame = {
                ...game,
                table: newTable,
            };
            console.info(`${deleteMovePrefix} Delete move ${deletedCell} [${position.row} ${position.column}]`);
            this.gameSubject.next(newGame);
        };
    }
}