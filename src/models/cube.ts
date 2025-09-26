import * as THREE from "three";
import * as CANNON from "cannon-es";
import {Mesh} from "three";

export class Cube {
    private _mesh: THREE.Mesh;
    private _body: CANNON.Body;

    constructor(
        size: number,
        mass: number,
        position: { x: number; y: number; z: number },
        color: number = 0x00ff00
    ) {
        // --- THREE.js (visual mesh) ---
        const geometry = new THREE.BoxGeometry(size, size, size, 32, 32, 32);
        const material = new THREE.MeshStandardMaterial({
            color,
            metalness: 0.3,
            roughness: 0.7,
        });
        this._mesh = new THREE.Mesh(geometry, material);
        this._mesh.castShadow = true;
        this._mesh.position.set(position.x, position.y, position.z);

        // --- Cannon-es body (physics body) ---
        const shape = new CANNON.Box(new CANNON.Vec3(size /2, size /2, size /2));
        this._body = new CANNON.Body({
            mass,
            shape,
            position: new CANNON.Vec3(position.x, position.y, position.z),
        });
    }

    get mesh(): Mesh {
        return this._mesh;
    }

    set mesh(value: Mesh) {
        this._mesh = value;
    }

    get body(): CANNON.Body {
        return this._body;
    }

    set body(value: CANNON.Body) {
        this._body = value;
    }

    // Sync physics -> render
    updateFromPhysics() {
        this._mesh.position.set(
            this._body.position.x,
            this._body.position.y,
            this._body.position.z
        );
        this._mesh.quaternion.set(
            this._body.quaternion.x,
            this._body.quaternion.y,
            this._body.quaternion.z,
            this._body.quaternion.w
        );
    }
}