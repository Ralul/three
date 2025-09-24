import * as THREE from "three";
import * as CANNON from "cannon-es";

export class Sphere {
    mesh: THREE.Mesh;
    body: CANNON.Body;

    constructor(
        radius: number,
        mass: number,
        position: { x: number; y: number; z: number },
        color: number = 0xff0000
    ) {
        // --- THREE.js (visual mesh) ---
        const geometry = new THREE.SphereGeometry(radius, 32, 32);
        const material = new THREE.MeshStandardMaterial({
            color,
            metalness: 0.3,
            roughness: 0.7,
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true;
        this.mesh.position.set(position.x, position.y, position.z);

        // --- Cannon-es body (physics body) ---
        const shape = new CANNON.Sphere(radius);
        this.body = new CANNON.Body({
            mass,
            shape,
            position: new CANNON.Vec3(position.x, position.y, position.z),
        });
    }

    // Sync physics -> render
    updateFromPhysics() {
        this.mesh.position.set(
            this.body.position.x,
            this.body.position.y,
            this.body.position.z
        );
        this.mesh.quaternion.set(
            this.body.quaternion.x,
            this.body.quaternion.y,
            this.body.quaternion.z,
            this.body.quaternion.w
        );
    }
}