import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { TicTacToeService } from "./service/TicTacToeService";
import { Cell } from "./model/GameModels";
import type { Game, Player } from "./model/GameModels";
import { GameMenu } from "./components/GameMenu";
import { TableService } from "./service/TableService";
import { ComputerService } from "./service/ComputerService";

const App = () => {
    const tableService = useMemo(() => new TableService(), []);
    const computerService = useMemo(() => new ComputerService(tableService), [tableService]);
    const gameService = useMemo(() => new TicTacToeService(tableService, computerService), [tableService, computerService]);
    const [game, setGame] = useState<Game>();

    useEffect(() => {
        setGame(gameService.getInitialGame());
    }, [gameService]);

    const handleClick = (i: number, j: number): void => {
        const updatedGame = gameService.doNextMove(game!, {row: i, column: j});
        setGame(updatedGame);
        
        if (updatedGame.isGameOver)
            notifyGameOver(updatedGame.winner);
    };

    const createCell = (i: number, j: number, cell: Cell) => {
        const isCellPlayable = tableService.isCellPlayable(i, j, game!);
        return (
            <div key={i + "_" + j} className={getCellClasses(cell, isCellPlayable)} onClick={isCellPlayable ? () => handleClick(i, j) : undefined}>
                <span>{cell}</span>
            </div>
        );
    };

    const createLine = (i: number, line: Cell[]) => line.map((cell, j) => createCell(i, j, cell));

    const getCellClasses = (cell: Cell, isCellPlayable: boolean): string => {
        switch (cell) {
            case Cell.EMPTY: return isCellPlayable ? "cell cell-playable" : "cell cell-not-playable";
            case Cell.X: return "cell cell-not-playable cell-x";
            case Cell.ZERO: return "cell cell-not-playable cell-zero";
        }
    };

    const notifyGameOver = (winner: Player | undefined) => {
        console.info(`🏁 Game over. ${winner ? `${winner.symbol} won` : "Draw"}`);

        setTimeout(() => {
            if (!winner) alert("Egalitate!");
            else alert(`${winner.symbol} a câștigat!`);
        }, 100);
    };

    const setGameState = (newGame: Game) => setGame(newGame);

    return (
        <>
            <GameMenu gameService={gameService} game={game} setGame={setGameState} />
            <div className="board">
                {
                    game
                        ? game.table.flatMap((line, i) => createLine(i, line))
                        : "Game not available"
                }
            </div>
        </>
    );
};

export default App;
