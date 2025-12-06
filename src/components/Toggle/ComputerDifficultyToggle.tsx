import { Difficulty, type Game, type Player } from "../../model/GameModels";
import { Toggle } from "./Toggle";

type ComputerDifficultyToggleProps = {
    game: Game;
    setGame: (newGame: Game) => void;
    player: Player
};

export const ComputerDifficultyToggle = ({ game, setGame, player }: ComputerDifficultyToggleProps) => {
    const onDifficultyChange = () => {
        const playerX = player.symbol === "X" ? switchDifficulty(player) : game.playerX;
        const player0 = player.symbol === "0" ? switchDifficulty(player) : game.player0;
        setGame({
            ...game,
            playerX,
            player0
        });
    };

    const difficulty = player.computerDifficulty ?? Difficulty.NORMAL;

    return (
        <>
            <Toggle
                ischecked={difficulty === Difficulty.EXPERT}
                onToggle={onDifficultyChange}
                text={difficulty}
            />
        </>
    );
};

const switchDifficulty = (player: Player): Player => {
    const oldDifficulty = player.computerDifficulty ?? Difficulty.NORMAL;
    const newDifficulty = oldDifficulty === Difficulty.NORMAL ? Difficulty.EXPERT : Difficulty.NORMAL;
    return {
        ...player,
        computerDifficulty: newDifficulty
    };
};
