import { useState } from "react";
import { Toggle } from "./Toggle/Toggle";
import { DeleteModesToggles } from "./Toggle/DeleteModesToggles";
import type { Game } from "../model/GameModels";

export type GameSettingsMenuProps = {
    game: Game;
    setGame: (newGame: Game) => void;
};

const isAnyDeleteModeEnabled = (game: Game): boolean => (game.settings?.deleteMovesAfterSeconds ?? 0) > 0 || (game?.settings?.deleteRandomMovesAfterSeconds ?? 0) > 0;

export const GameSettingsMenu = ({ game, setGame }: GameSettingsMenuProps) => {
    const [isDeleteModeEnabled, setIsDeleteModeEnabled] = useState<boolean>(isAnyDeleteModeEnabled(game));
    
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '23rem' }}>
            <Toggle ischecked={isDeleteModeEnabled} onToggle={() => setIsDeleteModeEnabled(!isDeleteModeEnabled)} text={isDeleteModeEnabled ? "Joc special" : "Joc clasic"} />
            {
                isDeleteModeEnabled && <DeleteModesToggles game={game} setGame={setGame} />
            }
        </div>
    );
};