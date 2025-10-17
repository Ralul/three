import * as THREE from 'three';
import {ModelLoader} from '../utils/model-loader.ts';
import {ModelName} from "../types/model-name.ts";
import {Object3D} from "three";

export class Pawn {
    private _mesh: THREE.Object3D | undefined;

    constructor(position: { x: number; y: number; z: number }) {

        ModelLoader.getModelClone(ModelName.BLACK_PAWN_E).then((model) => {
            this._mesh = model;
            this._mesh.position.set(position.x, position.y, position.z);
        });
    }


    get mesh(): Object3D | undefined {
        return this._mesh;
    }

    set mesh(value: Object3D | undefined) {
        this._mesh = value;
    }
}