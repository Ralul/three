import * as THREE from 'three'

export class Cow {

    constructor(position: { x: number, y: number, z: number }, scene: THREE.Scene) {
        // --- THREE.js (visual mesh) ---
        const loader = new THREE.GLTFLoader();
        loader.load('/resources/models/animals/cow.glb', (gltf) => {
            scene.add(gltf.scene);
            gltf.scene.position.copy(position);
        }, undefined, (error) => {
            console.error(error);
        })
    }
}