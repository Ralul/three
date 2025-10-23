import * as THREE from 'three';
import { ModelLoader } from '../utils/model-loader';
import { ModelName } from '../types/model-name.ts';
import {ColorType} from "../types/color-type.ts";

export class Piece {
    private _mesh: THREE.Object3D;
    private _modelName: ModelName;
    private _isSelected = false;
    private _color: ColorType;

    constructor(modelName: ModelName, color: ColorType) {
        this._modelName = modelName;
        this._mesh = new THREE.Object3D();
        this._color = color;
    }

    public get mesh(): THREE.Object3D {
        return this._mesh;
    }

    public get modelName(): ModelName {
        return this._modelName;
    }

    /**
     * Asynchronously loads the model and initializes the mesh.
     */
    public async load(): Promise<void> {
        const model = await ModelLoader.getModelClone(this._modelName);
        this._mesh.userData.piece = this
        this._mesh.add(model);
    }

    /**
     * Set the position of this piece on the board.
     */
    public setPosition(x: number, y: number, z: number): void {
        this._mesh.position.set(x, y, z);
    }

    /**
     * Smoothly move the piece to a new position (animation-friendly).
     */
    public moveTo(target: THREE.Vector3, speed = 0.05): void {
        const current = this._mesh.position;
        current.lerp(target, speed);
    }

    /**
     * Optional — you can add highlight behavior or rotation for animation loops.
     */
    public update(deltaTime: number): void {
        if (this._isSelected) {
            // e.g. make it spin slightly
            this._mesh.rotation.y += Math.PI * deltaTime;
        }
    }


    get isSelected(): boolean {
        return this._isSelected;
    }

    get color(): ColorType {
        return this._color;
    }
}