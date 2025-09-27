import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { TicTacToeService } from "./service/TicTacToeService";
import { Cell } from "./model/GameModels";
import type { Game } from "./model/GameModels";

const App = () => {
    const gameService = useMemo(() => new TicTacToeService(), []);
    const [game, setGame] = useState<Game>();

    useEffect(() => {
        setGame(gameService.getInitialGame());
    }, [gameService]);

    const handleClick = (i: number, j: number): void => {
        const updatedGame = gameService.nextMove(game!, i, j);
        setGame(updatedGame);
    };

    const createCell = (i: number, j: number, cell: Cell) => {
        const isCellPlayable = gameService.isCellPlayable(i, j, game!);
        const player = game!.table[i][j];
        return (
            <div key={i + "_" + j} className={getCellClasses(player)} onClick={isCellPlayable ? () => handleClick(i, j) : undefined}>
                <span>{cell}</span>
            </div>
        );
    };

    const createLine = (i: number, line: Cell[]) => (
        <div>{line.map((cell, j) => createCell(i, j, cell))}</div>
    );

    const getCellClasses = (player: Cell): string => {
        switch (player) {
            case Cell.EMPTY: return "cell cell-playable";
            case Cell.X: return "cell cell-not-playable cell-x";
            case Cell.ZERO: return "cell cell-not-playable cell-zero";
        }
    };

    return (
        <>
            <h1>X și 0</h1>
            <div className="board">
                {
                    game
                        ? game.table.map((line, i) => createLine(i, line))
                        : "Game not available"
                }
            </div>
        </>
    );
};

export default App;
