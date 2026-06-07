import type { Game, GameSettings } from "../../model/GameModels";
import { DeleteMoveToggle } from "./DeleteMoveToggle";

export type GameSettingsMenuProps = {
    game: Game;
    setGame: (newGame: Game) => void;
};

export const DeleteModesToggles = ({ game, setGame }: GameSettingsMenuProps) => {
    const deleteMovesAfterSeconds = game.settings?.deleteMovesAfterSeconds;
    const deleteRandomMovesAfterSeconds = game.settings?.deleteRandomMovesAfterSeconds;

    const onDeleteMoveSecondsChanged = (newSeconds: number | undefined) => {
        const newSettings: GameSettings = {
            ...game?.settings,
            deleteMovesAfterSeconds: newSeconds
        };
        setGame({...game, settings: newSettings});
        console.info({...game, settings: newSettings});
    };

    const onDeleteRandomSecondsChanged = (newSeconds: number | undefined) => {
        const newSettings: GameSettings = {
            ...game?.settings,
            deleteRandomMovesAfterSeconds: newSeconds
        };
        setGame({...game, settings: newSettings});
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px', minWidth: '28rem' }}>
            <DeleteMoveToggle isEnabled={(deleteMovesAfterSeconds ?? 0) > 0} textDisabled="Nu șterge mutările" textEnabled="Șterge mutările după" seconds={deleteMovesAfterSeconds} setSeconds={onDeleteMoveSecondsChanged}></DeleteMoveToggle>
            <DeleteMoveToggle isEnabled={(deleteRandomMovesAfterSeconds ?? 0) > 0} textDisabled="Nu șterge aleator" textEnabled="Șterge aleator la fiecare" seconds={deleteRandomMovesAfterSeconds} setSeconds={onDeleteRandomSecondsChanged}></DeleteMoveToggle>
        </div>);
};