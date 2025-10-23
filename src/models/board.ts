import type {Object3D} from "three";
import * as THREE from "three";
import {ModelName} from "../types/model-name.ts";
import {ModelLoader} from "../utils/model-loader.ts";
import type {Piece} from "./piece.ts";

const gridInterval: number = 1;
const gridOffsetX: number = -3.465;
const gridOffsetZ: number = -3.530;

export class Board {
    private _mesh = new THREE.Object3D();
    private _modelName: ModelName = ModelName.BOARD;
    private _grid: (Piece | null)[][] = Array.from({ length: 8 }, () =>
        new Array(8).fill(null)
    );

    constructor() {

    }

    public setPiece(piece: Piece, row: number, col: number) : void {
        this._grid[row][col] = piece;
        piece.setPosition(row * gridInterval + gridOffsetX, 0, col * gridInterval + gridOffsetZ)
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

    /**
     * Set the position of this piece on the board.
     */
    public setPosition(x: number, y: number, z: number): void {
        this._mesh.position.set(x, y, z);
    }
}