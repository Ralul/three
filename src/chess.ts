import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {ModelLoader} from './utils/model-loader.ts';
import {ModelName} from './types/model-name.ts';
import {Board} from "./models/board.ts";
import {FenLoader} from "./fen-loader.ts";

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

let totalModels = modelEntries.length;
const progressMap: Record<string, number> = {};

function logProgress() {
    const totalProgress =
        Object.values(progressMap).reduce((a, b) => a + b, 0) / totalModels;
    console.log(`Loading progress: ${totalProgress.toFixed(2)}%`);
}

// --- Load all models ---
await Promise.all(
    modelEntries.map(([path, name]) =>
        ModelLoader.loadModel(path, name, (modelName, pct) => {
            progressMap[modelName] = pct;
            logProgress();
        })
    )
);

console.log('All models loaded');


// Create Board
const board = new Board();
await board.load();
board.setPosition(0,0,0);
scene.add(board.mesh)

await FenLoader.load(board, scene, "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR")

// --- SETUP FOR CLICK DETECTION ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Keep track of clickable meshes
const clickableMeshes: THREE.Object3D[] = [];

// Animate
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const dt = clock.getDelta();

    //blackKing.update(dt);

    controls.update();
    renderer.render(scene, camera);
}

animate();

// Handle click
window.addEventListener('click', (event) => {
    // Convert mouse position to normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster
    raycaster.setFromCamera(mouse, camera);

    // Compute intersections with your pieces
    const intersects = raycaster.intersectObjects(clickableMeshes, true);

    if (intersects.length > 0) {
        const firstHit = intersects[0].object;
        console.log('Clicked on piece:', firstHit);
        console.log('Parent piece object:', firstHit.parent);

        // Optionally: highlight or mark it as selected
        if (firstHit.parent === blackKing.mesh) {
            console.log('You clicked the Black King!');
        } else if (firstHit.parent === whiteQueen.mesh) {
            console.log('You clicked the White Queen!');
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