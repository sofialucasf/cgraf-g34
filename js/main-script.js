import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";


//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

let scene, renderer;
let topCamera, frontCamera, sideCamera, perspectiveCamera;
let activeCamera;
let controls;

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xb0fcff);

    // Axes Helper
    scene.add(new THREE.AxesHelper(10));

    createRobotHead();

}

/////////////////////
/* CREATE CAMERA(S)  */
/////////////////////
function createCameras() {
    const aspect = window.innerWidth / window.innerHeight;

    // Top Camera (Orthographic)
    topCamera = new THREE.OrthographicCamera(
        window.innerWidth / -15, window.innerWidth / 15,
        window.innerHeight / 15, window.innerHeight / -15,
        1, 1000
    );
    topCamera.position.set(0, 50, 0);
    topCamera.lookAt(0, 0, 0);

    // Front Camera (Orthographic)
    frontCamera = new THREE.OrthographicCamera(
        window.innerWidth / -15, window.innerWidth / 15,
        window.innerHeight / 15, window.innerHeight / -15,
        1, 1000
    );
    frontCamera.position.set(0, 0, 50);
    frontCamera.lookAt(0, 0, 0);

    // Side Camera (Orthographic)
    sideCamera = new THREE.OrthographicCamera(
        window.innerWidth / -15, window.innerWidth / 15,
        window.innerHeight / 15, window.innerHeight / -15,
        1, 1000
    );
    sideCamera.position.set(50, 0, 0);
    sideCamera.lookAt(0, 0, 0);

    // Perspective Camera
    perspectiveCamera = new THREE.PerspectiveCamera(70, aspect, 1, 1000);
    perspectiveCamera.position.set(50, 50, 50);
    perspectiveCamera.lookAt(0, 0, 0);

    // Start with Perspective
    activeCamera = perspectiveCamera;
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////


////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function createRobotHead(){
    const head = new THREE.Object3D();
    const geometryHead = new THREE.BoxGeometry(10, 10, 10);
    const material = new THREE.MeshBasicMaterial({ color: 0xdddddd});
    const cube = new THREE.Mesh(geometryHead, material);
    const geometryEye = new THREE.BoxGeometry(1, 1, 1);
    const materialEye = new THREE.MeshBasicMaterial({ color: 0x21b7fc});
    const eye1 = new THREE.Mesh(geometryEye, materialEye);
    eye1.position.set(2, 2, 5);
    const eye2 = new THREE.Mesh(geometryEye, materialEye);
    eye2.position.set(-2, 2, 5);
    head.add(cube);
    head.add(eye1);
    head.add(eye2);
    scene.add(head);
}

//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions() {}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions() {}

////////////
/* UPDATE */
////////////
function update() {
    controls.update();
}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createScene();
    createCameras();

    controls = new OrbitControls(perspectiveCamera, renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('keydown', onKeyDown, false);
}


/////////////
/* DISPLAY */
/////////////
function render() {
    renderer.render(scene, activeCamera);
}

/////////////////////
/* RENDER & ANIMATE */
/////////////////////
function animate() {
    update();
    render();
    requestAnimationFrame(animate);
}

/////////////////////
/* RESIZE HANDLER  */
/////////////////////
function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);

    const aspect = window.innerWidth / window.innerHeight;

    perspectiveCamera.aspect = aspect;
    perspectiveCamera.updateProjectionMatrix();

    [topCamera, frontCamera, sideCamera].forEach(cam => {
        cam.left = window.innerWidth / -2;
        cam.right = window.innerWidth / 2;
        cam.top = window.innerHeight / 2;
        cam.bottom = window.innerHeight / -2;
        cam.updateProjectionMatrix();
    });
}

/////////////////////
/* CAMERA SWITCHING */
/////////////////////
function onKeyDown(event) {
    switch (event.key.toLowerCase()) {
        case '1':
            activeCamera = frontCamera;
            break;
        case '2':
            activeCamera = sideCamera;
            break;
        case '3':
            activeCamera = topCamera;
            break;
        case '4':
            activeCamera = perspectiveCamera;
            break;
    }
}

init();
animate();
