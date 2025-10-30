import type {Board} from "../models/board.ts";
import type {Piece} from "../models/piece.ts";
import {ColorType} from "../types/color-type.ts";
import {ModelName} from "../types/model-name.ts";

/**
 * Utility class for converting the current board state into
 * a valid FEN position string.
 *
 * Example output: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
 */
export class FenGenerator {
    public static toFen(board: Board, activeColor: ColorType): string {
        const rows: string[] = [];

        for (let row = 7; row >= 0; row--) {
            let fenRow = "";
            let emptyCount = 0;

            for (let col = 0; col < 8; col++) {
                const piece = board.getPiece({ row, col });

                if (!piece) {
                    emptyCount++;
                    continue;
                }

                // Flush any accumulated empty squares
                if (emptyCount > 0) {
                    fenRow += emptyCount.toString();
                    emptyCount = 0;
                }

                const symbol = FenGenerator.getFenSymbol(piece);
                fenRow += symbol;
            }

            // End of row — flush trailing empties
            if (emptyCount > 0) {
                fenRow += emptyCount.toString();
            }

            rows.push(fenRow);
        }

        const x = `${rows.join("/")} ${activeColor === ColorType.WHITE ? "w" : "b"} KQkq - 0 1`;
        console.log(x)
        return x
    }

    /**
     * Returns the FEN character for a given piece.
     * Uppercase = White, lowercase = Black.
     */
    private static getFenSymbol(piece: Piece): string {
        const color = piece.color;
        const model = piece.modelName;

        let symbol = "";

        switch (model) {
            case ModelName.WHITE_PAWN_CTRL:
            case ModelName.WHITE_PAWN_E:
            case ModelName.WHITE_PAWN_ESC:
            case ModelName.WHITE_PAWN_Q:
            case ModelName.WHITE_PAWN_R:
            case ModelName.WHITE_PAWN_T:
            case ModelName.WHITE_PAWN_W:
            case ModelName.WHITE_PAWN_Y:
            case ModelName.BLACK_PAWN_CTRL:
            case ModelName.BLACK_PAWN_E:
            case ModelName.BLACK_PAWN_ESC:
            case ModelName.BLACK_PAWN_Q:
            case ModelName.BLACK_PAWN_R:
            case ModelName.BLACK_PAWN_T:
            case ModelName.BLACK_PAWN_W:
            case ModelName.BLACK_PAWN_Y:
                symbol = "p";
                break;

            case ModelName.WHITE_KNIGHT:
            case ModelName.BLACK_KNIGHT:
                symbol = "n";
                break;

            case ModelName.WHITE_BISHOP:
            case ModelName.BLACK_BISHOP:
                symbol = "b";
                break;

            case ModelName.WHITE_ROOK:
            case ModelName.BLACK_ROOK:
                symbol = "r";
                break;

            case ModelName.WHITE_QUEEN:
            case ModelName.BLACK_QUEEN:
                symbol = "q";
                break;

            case ModelName.WHITE_KING:
            case ModelName.BLACK_KING:
                symbol = "k";
                break;

            default:
                symbol = "?";
        }

        // White pieces → uppercase
        if (color === ColorType.WHITE) {
            symbol = symbol.toUpperCase();
        }

        return symbol;
    }
}