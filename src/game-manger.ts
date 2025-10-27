import type {ChessPos} from "./types/chess-pos.ts";
import type {Board} from "./models/board.ts";
import type {Piece} from "./models/piece.ts";
import {Chess} from "chess.js";
import type {ChessSquare} from "./types/chess-square.ts";
import {fromChessSquare} from "./utils/chess-coordinate-mapper.ts";

export class GameManager {
    private startPos: ChessPos | null = null;
    private endPos: ChessPos | null = null;
    private board: Board;
    private chess: Chess;

    private validMoves: any;

    public constructor(board: Board) {
        this.board = board;
        //this.chess = new Chess(FenGenerator.toFen(board));
        this.chess = new Chess();
        this.validMoves = this.chess.moves()as ChessSquare[];
        this.validMoves = this.chess.moves({verbose: true})
    }

    public reset(): void {
        this.startPos = null;
        this.endPos = null;
        this.board.highlighter.clearAll()

        this.board.getAllPieces().forEach((piece: Piece) => piece.setSelected(false))
    }

    public userClick(pos: ChessPos) {
        if (this.startPos === null && this.board.getPiece(pos) !== null) {

            console.log(this.validMoves)

            if (this.validMoves.length > 0) {
                for (let moves of this.validMoves) {
                    this.board.highlighter.highlight(fromChessSquare(moves as ChessSquare));

                }
                this.board.getPiece(pos)?.setSelected(true);
                this.startPos = pos;
                return;
            } else {
                return;
            }
        }

        if (this.startPos === null) {
            return;
        }

        if (this.startPos === pos) {
            return;
        }

        this.endPos = pos;

        this.board.movePiece(this.startPos, this.endPos);

        this.board.getPiece(this.endPos)?.setSelected(false);

        this.startPos = null;
        this.endPos = null;

    }
}