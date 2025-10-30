import type {ChessPos} from "./types/chess-pos.ts";
import type {Board} from "./models/board.ts";
import type {Piece} from "./models/piece.ts";
import {Chess, Move} from "chess.js";
import type {ChessSquare} from "./types/chess-square.ts";
import {fromChessSquare, toChessSquare} from "./utils/chess-coordinate-mapper.ts";
import {ColorType} from "./types/color-type.ts";
import {FenGenerator} from "./utils/fen-generator.ts";
import type {Square} from "chess.js/src/chess.ts";

export class GameManager {
    private activeColor: ColorType = ColorType.WHITE;
    private startPos: ChessPos | null = null;
    private board: Board;
    private chess: Chess;

    private validMoves: Move[];

    public constructor(board: Board) {
        this.board = board;
        this.chess = new Chess(FenGenerator.toFen(board, this.activeColor));
        this.validMoves = this.chess.moves({verbose: true});
    }

    public reset(): void {
        this.startPos = null;
        this.board.highlighter.clearAll()

        this.board.getAllPieces().forEach((piece: Piece) => piece.setSelected(false))
    }

    public userClick(pos: ChessPos) {
        console.log(this.validMoves);

        // Check if pos is valid start move
        if (this.validMoves.find(vm => vm.from == toChessSquare(pos) as Square) && this.startPos == null) {
            this.startPos = pos;
            this.board.getPiece(pos)?.setSelected(true);

            // Highlight valid moves for this piece
            const validMovesForPiece = this.validMoves.filter(vm => vm.from == toChessSquare(pos));
            validMovesForPiece.forEach(move => {
                this.board.highlighter.highlight(fromChessSquare(move.to as ChessSquare));
            });
            return;
        }

        // Check if destination move depending on start exists
        if (this.startPos != null) {
            const validMove = this.validMoves
                .filter(vm => vm.from == toChessSquare(this.startPos!)) // Add ! to assert non-null
                .find(vm => vm.to == toChessSquare(pos));

            if (validMove) {
                // Valid move found - execute it
                this.board.movePiece(this.startPos, pos);
                this.board.getPiece(pos)?.setSelected(false);
                this.board.highlighter.clearAll();

                // Make the move in chess.js
                this.chess.move({
                    from: toChessSquare(this.startPos) as Square,
                    to: toChessSquare(pos) as Square
                });

                // Update valid moves for next turn
                this.validMoves = this.chess.moves({verbose: true});
                this.activeColor = this.activeColor === ColorType.WHITE ? ColorType.BLACK : ColorType.WHITE;

                this.startPos = null;
                return;
            }
        }

        // If clicking on same position, deselect
        if (this.startPos !== null && this.startPos.row === pos.row && this.startPos.col === pos.col) {
            this.reset();
            return;
        }

        // If no valid move and startPos is set, reset selection
        if (this.startPos !== null) {
            this.reset();
        }
    }
}