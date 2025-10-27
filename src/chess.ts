import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {ModelName} from './types/model-name.ts';
import {Board} from "./models/board.ts";
import {AssetLoader} from "./utils/asset-loader.ts";
import {getBoardSquareFromCoords} from "./utils/board-mapper.ts";
import {fromChessSquare} from "./utils/chess-coordinate-mapper.ts";
import {GameManager} from "./game-manger.ts";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xc6b7a4);

// Camera + renderer
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 2, 5);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 0.5, 0);

// Light
const lightH8 = new THREE.DirectionalLight(0xffffff);
lightH8.position.set(2, 2, 2);
scene.add(lightH8);
const lightH1 = new THREE.DirectionalLight(0xffffff);
lightH1.position.set(-2, 2, 2);
scene.add(lightH1);

const lightA1 = new THREE.DirectionalLight(0xffffff);
lightA1.position.set(-2, 2, -2);
scene.add(lightA1);

const lightA8 = new THREE.DirectionalLight(0xffffff);
lightA8.position.set(2, 2, -2);
scene.add(lightA8);

const modelEntries: [string, ModelName][] = [
    ['/models/black_bishop.gltf', ModelName.BLACK_BISHOP],
    ['/models/black_king.gltf', ModelName.BLACK_KING],
    ['/models/black_knight.gltf', ModelName.BLACK_KNIGHT],
    ['/models/black_pawn_ctrl.gltf', ModelName.BLACK_PAWN_CTRL],
    ['/models/black_pawn_e.gltf', ModelName.BLACK_PAWN_E],
    ['/models/black_pawn_esc.gltf', ModelName.BLACK_PAWN_ESC],
    ['/models/black_pawn_q.gltf', ModelName.BLACK_PAWN_Q],
    ['/models/black_pawn_r.gltf', ModelName.BLACK_PAWN_R],
    ['/models/black_pawn_t.gltf', ModelName.BLACK_PAWN_T],
    ['/models/black_pawn_w.gltf', ModelName.BLACK_PAWN_W],
    ['/models/black_pawn_y.gltf', ModelName.BLACK_PAWN_Y],
    ['/models/black_queen.gltf', ModelName.BLACK_QUEEN],
    ['/models/black_rook.gltf', ModelName.BLACK_ROOK],
    ['/models/board.gltf', ModelName.BOARD],
    ['/models/white_bishop.gltf', ModelName.WHITE_BISHOP],
    ['/models/white_king.gltf', ModelName.WHITE_KING],
    ['/models/white_knight.gltf', ModelName.WHITE_KNIGHT],
    ['/models/white_pawn_ctrl.gltf', ModelName.WHITE_PAWN_CTRL],
    ['/models/white_pawn_e.gltf', ModelName.WHITE_PAWN_E],
    ['/models/white_pawn_esc.gltf', ModelName.WHITE_PAWN_ESC],
    ['/models/white_pawn_q.gltf', ModelName.WHITE_PAWN_Q],
    ['/models/white_pawn_r.gltf', ModelName.WHITE_PAWN_R],
    ['/models/white_pawn_t.gltf', ModelName.WHITE_PAWN_T],
    ['/models/white_pawn_w.gltf', ModelName.WHITE_PAWN_W],
    ['/models/white_pawn_y.gltf', ModelName.WHITE_PAWN_Y],
    ['/models/white_queen.gltf', ModelName.WHITE_QUEEN],
    ['/models/white_rook.gltf', ModelName.WHITE_ROOK],
]

// Create Board
const board = new Board();
board.setPosition(0,0,0);
scene.add(board.mesh)

await AssetLoader.loadAll(
    modelEntries,
    board,
    scene,
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
);

const gameManger = new GameManager(board);

// --- SETUP FOR CLICK DETECTION ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Keep track of clickable meshes
const clickableMeshes: THREE.Object3D[] = board.getAllPieces().map((p) => p.mesh);

function animate() {
    requestAnimationFrame(animate);

    controls.update();
    renderer.render(scene, camera);
}
animate();


const boardSize = 8;
const squareSize = 1;
const boardPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(boardSize * squareSize, boardSize * squareSize),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.0}) // invisible
);
boardPlane.rotation.x = -Math.PI / 2; // make it horizontal
boardPlane.position.y = 0.3
scene.add(boardPlane);


// Handle click
window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const clickable = [...clickableMeshes, boardPlane]

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(clickable, true);

    if (intersects.length > 0) {

        const firstHitObject = intersects[0].object;

        const point = intersects[0].point; // intersection point on the plane
        const boardSquare = getBoardSquareFromCoords(point);

        let current: THREE.Object3D | null = firstHitObject;
        while (current && !current.userData.piece) {
            current = current.parent;
        }

        const piece = current?.userData.piece;
        if (piece) {
            gameManger.userClick(piece.pos)
        }
        if (boardSquare !== null) {
            const pos = fromChessSquare(boardSquare)
            gameManger.userClick(pos)
        }
    } else {
        console.log('Clicked on empty space.');
    }
});

// Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});