import type { Game, Player } from "../model/GameModels";
import type { TicTacToeService } from "../service/TicTacToeService";
import "./GameMenu.css";

export type GameMenuProps = {
    gameService: TicTacToeService;
    game: Game | undefined;
    setGame: (newGame: Game) => void;
};

export const GameMenu = ({ gameService, game, setGame }: GameMenuProps) => {
    return (
        game &&
        <div className="menu">
            <button className="reset-btn" onClick={() => setGame(gameService.getInitialGame(game))}>Joc nou</button>
            <PlayerToggle game={game} setGame={setGame} player={game.playerX} />
            <PlayerToggle game={game} setGame={setGame} player={game.player0} />
        </div>
    );
};

type PlayerToggleProps = {
    game: Game;
    setGame: (newGame: Game) => void;
    player: Player
};

const PlayerToggle = ({ game, setGame, player }: PlayerToggleProps) => {
    const onPlayerModeChange = () => {
        const playerX = player.symbol === "X" ? { ...player, isComputer: !player.isComputer } : game.playerX;
        const player0 = player.symbol === "0" ? { ...player, isComputer: !player.isComputer } : game.player0;
        setGame({
            ...game,
            playerX,
            player0
        });
    };

    return (
        <div className="toggle-wrapper">
            <label className="toggle">
                <input
                    type="checkbox"
                    checked={player.isComputer ?? false}
                    onChange={onPlayerModeChange}
                />
                <span className="slider" />
            </label>
            <span className="toggle-label">
                {player.symbol} este {player.isComputer ? "calculator" : "om"}
            </span>
        </div>
    );
};