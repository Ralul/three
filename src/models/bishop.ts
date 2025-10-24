import {Piece} from "./piece.ts";
import {ModelName} from "../types/model-name.ts";
import {ColorType} from "../types/color-type.ts";
import type {ChessPos} from "../types/chess-pos.ts";

export class Bishop extends Piece{
    constructor(color: ColorType, pos: ChessPos) {
        if (color == ColorType.BLACK) {
            super(ModelName.BLACK_BISHOP, color, pos);
        } else {
            super(ModelName.WHITE_BISHOP, color, pos);
        }
    }
}