import * as THREE from 'three';
import { ModelLoader } from '../utils/model-loader';
import { ModelName } from '../types/model-name.ts';
import {ColorType} from "../types/color-type.ts";
import type {ChessPos} from "../types/chess-pos.ts";
import {GRID_INTERVAL, GRID_OFFSET_X, GRID_OFFSET_Z} from "../const/space-offsets.ts";

export class Piece {
    private readonly _mesh: THREE.Object3D;
    private readonly _modelName: ModelName;
    private _isSelected = false;
    private readonly _color: ColorType;
    private _pos: ChessPos;

    constructor(modelName: ModelName, color: ColorType, pos: ChessPos) {
        this._modelName = modelName;
        this._mesh = new THREE.Object3D();
        this._color = color;
        this._pos = pos;
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
    public setPosition(pos: ChessPos): void {
         this._pos = pos;
        this._mesh.position.set(pos.row * GRID_INTERVAL + GRID_OFFSET_X, 0, pos.col * GRID_INTERVAL + GRID_OFFSET_Z);
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
    public update(): void {
        this._mesh.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;

                if (this._isSelected) {
                    // Add highlight pulse
                    const intensity = 0.5 + Math.sin(Date.now() * 0.005) * 0.25;
                    mat.emissiveIntensity = intensity;
                    mat.emissive.setHex(0xffff44); // yellowish highlight
                } else {
                    // Reset to default (no emissive color)
                    mat.emissiveIntensity = 0;
                    mat.emissive.setHex(0x000000);
                }
            }
        });
    }

    public setSelected(isSelected: boolean): void {
        this._isSelected = isSelected;
    }

    get isSelected(): boolean {
        return this._isSelected;
    }

    get color(): ColorType {
        return this._color;
    }

    get pos(): ChessPos {
        return this._pos;
    }
}