import type {Board} from "../models/board.ts";
import {Scene} from "three";
import {Piece} from "../models/piece.ts";
import {Pawn} from "../models/pawn.ts";
import {Knight} from "../models/knight.ts";
import {Bishop} from "../models/bishop.ts";
import {Rook} from "../models/rook.ts";
import {Queen} from "../models/queen.ts";
import {King} from "../models/king.ts";
import {ColorType} from "../types/color-type.ts";

export class FenLoader {
    public static async load(
        board: Board,
        scene: Scene,
        fen: string,
        trackProgress?: () => void
    ): Promise<void> {
        // Example FEN: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
        const rows = fen.split(" ")[0].split("/");

        if (rows.length !== 8) {
            throw new Error("Invalid FEN string — board must have 8 ranks.");
        }

        for (let row = 0; row < 8; row++) {
            const rank = rows[row];
            let col = 0;

            for (const char of rank) {
                if (col >= 8) break; // safety guard

                // Digits mean empty squares
                if (!isNaN(Number(char))) {
                    col += Number(char);
                    continue;
                }

                // Determine color and piece type
                const isWhite = char === char.toUpperCase();
                const color = isWhite ? ColorType.WHITE : ColorType.BLACK;
                const symbol = char.toLowerCase();

                let piece: Piece | null = null;

                switch (symbol) {
                    case "p":
                        piece = new Pawn(color);
                        break;
                    case "n":
                        piece = new Knight(color);
                        break;
                    case "b":
                        piece = new Bishop(color);
                        break;
                    case "r":
                        piece = new Rook(color);
                        break;
                    case "q":
                        piece = new Queen(color);
                        break;
                    case "k":
                        piece = new King(color);
                        break;
                    default:
                        console.warn(`Unrecognized FEN character: '${char}'`);
                        break;
                }

                // Wait for model to load
                if (piece) {
                    await piece.load();
                    board.setPiece(piece, row, col);
                    scene.add(piece.mesh);

                }
                if (trackProgress) {
                    trackProgress();
                }

                col++;
            }
        }
    }
}