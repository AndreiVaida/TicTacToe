import type { Game } from "../model/GameModels";
import type { TicTacToeService } from "../service/TicTacToeService";
import "./GameMenu.css";
import { GameSettingsMenu } from "./GameSettingsMenu";
import { PlayerToggle } from "./Toggle/PlayerToggle";
import { ThemeToggle } from "./Toggle/ThemeToggle";

export type GameMenuProps = {
    gameService: TicTacToeService;
    game: Game | undefined;
    setGame: (newGame: Game) => void;
};

export const GameMenu = ({ gameService, game, setGame }: GameMenuProps) => (
    <>
        {
            game &&
            <div className="leftMenu">
                <button className="reset-btn" onClick={() => gameService.startNewGame(game)}>Joc nou</button>
                <PlayerToggle game={game} setGame={setGame} player={game.playerX} />
                <PlayerToggle game={game} setGame={setGame} player={game.player0} />
            </div>
        }
        <div className="centerMenu">X și 0</div>
        <div className="rightMenu">
            {game && <GameSettingsMenu game={game} setGame={setGame} />}
            <ThemeToggle />
        </div>
    </>
);