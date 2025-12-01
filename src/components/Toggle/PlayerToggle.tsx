import { type Game, type Player } from "../../model/GameModels";
import { ComputerDifficultyToggle } from "./ComputerDifficultyToggle";
import { Toggle } from "./Toggle";

type PlayerToggleProps = {
    game: Game;
    setGame: (newGame: Game) => void;
    player: Player
};

export const PlayerToggle = ({ game, setGame, player }: PlayerToggleProps) => {
    const onPlayerModeChange = () => {
        const playerX = player.symbol === "X" ? { ...player, isComputer: !player.isComputer } : game.playerX;
        const player0 = player.symbol === "0" ? { ...player, isComputer: !player.isComputer } : game.player0;
        setGame({
            ...game,
            playerX,
            player0
        });
    };

    const text = `${player.symbol} este ${player.isComputer ? "calculator" : "om"}`;

    return (
        <div className="player-toggle-row">
            <Toggle
                ischecked={player.isComputer ?? false}
                onToggle={onPlayerModeChange}
                text={text}
            />
            {player.isComputer && <ComputerDifficultyToggle game={game} setGame={setGame} player={player} />}
        </div>
    );
};