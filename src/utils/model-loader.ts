import * as THREE from 'three';
import {type GLTF, GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import type {ModelName} from '../types/model-name.ts';

const modelCache: Map<ModelName, GLTF> = new Map();

export class ModelLoader {
    private static loader = new GLTFLoader();

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

    public static async getModelClone(modelName: ModelName): Promise<THREE.Object3D> {
        const gltf = modelCache.get(modelName);
        if (!gltf) {
            throw new Error(`Model "${modelName}" not loaded yet.`);
        }
        return gltf.scene.clone(true);
    }
}