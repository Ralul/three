import type {ChessPos} from "./types/chess-pos.ts";
import type {Board} from "./models/board.ts";

export class GameManager {
    private startPos: ChessPos | null = null;
    private endPos: ChessPos | null = null;
    private board: Board;

    public constructor(board: Board) {
        this.board = board;
    }

    public userClick(pos: ChessPos) {
        if (this.startPos === null) {
            this.startPos = pos;
            return;
        }
        this.endPos = pos;

        this.board.movePiece(this.startPos, this.endPos);
        this.startPos = null;
        this.endPos = null;

    }
}