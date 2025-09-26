import * as THREE from 'three'
import {PerspectiveCamera, Vector2, Vector3} from "three";


export class ControllableCamera {

    private _keyState: { [key: string]: boolean } = {};
    private _mouseState: { [button: number | string]: boolean | { x:number, y:number } } = {};

    private mouseStart: Vector2;
    private mouseMove: Vector2;
    private mouseIsLocked: boolean = false;

    private readonly _camera: THREE.PerspectiveCamera;
    private readonly speed: number;

    constructor(position: { x: number; y: number; z: number }, speed: number = 0.1) {
        this._camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this._camera.position.set(position.x, position.y, position.z);
        this.speed = speed;
    }

    public get camera(): PerspectiveCamera {
        return this._camera;
    }

    public get keyState():{ [key: string]: boolean } {
        return this._keyState;
    }

    set keyState(value: { [p: string]: boolean }) {
        this._keyState = value;
    }

    get mouseState(): { [p: number | string]: boolean | number } {
        return this._mouseState;
    }

    set mouseState(value: { [p: number | string]: boolean | number }) {
        this._mouseState = value;
    }

    public update() {


        console.log(Math.abs(this._camera.rotation.y % 6.28));

        // Calculate direction based on key state
        const direction = new Vector3();
        if (this._keyState['ArrowUp'] || this._keyState['KeyW']) {
            direction.z -= 1;
        }
        if (this._keyState['ArrowDown'] || this._keyState['KeyS']) {
            direction.z += 1;
        }
        if (this._keyState['ArrowLeft'] || this._keyState['KeyA']) {
            direction.x -= 1;
        }
        if (this._keyState['ArrowRight'] || this._keyState['KeyD']) {
            direction.x += 1;
        }
        direction.normalize();
        direction.multiplyScalar(this.speed);

        // Apply movement in the camera
        this._camera.position.add(direction);

        // Handle mouse look (if right mouse button is pressed)
        if (this._mouseState[0] && !this.mouseIsLocked){
            this.mouseIsLocked = true;
            this.mouseStart = this._mouseState['position'] as Vector2;
        }

        if (!this._mouseState[0]) {
            this.mouseIsLocked = false;
        }

        if (this.mouseIsLocked) {
            const mousePosition = this._mouseState['position'] as Vector2;

            const deltaX = (mousePosition.x - this.mouseStart.x) * 0.0002;

            this._camera.rotation.y -= deltaX;

        }
    }
}