import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";


//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

let scene, renderer;
let perspectiveCamera, controls;

const COLORS = {
    blue: {
      light: 'lightblue',
      normal: 'blue',
      dark: 'darkblue'
    },
    red: {
      light: 'lightcoral',
      normal: 'firebrick',
      dark: 'darkred'
    },
    grey: {
      light: 'lightgray',
      normal: 'gray',
      dark: 'dimgray'
    },
    yellow: {
      light: 'lightyellow',
      normal: 'yellow',
      dark: 'goldenrod'
    },
    black: {
      tire: '#111111',   // Very dark gray, good for tires
      dark: '#222222',   // Slightly lighter
      normal: '#333333', // Still dark but visibly lighter
      light: '#555555'   // Charcoal-like
    }
};

let wheelMaterial = new THREE.MeshBasicMaterial({ color: COLORS.black.tire });
let eyeMaterial = new THREE.MeshBasicMaterial({ color: COLORS.blue.light });
let darkRedMaterial = new THREE.MeshBasicMaterial({ color: COLORS.red.dark });
let lightRedMaterial = new THREE.MeshBasicMaterial({ color: COLORS.red.light });
let redMaterial = new THREE.MeshBasicMaterial({ color: COLORS.red.normal });
let darkBlueMaterial = new THREE.MeshBasicMaterial({ color: COLORS.blue.dark });
let yellowMaterial = new THREE.MeshBasicMaterial({ color: COLORS.yellow.normal });
let lightYellowMaterial = new THREE.MeshBasicMaterial({ color: COLORS.yellow.light });
let lightGreyMaterial = new THREE.MeshBasicMaterial({ color: COLORS.grey.light });
let greyMaterial = new THREE.MeshBasicMaterial({ color: COLORS.grey.normal });
let darkGreyMaterial = new THREE.MeshBasicMaterial({ color: COLORS.grey.dark });

let materialList = [
    wheelMaterial,
    eyeMaterial,
    darkRedMaterial,
    lightRedMaterial,
    redMaterial,
    darkBlueMaterial,
    yellowMaterial,
    lightYellowMaterial,
    lightGreyMaterial,
    greyMaterial,
    darkGreyMaterial,
];

/////////////////////
/* CREATE SCENE(S) */
/////////////////////

function createScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xb0fcff);

    // Axes Helper
    scene.add(new THREE.AxesHelper(10));
}

/////////////////////
/* CREATE CAMERA(S)  */
/////////////////////
function createCameras() {
    const aspect = window.innerWidth / window.innerHeight;
    perspectiveCamera = new THREE.PerspectiveCamera(75, aspect, 0.1, 2000);
    perspectiveCamera.position.set(250, 250, 250);
}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function createGround(){
    const groundGeometry = new THREE.PlaneGeometry(1000, 1000, 100, 100);   
    let heightMap = new THREE.TextureLoader().load('../heightmap.png');
    heightMap.wrapS = heightMap.wrapT = THREE.RepeatWrapping;
    const groundMaterial = new THREE.MeshStandardMaterial({
        color: COLORS.red.normal,
        wireframe: true,
        displacementMap: heightMap,
        displacementScale: 100
    });

    let groundMesh = new THREE.Mesh(groundGeometry, groundMaterial)
    groundMesh.castShadow = true;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -60;
}

function createSkyDome(){
    const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
    const skyMaterial = new THREE.MeshBasicMaterial({
        color: COLORS.blue.dark,
        side: THREE.BackSide
    });

    const skyDome = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(skyDome);
}

function createMoon(){
    const moonGeometry = new THREE.SphereGeometry(50, 32, 32);
    const moonMaterial = new THREE.MeshStandardMaterial({
        color: COLORS.grey.light,
        emissive: 'white',
        emissiveIntensity: 5
    });

    const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
    moonMesh.position.set(200, 300, -200);
    scene.add(moonMesh);
}

function createGlobalLight() {
    const globalLight = new THREE.DirectionalLight(0xffffff, 2);
    globalLight.position.set(200, 300, -200);
    globalLight.lookAt(new THREE.Vector3(0, 0, 0));
    globalLight.castShadow = true;
    scene.add(globalLight);
};


//////////////////////
/* CHECK COLLISIONS */
//////////////////////

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////


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
    createGround();
    createCameras();
    createSkyDome();
    createMoon();
    createGlobalLight();

    controls = new OrbitControls(perspectiveCamera, renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);
}


/////////////
/* DISPLAY */
/////////////
function render() {
    renderer.render(scene, perspectiveCamera);
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
}

/////////////////////
/* CAMERA SWITCHING */
/////////////////////
function onKeyDown(event) {
}

function onKeyUp(event) {
}

init();
animate();
