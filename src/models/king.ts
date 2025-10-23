import {Piece} from "./piece.ts";
import {ModelName} from "../types/model-name.ts";
import {ColorType} from "../types/color-type.ts";

export class King extends Piece{
    constructor(color: ColorType) {
        if (color == ColorType.BLACK) {
            super(ModelName.BLACK_KING, color);
        } else {
            super(ModelName.WHITE_KING, color);
        }
    }
}