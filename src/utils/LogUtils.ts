import type { Player, Position } from "../model/GameModels";

export class LogUtils {
    public static getPlayerMoveInfo = (player: Player | null, position: Position): string => {
        if (!player) return `Unknown plays at [${position.row} ${position.column}]`;

        if (!player.isComputer)
            return `👱 ${player.symbol} plays at [${position.row} ${position.column}]`;

        return `💻 ${player.symbol} plays at [${position.row} ${position.column}]${LogUtils.getPlayerDifficultyString(player)}`;
    };

    private static getPlayerDifficultyString = (player: Player): string => player.computerDifficulty ? ` (${player.computerDifficulty})` : "";
};