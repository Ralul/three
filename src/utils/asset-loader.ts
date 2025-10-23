import { ModelLoader } from './model-loader.ts';
import { FenLoader } from './fen-loader.ts';
import { Board } from '../models/board.ts';
import { Scene } from 'three';
import type { ModelName } from '../types/model-name.ts';

export class AssetLoader {
    private static totalTasks = 0;
    private static completedTasks = 0;
    private static onProgress?: (percent: number) => void;

    public static setProgressCallback(cb: (percent: number) => void) {
        this.onProgress = cb;
    }

    private static updateProgress() {
        this.completedTasks++;
        const percent = (this.completedTasks / (this.totalTasks)) * 100;
        if (this.onProgress) this.onProgress(percent);
        console.log(percent.toFixed(2));
    }

    public static async loadAll(
        modelEntries: [string, ModelName][],
        board: Board,
        scene: Scene,
        fen: string
    ): Promise<void> {
        this.totalTasks = modelEntries.length + 1; // +1 for FEN

        // Step 1: Preload all GLTFs
        await Promise.all(
            modelEntries.map(async ([path, name]) => {
                await ModelLoader.loadModel(path, name);
                this.updateProgress();
            })
        );

        // Step 2: Load board (now safe)
        if (board) {
            await board.load();
            board.setPosition(0, 0, 0);
            scene.add(board.mesh);
        }

        // Step 3: Load FEN
        await FenLoader.load(board, scene, fen, () => this.updateProgress());
    }
}