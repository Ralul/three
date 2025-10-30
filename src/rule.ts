import * as THREE from "three";
import { ModelName } from "./types/model-name.ts";
import { ModelLoader } from "./utils/model-loader.ts";

function setupSlideshow() {
    const slides = document.getElementsByClassName(
        "slide"
    ) as HTMLCollectionOf<HTMLElement>;
    const btnPrev = document.querySelector<HTMLButtonElement>(
        ".pieces-slider .prev"
    );
    const btnNext = document.querySelector<HTMLButtonElement>(
        ".pieces-slider .next"
    );

    if (!slides || !btnPrev || !btnNext) return;

    let slideIndex = 1;
    showSlides(slideIndex);

    btnPrev.addEventListener("click", () => showSlides(--slideIndex));
    btnNext.addEventListener("click", () => showSlides(++slideIndex));

    function showSlides(n: number) {
        if (n > slides.length) slideIndex = 1;
        if (n < 1) slideIndex = slides.length;

        for (let i = 0; i < slides.length; i++) {
            slides[i].style.visibility = "hidden";
            slides[i].style.opacity = "0";
        }

        slides[slideIndex - 1].style.visibility = "visible";
        slides[slideIndex - 1].style.opacity = "1";
    }
}

setupSlideshow();

async function main() {
    const canvasEntries = {
        bishop: document.querySelector<HTMLCanvasElement>("#canvas-bishop"),
        king: document.querySelector<HTMLCanvasElement>("#canvas-king"),
        knight: document.querySelector<HTMLCanvasElement>("#canvas-knight"),
        pawn: document.querySelector<HTMLCanvasElement>("#canvas-pawn"),
        queen: document.querySelector<HTMLCanvasElement>("#canvas-queen"),
        rook: document.querySelector<HTMLCanvasElement>("#canvas-rook"),
    };


    // Load models first
    const modelEntries: [string, ModelName, keyof typeof canvasEntries][] = [
        ["/models/white_bishop.gltf", ModelName.WHITE_BISHOP, "bishop"],
        ["/models/white_king.gltf", ModelName.WHITE_KING, "king"],
        ["/models/white_knight.gltf", ModelName.WHITE_KNIGHT, "knight"],
        ["/models/white_pawn_esc.gltf", ModelName.WHITE_PAWN_ESC, "pawn"],
        ["/models/white_queen.gltf", ModelName.WHITE_QUEEN, "queen"],
        ["/models/white_rook.gltf", ModelName.WHITE_ROOK, "rook"],
    ];

    // Preload all models
    await Promise.all(
        modelEntries.map(async ([path, name]) => {
            await ModelLoader.loadModel(path, name);
        })
    );

    // Prepare a list of render contexts — one per canvas
    const renderContexts = await Promise.all(
        modelEntries.map(async ([, name, key]) => {
            const canvas = canvasEntries[key];

            const renderer = new THREE.WebGLRenderer({
                antialias: true,
                canvas: canvas!,
                alpha: true,
            });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(canvas!.clientWidth, canvas!.clientHeight, false);

            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0xc6b7a4);

            const camera = new THREE.PerspectiveCamera(
                50,
                canvas!.clientWidth / canvas!.clientHeight,
                0.1,
                100
            );
            camera.position.set(0, 1, 3);

            // Basic lighting
            const light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.set(-1, 2, 4);
            scene.add(light);

            const model = await ModelLoader.getModelClone(name);
            scene.add(model);

            return { renderer, scene, camera, model };
        })
    );

    function render(time: number) {
        time *= 0.001;

        for (const { renderer, scene, camera, model } of renderContexts) {
            const canvas = renderer.domElement;

            if (
                canvas.width !== canvas.clientWidth ||
                canvas.height !== canvas.clientHeight
            ) {
                renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
                camera.aspect = canvas.clientWidth / canvas.clientHeight;
                camera.updateProjectionMatrix();
            }

            model.rotation.y = time * 0.5;
            renderer.render(scene, camera);
        }

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

main();