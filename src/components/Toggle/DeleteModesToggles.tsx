import { useState } from "react";
import type { GameSettings } from "../../model/GameModels";
import type { GameSettingsMenuProps } from "../GameSettingsMenu";

export const DeleteModesToggles = ({ game, setGame }: GameSettingsMenuProps) => {
    const [seconds, setSeconds] = useState(game.settings?.deleteMovesAfterSeconds ?? 5);
    
    const onSecondsChanged = (newSeconds: number) => {
        setSeconds(newSeconds);

        const newSettings: GameSettings = {
            ...game?.settings,
            deleteMovesAfterSeconds: newSeconds
        };
        setGame({
            ...game,
            settings: newSettings
        });
    }

    return (
        <div className="delete-modes-container">
            <span>Șterge mutările după</span>
            <button onClick={() => onSecondsChanged(Math.max(1, seconds - 1))} className="increase-button">-</button>
            <input
                type="number"
                min="1"
                value={seconds}
                onChange={(e) => onSecondsChanged(Math.max(1, Number(e.target.value)))}
                className="delete-timer-input"
            />
            <button onClick={() => onSecondsChanged(seconds + 1)} className="increase-button">+</button>
            <span>secunde</span>
        </div>
    );
};