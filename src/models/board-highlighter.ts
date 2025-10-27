import * as THREE from "three";
import { GRID_INTERVAL, GRID_OFFSET_X, GRID_OFFSET_Z } from "../const/space-offsets.ts";
import type { ChessPos } from "../types/chess-pos.ts";

/**
 * Creates flat transparent highlight squares overlaying the board.
 */
export class BoardHighlighter {
    private _mesh = new THREE.Object3D();
    private _grid: THREE.Mesh[][] = [];

    private _highlightColor = new THREE.Color(0xffff44);
    private _inactiveColor = new THREE.Color(0x000000);

    constructor() {
        // Create a circular geometry slightly smaller than the square size
        const circleRadius = GRID_INTERVAL * 0.35; // fits nicely in each cell
        const circleGeo = new THREE.CircleGeometry(circleRadius, 32);

        for (let row = 0; row < 8; row++) {
            const rowMeshes: THREE.Mesh[] = [];
            for (let col = 0; col < 8; col++) {
                const mat = new THREE.MeshBasicMaterial({
                    color: this._inactiveColor,
                    transparent: true,
                    opacity: 0,
                    depthWrite: false,
                });

                const circle = new THREE.Mesh(circleGeo, mat);
                circle.rotation.x = -Math.PI / 2;
                circle.position.set(
                    row * GRID_INTERVAL + GRID_OFFSET_X -0.05,
                    0.33, // slightly above the board
                    col * GRID_INTERVAL + GRID_OFFSET_Z +0.05
                );

                this._mesh.add(circle);
                rowMeshes.push(circle);
            }
            this._grid.push(rowMeshes);
        }
    }

    get mesh(): THREE.Object3D {
        return this._mesh;
    }

    /**
     * Highlight a specific square.
     */
    public highlight(pos: ChessPos, color = this._highlightColor): void {
        const square = this._grid[pos.row]?.[pos.col];
        if (!square) return;
        const mat = square.material as THREE.MeshBasicMaterial;
        mat.color.copy(color);
        mat.opacity = 0.35;
    }

    /**
     * Clear highlight from a specific square.
     */
    public clear(pos: ChessPos): void {
        const square = this._grid[pos.row]?.[pos.col];
        if (!square) return;
        const mat = square.material as THREE.MeshBasicMaterial;
        mat.opacity = 0;
    }

    /**
     * Clear all highlights.
     */
    public clearAll(): void {
        for (const row of this._grid) {
            for (const square of row) {
                const mat = square.material as THREE.MeshBasicMaterial;
                mat.opacity = 0;
            }
        }
    }
}