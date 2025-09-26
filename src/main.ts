import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import {Sphere} from './models/sphere.ts'
import {Cube} from "./models/cube.ts";
import {ControllableCamera} from "./models/controllableCamera.ts";
import {Cow} from "./models/cow.ts";


// Create a scene
const scene = new THREE.Scene();

// Create a controllableCamera
const controllableCamera = new ControllableCamera({ x: 0, y: 0, z: 5 });

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create Physics World
const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.82, 0), // m/s²
})

// Add lights (optional for mesh material to look good)
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

// --- create a Sphere instance ---
const sphere = new Sphere(1, 1, { x: 0, y: 5, z: 0 }, 0x00ff00);
scene.add(sphere.mesh)
world.addBody(sphere.body);

// --- create a Cube instance ---
const cube = new Cube(5, 0, { x: 0, y: -5, z: 0 }, 0xff0000);
scene.add(cube.mesh);
world.addBody(cube.body);


const cow = new Cow({ x: 0, y: -5, z: 0 }, scene);

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    world.fixedStep()
    sphere.updateFromPhysics();
    cube.updateFromPhysics();

    renderer.render(scene, controllableCamera.camera);

    controllableCamera.update();
}

animate();

// Handle resize
window.addEventListener('resize', () => {
    controllableCamera.camera.aspect = window.innerWidth / window.innerHeight
    controllableCamera.camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})

// Handle keyboard inputs
window.addEventListener('keydown', (event) => {
    controllableCamera.keyState[event.code] = true;
})

window.addEventListener('keyup', (event) => {
    controllableCamera.keyState[event.code] = false;
})

window.addEventListener('mousedown', (event) => {
    controllableCamera.mouseState[event.button] = true;
})

window.addEventListener('mouseup', (event) => {
    controllableCamera.mouseState[event.button] = false;
})

window.addEventListener('mousemove', (event) => {
    controllableCamera.mouseState['position'] = { x: event.clientX, y: event.clientY };
})

window.addEventListener('contextmenu', (event) => {
    event.preventDefault();
})