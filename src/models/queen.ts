import {Piece} from "./piece.ts";
import {ModelName} from "../types/model-name.ts";
import {ColorType} from "../types/color-type.ts";

export class Queen extends Piece{
    constructor(color: ColorType) {
        if (color == ColorType.BLACK) {
            super(ModelName.BLACK_QUEEN, color);
        } else {
            super(ModelName.WHITE_QUEEN, color);
        }
    }
}