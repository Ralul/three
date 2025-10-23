import {Piece} from "./piece.ts";
import {ModelName} from "../types/model-name.ts";
import {ColorType} from "../types/color-type.ts";

export class Rook extends Piece{
    constructor(color: ColorType) {
        if (color == ColorType.BLACK) {
            super(ModelName.BLACK_ROOK, color);
        } else {
            super(ModelName.WHITE_ROOK, color);
        }
    }
}