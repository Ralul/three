import type {Object3D} from "three";
import * as THREE from "three";
import {ModelName} from "../types/model-name.ts";
import {ModelLoader} from "../utils/model-loader.ts";
import type {Piece} from "./piece.ts";
import type {ChessPos} from "../types/chess-pos.ts";

export class Board {
    private _mesh = new THREE.Object3D();
    private _modelName: ModelName = ModelName.BOARD;
    private _grid: (Piece | null)[][] = Array.from({ length: 8 }, () =>
        new Array(8).fill(null)
    );

    constructor() {

    }

    public setPiece(piece: Piece, pos: ChessPos) : void {
        this._grid[pos.row][pos.col] = piece;
        piece.setPosition(pos)
    }

    public async load(): Promise<void> {
        this._mesh = await ModelLoader.getModelClone(this._modelName);
    }

    get mesh(): Object3D {
        return this._mesh;
    }

    get grid(): (Piece | null) [][] {
        return this._grid;
    }

    public getAllPieces(): Piece[] {
        const pieces: Piece[] = [];
        for (const row of this._grid) {
            for (const piece of row) {
                if (piece !== null) {
                    pieces.push(piece);
                }
            }
        }
        return pieces;
    }

    public getPieceByPositon(pos: ChessPos) {
        return this._grid[pos.row][pos.col];
    }

    public movePiece(startPos: ChessPos, endPos: ChessPos): void {
        let opponentPiece = this._grid[endPos.row][endPos.col]

        if (opponentPiece) {
            opponentPiece.mesh.clear()
        }

        const startPiece = this._grid[startPos.row][startPos.col]
        if (startPiece) {
            this.setPiece(startPiece, endPos)
        }

        this._grid[startPos.row][startPos.col] = null

    }

    /**
     * Set the position of this piece on the board.
     */
    public setPosition(x: number, y: number, z: number): void {
        this._mesh.position.set(x, y, z);
    }
}