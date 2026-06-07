import React, { useEffect, useRef, useState } from "react";
import "./BoardCell.css";
import { Cell } from "../../model/GameModels";

type BoardCellProps = {
    className?: string;
    cell: Cell;
    onClick?: () => void;
};

const ANIM_DURATION = 800; // ms, keep in sync with CSS

export const BoardCell: React.FC<BoardCellProps> = ({ className, cell, onClick }) => {
    const prevRef = useRef<Cell>(cell);
    const [deletingSymbol, setDeletingSymbol] = useState<Cell | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const prev = prevRef.current;
        if (prev !== Cell.EMPTY && cell === Cell.EMPTY) {
            setDeletingSymbol(prev);
            setIsAnimating(true);
            const t = setTimeout(() => {
                setIsAnimating(false);
                setDeletingSymbol(null);
            }, ANIM_DURATION);
            return () => clearTimeout(t);
        }
        prevRef.current = cell;
    }, [cell]);

    return (
        <div className={className} onClick={onClick} style={{ position: "relative" }}>
            <span>{cell}</span>
            {isAnimating && deletingSymbol && (
                <div className="deletion-animation" aria-hidden>
                    <span className="deleting-piece">🗑️</span>
                    <div className="deletion-dust" />
                </div>
            )}
        </div>
    );
};

export default BoardCell;
