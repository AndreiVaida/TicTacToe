import type { Game, Position } from "../model/GameModels";
import { Observable } from "rxjs";

export interface TicTacToeService {
    /**
     * Creates a new game instance. If a game is provided, it uses its settings (e.g. player configurations).
     * The new game instance is emitted to subscribers by {@link gameUpdates}.
     * @param game - the previous game (if any, to copy settings from)
     */
    startNewGame(game?: Game): void;

    /**
     * Makes a new move at the specified position in the current game.
     * The updated game instance is emitted to subscribers by {@link gameUpdates}.
     * 
     * The game state stored in the service is updated with the new move.
     * If a game is provided, the game from the service state is updated according to the received game.
     * Game settings = make a player computer/human or change computer difficulty.
     * 
     * @param position - the position where to make the move
     * @param game - the previous game, if any, to copy its settings (e.g. player configurations)
     */
    doNewMove(position: Position, game?: Game): void;

    /**
     * The observable that emits updates to the game state whenever it changes.
     * This is the latest game state after any move or game reset.
     */
    gameUpdates: Observable<Game>;
}