import { useEffect, useState } from "react";
import { Toggle } from "./Toggle/Toggle";
import { DeleteModesToggles } from "./Toggle/DeleteModesToggles";
import type { Game } from "../model/GameModels";

export type GameSettingsMenuProps = {
    game: Game;
    setGame: (newGame: Game) => void;
};

export const GameSettingsMenu = ({ game, setGame }: GameSettingsMenuProps) => {
    const [isDeleteModeEnabled, setIsDeleteModeEnabled] = useState<boolean>(false);
    
    useEffect(() => {
        setIsDeleteModeEnabled(isAnyDeleteModeEnabled(game));
    }, [game]);

    const isAnyDeleteModeEnabled = (game: Game): boolean => (game.settings?.deleteMovesAfterSeconds ?? 0) > 0 || (game?.settings?.deleteRandomMovesAfterSeconds ?? 0) > 0;

    const onDeleteModeToggle = (): void => {
        const isEnabled = !isDeleteModeEnabled;
        setIsDeleteModeEnabled(isEnabled);

        const newSettings = isEnabled ? {} : undefined;
        setGame({
            ...game,
            settings: newSettings
        });
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '23rem' }}>
            <Toggle ischecked={isDeleteModeEnabled} onToggle={() => onDeleteModeToggle()} text={isDeleteModeEnabled ? "Joc special" : "Joc clasic"} />
            {
                isDeleteModeEnabled && <DeleteModesToggles game={game} setGame={setGame} />
            }
        </div>
    );
};