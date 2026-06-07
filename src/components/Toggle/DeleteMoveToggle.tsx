import { useState } from "react";
import { Toggle } from "./Toggle";

export type DeleteMoveToggleProps = {
    isEnabled: boolean;
    textDisabled: string;
    textEnabled: string;
    seconds: number;
    setSeconds: (seconds: number | undefined) => void;
}

export const DeleteMoveToggle = ({ isEnabled, textDisabled, textEnabled, seconds, setSeconds }: DeleteMoveToggleProps) => {
    const [isDeleteModeEnabled, setIsDeleteModeEnabled] = useState<boolean>(isEnabled);

    const onSecondsChanged = (newSeconds: number) => {
        setSeconds(newSeconds);
    };

    const onDeleteModeToggle = (): void => {
        const isEnabled = !isDeleteModeEnabled;
        setIsDeleteModeEnabled(isEnabled);

        if (!isEnabled) {
            setSeconds(undefined);
        }
        else if (seconds === undefined) {
            setSeconds(5);
        }
    };

    return (
        <div className="delete-modes-container">
            <Toggle ischecked={isDeleteModeEnabled} onToggle={() => onDeleteModeToggle()} text={isDeleteModeEnabled ? "" : textDisabled} />
            { isDeleteModeEnabled &&
            <>
                <span>{textEnabled}</span>
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
            </>
            }
        </div>
    );
};