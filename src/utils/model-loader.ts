import * as THREE from 'three';
import { type GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { ModelName } from '../types/model-name.ts';

const modelCache: Map<ModelName, GLTF> = new Map();

export class ModelLoader {
    private static loader = new GLTFLoader();

    /**
     * Loads a model, caches it, and reports progress.
     */
    public static async loadModel(
        path: string,
        name: ModelName,
        onProgress?: (modelName: ModelName, percent: number) => void
    ): Promise<GLTF> {
        if (modelCache.has(name)) {
            return modelCache.get(name)!;
        }

        return new Promise((resolve, reject) => {
            ModelLoader.loader.load(
                path,
                (gltf) => {
                    modelCache.set(name, gltf);
                    resolve(gltf);
                },
                (xhr) => {
                    if (xhr.total > 0 && onProgress) {
                        const pct = (xhr.loaded / xhr.total) * 100;
                        onProgress(name, pct);
                    }
                },
                (error) => reject(error)
            );
        });
    }

    /**
     * Returns a deep clone of a cached model with **unique material instances**.
     * This prevents all clones from sharing the same material reference, so
     * selection highlighting or emissive changes only affect one piece.
     */
    public static async getModelClone(
        modelName: ModelName
    ): Promise<THREE.Object3D> {
        const gltf = modelCache.get(modelName);
        if (!gltf) {
            throw new Error(`Model "${modelName}" not loaded yet.`);
        }

        // Deep clone the scene
        const clone = gltf.scene.clone(true);

        // IMPORTANT: clone materials independently so each instance is unique
        clone.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                const mat = mesh.material;
                if (Array.isArray(mat)) {
                    mesh.material = mat.map((m) => m.clone());
                } else if (mat) {
                    mesh.material = mat.clone();
                }
            }
        });

        return clone;
    }
}