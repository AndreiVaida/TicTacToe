import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { Cell } from "./model/GameModels";
import type { Game, Player } from "./model/GameModels";
import { GameMenu } from "./components/GameMenu";
import { GameOverModal } from "./components/Modal/GameOverModal";
import { TableService } from "./service/TableService";
import { ComputerService } from "./service/ComputerService";
import { TicTacToeServiceImpl } from "./service/TicTacToeServiceImpl";
import type { TicTacToeService } from "./service/TicTacToeService";

const App = () => {
    const tableService = useMemo(() => new TableService(), []);
    const computerService = useMemo(() => new ComputerService(tableService), [tableService]);
    const gameService = useMemo<TicTacToeService>(() => new TicTacToeServiceImpl(tableService, computerService), [tableService, computerService]);
    const [game, setGame] = useState<Game>();

    useEffect(() => {
        gameService.startNewGame();
        gameService.gameUpdates.subscribe((newGame) => {
            setGame(newGame);
        });
    }, [gameService]);

    useEffect(() => {
        if (game?.isGameOver)
            notifyGameOver(game.winner);
    }, [game]);

    const handleCellClick = (i: number, j: number): void => {
        if (game?.currentPlayer?.isComputer) return;
        gameService.doNewMove({row: i, column: j}, game);
    };

    const createCell = (i: number, j: number, cell: Cell) => {
        const isCellPlayable = tableService.isCellPlayable(i, j, game!);
        return (
            <div key={i + "_" + j} className={getCellClasses(cell, isCellPlayable)} onClick={isCellPlayable ? () => handleCellClick(i, j) : undefined}>
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
    };

    const handleStartNewGame = () => gameService.startNewGame(game);

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
            {game?.isGameOver && (
                <GameOverModal
                    winner={game.winner || undefined}
                    onStartNewGame={handleStartNewGame}
                />
            )}
        </>
    );
};

export default App;
