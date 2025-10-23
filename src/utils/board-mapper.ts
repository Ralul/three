/**
 * Converts a Three.js position on the board plane into a chessboard coordinate (like "e4").
 * Assumes (0,0) is center and +z points toward rank 8.
 */
export function getBoardSquareFromCoords(point: THREE.Vector3): string | null {
    const squareSize = 1; // must match your modeled board scale

    const halfBoard = 4 * squareSize;
    const x = point.x + halfBoard;
    const z = halfBoard - point.z;

    const fileIndex = Math.floor(z / squareSize);
    const rankIndex = Math.floor(x / squareSize);

    if (fileIndex < 0 || fileIndex > 7 || rankIndex < 0 || rankIndex > 7) {
        return null; // outside board
    }

    const file = String.fromCharCode('h'.charCodeAt(0) - fileIndex);
    const rank = (rankIndex + 1).toString();

    return `${file}${rank}`;
}