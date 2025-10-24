import type { ChessSquare } from "../types/chess-position.ts";

const files = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
const ranks = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;

/**
 * Converts board array coordinates [row, col] to a chess square.
 * row = 0 is rank 8, row = 7 is rank 1 (top-to-bottom perspective).
 * col = 0 is file 'a', col = 7 is file 'h'.
 */
export function toChessSquare(row: number, col: number): ChessSquare {
    if (row < 0 || row >= 8 || col < 0 || col >= 8) {
        throw new Error(`Invalid board coordinates: row=${row}, col=${col}`);
    }

    const file = files[col];
    const rank = ranks[row];
    return `${file}${rank}` as ChessSquare;
}

/**
 * Converts a chess square (e.g. 'e4') to board coordinates [row, col].
 */
export function fromChessSquare(square: ChessSquare): {row:number, col:number} {
    const file = square[0];
    const rank = square[1];

    const col = files.indexOf(file as typeof files[number]);
    const row = ranks.indexOf(rank as typeof ranks[number]);

    return {row, col};
}