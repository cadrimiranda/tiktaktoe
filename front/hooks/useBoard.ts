import { useEffect, useState } from "react";

enum offlinePlayer {
  x = "X",
  o = "O",
}

enum playerValue {
  x = "X",
  o = "O",
  empty = "empty",
}

type TBoard = playerValue[][];

export type THandleClickCellCallback = { endGame: boolean; win: boolean };
type ThandleClickCell = {
  lineIndex: number;
  cellIndex: number;
  player: offlinePlayer;
  callBack: ({ endGame, win }: THandleClickCellCallback) => void;
};

const useBoard = () => {
  const [board, setBoard] = useState<TBoard>([]);

  useEffect(() => {
    setBoard(createBoard);
  }, []);

  const createBoard = () => [
    [playerValue.empty, playerValue.empty, playerValue.empty],
    [playerValue.empty, playerValue.empty, playerValue.empty],
    [playerValue.empty, playerValue.empty, playerValue.empty],
  ];

  const isEqual = (a: playerValue, b: playerValue) => a === b;

  const getBoardColumn = (_board: TBoard, column: number) =>
    _board.map((value) => value[column]);

  const verifyWinnerByLine =
    (playerToVerify: playerValue) => (line: playerValue[]) => {
      return line.every((cellValue) => cellValue === playerToVerify);
    };

  const verifyWinnerByColumn = (
    playerToVerify: playerValue,
    column: playerValue[]
  ) => {
    return column.every((cellValue) => cellValue === playerToVerify);
  };

  const verifyWinnerInAxis = (_board: TBoard, p: playerValue) => {
    const [[x1], [, middle], [, , x2]] = _board;
    const [[, , y1], [], [y2]] = _board;

    if (isEqual(x1, p) && isEqual(middle, p) && isEqual(x2, p)) {
      return true;
    }

    return isEqual(y1, p) && isEqual(middle, p) && isEqual(y2, p);
  };

  const isEndgame = (_board: TBoard) => {
    return _board.every((line) =>
      line.every((cell) => cell !== playerValue.empty)
    );
  };

  const verifyWinner = (_board: TBoard, playerToVerify: playerValue) => {
    if (_board.some(verifyWinnerByLine(playerToVerify))) {
      return true;
    }

    if (
      _board.some((_, index) =>
        verifyWinnerByColumn(playerToVerify, getBoardColumn(_board, index))
      )
    ) {
      return true;
    }

    return verifyWinnerInAxis(_board, playerToVerify);
  };

  const handleClickCell = ({
    callBack,
    cellIndex,
    lineIndex,
    player,
  }: ThandleClickCell) => {
    if (board[lineIndex][cellIndex] !== playerValue.empty) {
      return;
    }

    const value = player === offlinePlayer.x ? playerValue.x : playerValue.o;
    const _board = board.slice();
    _board[lineIndex][cellIndex] = value;
    setBoard(_board);
    if (verifyWinner(_board, value)) {
      callBack({ win: true, endGame: false });
    }

    callBack({ win: false, endGame: isEndgame(_board) });
  };

  return {
    board,
    handleClickCell,
  };
};

export { useBoard, offlinePlayer, playerValue };
