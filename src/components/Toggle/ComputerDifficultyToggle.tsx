import { Difficulty, type Game, type Player } from "../../model/GameModels";
import { Dropdown } from "./Dropdown";

type ComputerDifficultyToggleProps = {
    game: Game;
    setGame: (newGame: Game) => void;
    player: Player
};

export const ComputerDifficultyToggle = ({ game, setGame, player }: ComputerDifficultyToggleProps) => {
    const onDifficultyChange = (newDifficulty: Difficulty) => {
        const playerX = player.symbol === "X" ? switchDifficulty(player, newDifficulty) : game.playerX;
        const player0 = player.symbol === "0" ? switchDifficulty(player, newDifficulty) : game.player0;
        setGame({
            ...game,
            playerX,
            player0
        });
    };

    const difficulty = player.computerDifficulty ?? Difficulty.NORMAL;

    return <Dropdown options={[Difficulty.NORMAL, Difficulty.HARD, Difficulty.EXPERT]} defaultValue={difficulty} onChange={onDifficultyChange}/>;
};

const switchDifficulty = (player: Player, newDifficulty: Difficulty): Player => ({
    ...player,
    computerDifficulty: newDifficulty
});
