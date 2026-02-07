import { useState } from 'react';
import type { Player } from '../../model/GameModels';
import './GameOverModal.css';

export type GameOverModalProps = {
    winner: Player | undefined;
    onStartNewGame: () => void;
};

export const GameOverModal = ({ winner, onStartNewGame }: GameOverModalProps) => {
    const [wasModalClosed, setWasModalClosed] = useState(false);

    const onCloseClick = () => setWasModalClosed(true);
    
    const onStartNewGameClick = () => {
        onStartNewGame();
        setWasModalClosed(true);
    };

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget)
            onCloseClick();
    };

    return (
        !wasModalClosed &&
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content">
                <h2>
                    {winner ? `${winner.symbol} a câștigat!` : "Egalitate!"}
                </h2>
                <div className="modal-buttons">
                    <button onClick={onCloseClick}>OK</button>
                    <button onClick={onStartNewGameClick}>Start new game</button>
                </div>
            </div>
        </div>
    );
};