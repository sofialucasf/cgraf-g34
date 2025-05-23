import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";


//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

let scene, renderer;
let topCamera, frontCamera, sideCamera, perspectiveCamera;
let activeCamera;
let controls;

let rotatingWaistLeft = false;
let rotatingWaistRight = false;
let lowerBodyPivot;

let feetPivot;
let rotatingFeetUp = false;
let rotatingFeetDown = false;

let headPivot;
let rotatingHeadUp = false;
let rotatingHeadDown = false;

let movingArmsOut = false;
let movingArmsBack = false;
let isWireframe = false;
let isTrailerInColision = false;
let isTrailerConnecting = false;

let movingUp = false;
let movingDown = false;
let movingRight = false;
let movingLeft = false;

const rotationSpeed = 0.03;
const movingSpeed = 0.5;
const WAIST_ROTATION_MIN = -Math.PI / 2;
const WAIST_ROTATION_MAX = 0;
const robotHead = new THREE.Group();  // grupo para o movimento da cabeça
const rightArm = new THREE.Group(); // grupos para o movimento dos braços
const leftArm = new THREE.Group();  //
const lowerBody = new THREE.Group();     // grupo para o movimento das pernas
const robotFeet = new THREE.Group();
const trailer = new THREE.Group();
const restRobot = new THREE.Group();

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

const truckCoordinates = {
    xMin: -30,
    xMax: 30,
    zMin: -110,
    zMax: 70
}

const trailerCoordinates = {
    xMin: -30,
    xMax: 30,
    zMin: -290,
    zMax: -130
}

/////////////////////
/* CREATE SCENE(S) */
/////////////////////

function createScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xb0fcff);

    // Axes Helper
    scene.add(new THREE.AxesHelper(10));
    createRobot();
    createTrailerAll();
}

/////////////////////
/* CREATE CAMERA(S)  */
/////////////////////
function createCameras() {
    const aspect = window.innerWidth / window.innerHeight;

    // Top Camera (Orthographic)
    topCamera = new THREE.OrthographicCamera(
        window.innerWidth / -3, window.innerWidth / 3,
        window.innerHeight / 3, window.innerHeight / -3,
        0.1, 1000
    );
    topCamera.position.set(0, 150, -150);
    topCamera.lookAt(0, 0, -150);

    // Front Camera (Orthographic)
    frontCamera = new THREE.OrthographicCamera(
        window.innerWidth / -5, window.innerWidth / 5,
        window.innerHeight / 5, window.innerHeight / -5,
        0.1, 1000
    );
    frontCamera.position.set(0, 0, 100);
    frontCamera.lookAt(0, 0, 0);

    // Side Camera (Orthographic)
    sideCamera = new THREE.OrthographicCamera(
        window.innerWidth / -5, window.innerWidth / 5,
        window.innerHeight / 5, window.innerHeight / -5,
        0.1, 1000
    );
    sideCamera.position.set(100, 0, -90);
    sideCamera.lookAt(0, 0, -90);

    // Perspective Camera
    perspectiveCamera = new THREE.PerspectiveCamera(70, aspect, 1, 1000);
    perspectiveCamera.position.set(100, 100, 100);
    perspectiveCamera.lookAt(0, 0, 0);

    // Start with Perspective
    activeCamera = perspectiveCamera;
}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function createRobotHead(){
    const head = new THREE.Object3D();
    const geometryHead = new THREE.BoxGeometry(20, 20, 20);
    const cube = new THREE.Mesh(geometryHead, lightGreyMaterial);
    head.position.set(0, 30, -40);

    const geometryEye = new THREE.BoxGeometry(3, 3, 1);
    const eye1 = new THREE.Mesh(geometryEye, eyeMaterial);
    eye1.position.set(4, -2, -10);

    const eye2 = new THREE.Mesh(geometryEye, eyeMaterial);
    eye2.position.set(-4, -2, -10);

    const geometryAntenna = new THREE.CylinderGeometry(0.5, 0.5, 8, 32);
    const geometryAntennaSphere = new THREE.SphereGeometry(1, 32, 32);

    const antenna1 = new THREE.Mesh(geometryAntenna, darkRedMaterial);
    antenna1.position.set(5, -12, 0);
    const antenna1Sphere = new THREE.Mesh(geometryAntennaSphere, darkRedMaterial);
    antenna1Sphere.position.set(5, -16, 0);

    const antenna2 = new THREE.Mesh(geometryAntenna, darkRedMaterial);
    antenna2.position.set(-5, -12, 0);
    const antenna2Sphere = new THREE.Mesh(geometryAntennaSphere, darkRedMaterial);
    antenna2Sphere.position.set(-5, -16, 0);

    head.add(cube);
    head.add(eye1);
    head.add(eye2);
    head.add(antenna1);
    head.add(antenna2);
    head.add(antenna1Sphere);
    head.add(antenna2Sphere);
    robotHead.add(head);
    scene.add(robotHead);
    headPivot = new THREE.Object3D();
    scene.add(headPivot);
    headPivot.position.set(0, 40, -20);
    head.position.set(0, 30-40, -40 + 20);
    headPivot.add(head);
}

function createRightArm(){
    const arm = new THREE.Object3D();
    const geoArm= new THREE.BoxGeometry(20 - 0.1, 30 - 0.1, 20 - 0.1);
    const cube = new THREE.Mesh(geoArm, darkBlueMaterial);
    cube.position.set(-20,25, -20);

    arm.add(cube);
    rightArm.add(arm);
    scene.add(rightArm);
}

function createRightForearm(){
    const arm = new THREE.Object3D();
    const geoArm= new THREE.BoxGeometry(20, 20, 60);
    const cube = new THREE.Mesh(geoArm, darkBlueMaterial);
    cube.position.set(-20,0, 0);

    const geoLight = new THREE.BoxGeometry(5, 2.5, 1);
    const light = new THREE.Mesh(geoLight, yellowMaterial);
    light.position.set(0, 0, 30);

    const geoDecor = new THREE.BoxGeometry(20, 1, 1);
    const decor = new THREE.Mesh(geoDecor, darkRedMaterial);
    decor.position.set(0, 10, 30);

    cube.add(light);
    cube.add(decor);
    arm.add(cube);

    rightArm.add(arm);
    scene.add(rightArm);

}

function createLeftArm(){
    const arm = new THREE.Object3D();
    const geoArm= new THREE.BoxGeometry(20 - 0.1, 30 - 0.1, 20 - 0.1);
    const cube = new THREE.Mesh(geoArm, darkBlueMaterial);
    cube.position.set(20,25, -20);

    arm.add(cube);

    leftArm.add(arm);
    scene.add(leftArm);

}

function createLeftForearm(){
    const arm = new THREE.Object3D();
    const geoArm= new THREE.BoxGeometry(20, 20, 60);
    const cube = new THREE.Mesh(geoArm, darkBlueMaterial);
    cube.position.set(20,0, 0);

    const geoLight = new THREE.BoxGeometry(5, 2.5, 1);
    const light = new THREE.Mesh(geoLight, yellowMaterial);
    light.position.set(0, 0, 30);

    const geoDecor = new THREE.BoxGeometry(20, 1, 1);
    const decor = new THREE.Mesh(geoDecor, darkRedMaterial);
    decor.position.set(0, 10, 30);

    cube.add(light);
    cube.add(decor);
    arm.add(cube);

    leftArm.add(arm);
    scene.add(leftArm);
}

function createAbdomen(){
    const abdomen = new THREE.Object3D();
    const geoAbdomen= new THREE.BoxGeometry(20, 20, 60);
    const cube = new THREE.Mesh(geoAbdomen, lightGreyMaterial);
    cube.position.set(0,0, 0);

    const geoDecor = new THREE.BoxGeometry(20, 1, 1);
    const decor = new THREE.Mesh(geoDecor, darkGreyMaterial);
    decor.position.set(0, 10, 30);

    cube.add(decor);
    abdomen.add(cube);
    restRobot.add(abdomen);
}

function createChest(){
    const chest = new THREE.Object3D();
    const geoChest= new THREE.BoxGeometry(60, 30, 40);
    const cube = new THREE.Mesh(geoChest, redMaterial);
    cube.position.set(0,25, 10);

    const geoWindow1 = new THREE.BoxGeometry(25, 20, 1);
    const Window1 = new THREE.Mesh(geoWindow1, lightYellowMaterial);
    Window1.position.set(-15, 0, 20);

    const geoWindow2 = new THREE.BoxGeometry(25, 20, 1);
    const Window2 = new THREE.Mesh(geoWindow2, lightYellowMaterial);
    Window2.position.set(15, 0, 20);

    cube.add(Window1);
    cube.add(Window2);
    chest.add(cube);
    restRobot.add(chest);
}

function createHeadplacer(){
    const arm = new THREE.Object3D();
    const geoArm= new THREE.BoxGeometry(20, 30, 20);
    const cube = new THREE.Mesh(geoArm, redMaterial);
    cube.position.set(0,25, -20);

    arm.add(cube);
    restRobot.add(arm);

}

let waistObj = null;
function createWaist(){
    const waist = new THREE.Object3D();
    const geoWaist= new THREE.BoxGeometry(60, 10, 60);
    const cube = new THREE.Mesh(geoWaist, lightGreyMaterial);
    cube.position.set(0,-15, 0);

    const geoWheel = new THREE.CylinderGeometry(10, 10, 5, 32); 
    const wheelLeft = new THREE.Mesh(geoWheel, wheelMaterial);
    wheelLeft.rotation.z = Math.PI / 2; // Rotate so the wheel lies flat
    wheelLeft.position.set(-30, -20, 20); 
    

    const wheelRight = new THREE.Mesh(geoWheel, wheelMaterial);
    wheelRight.rotation.z = Math.PI / 2;
    wheelRight.position.set(30, -20, 20);
    
    waist.add(wheelLeft);
    waist.add(wheelRight);

    waist.add(cube);
    restRobot.add(waist);
    scene.add(restRobot);

    waistObj = waist;
}

function createLeftThigh(){
    const waist = new THREE.Object3D();
    const geoWaist= new THREE.BoxGeometry(27 - 0.1, 30 - 0.1, 30 - 0.1);
    const cube = new THREE.Mesh(geoWaist, darkBlueMaterial);
    cube.position.set(15,-5, -45);

    waist.add(cube);
    lowerBody.add(waist);
}

function createRightThigh(){
    const waist = new THREE.Object3D();
    const geoWaist= new THREE.BoxGeometry(27 - 0.1, 30 - 0.1, 30 - 0.1);
    const cube = new THREE.Mesh(geoWaist, darkBlueMaterial);
    cube.position.set(-15,-5, -45);

    waist.add(cube);
    lowerBody.add(waist);
}

function createLeftCalf(){
    const waist = new THREE.Object3D();
    const geoWaist= new THREE.BoxGeometry(25, 25, 70);
    const cube = new THREE.Mesh(geoWaist, redMaterial);
    cube.position.set(15,-5, -95);

    const geoWheel = new THREE.CylinderGeometry(10, 10, 5, 32);
    const backWheel = new THREE.Mesh(geoWheel, wheelMaterial);
    backWheel.rotation.z = Math.PI / 2; // Rotate so the wheel lies flat
    backWheel.position.set(30, -20, -115); 
    

    const frontWheel = new THREE.Mesh(geoWheel, wheelMaterial);
    frontWheel.rotation.z = Math.PI / 2;
    frontWheel.position.set(30, -20, -90);
    
    waist.add(backWheel);
    waist.add(frontWheel);

    waist.add(cube);
    lowerBody.add(waist);
}

function createRightCalf(){
    const waist = new THREE.Object3D();
    const geoWaist= new THREE.BoxGeometry(25, 25, 70);
    const cube = new THREE.Mesh(geoWaist, redMaterial);
    cube.position.set(-15,-5, -95);

    const geoWheel = new THREE.CylinderGeometry(10, 10, 5, 32);    
    const backWheel = new THREE.Mesh(geoWheel, wheelMaterial);
    backWheel.rotation.z = Math.PI / 2; // Rotate so the wheel lies flat
    backWheel.position.set(-30, -20, -115); 
    

    const frontWheel = new THREE.Mesh(geoWheel, wheelMaterial);
    frontWheel.rotation.z = Math.PI / 2;
    frontWheel.position.set(-30, -20, -90);
    
    waist.add(backWheel);
    waist.add(frontWheel);


    waist.add(cube);
    lowerBody.add(waist);
}

function createLowerBody(){
    createRightThigh();
    createLeftThigh();
    createRightCalf();
    createLeftCalf();
    createFeet();
    scene.add(lowerBody);
    lowerBodyPivot = new THREE.Object3D();
    scene.add(lowerBodyPivot);
    lowerBodyPivot.position.set(0, 5, -5);
    lowerBody.position.set(0, -5, 5);
    lowerBodyPivot.add(lowerBody);
}

function createFeet(){

    const rightFoot = new THREE.Object3D();
    const leftFoot = new THREE.Object3D();

    const geoFeet= new THREE.BoxGeometry(25 - 0.1, 25 - 0.1, 10 - 0.1);
    const rf = new THREE.Mesh(geoFeet, darkBlueMaterial);
    const lf = new THREE.Mesh(geoFeet, darkBlueMaterial);

    rf.position.set(15,-5, -135);
    lf.position.set(-15,-5, -135);


    robotFeet.add(rf);
    robotFeet.add(lf);
    lowerBody.add(robotFeet);
    feetPivot = new THREE.Object3D();
    scene.add(feetPivot);
    feetPivot.position.set(0, -15, -130);
    robotFeet.position.set(0, 15, 130);
    feetPivot.add(robotFeet);
    lowerBody.add(feetPivot);
}

function createTrailer(){
    const geotrailer= new THREE.BoxGeometry(60, 60, 160);
    const cube = new THREE.Mesh(geotrailer, greyMaterial);
    cube.position.set(0,40, -250);

    const connection = new THREE.Object3D();
    const geoConnection= new THREE.BoxGeometry(60, 10, 10);
    const c = new THREE.Mesh(geoConnection, darkBlueMaterial);
    c.position.set(0,15, -165);

    scene.add(trailer);
    trailer.add(cube);
    trailer.add(c);
}

function createTrailerCar(){
    const geotrailer= new THREE.BoxGeometry(60, 30, 80);
    const cube = new THREE.Mesh(geotrailer, lightRedMaterial);
    cube.position.set(0,-5, -290);

    const geoWheel = new THREE.CylinderGeometry(10, 10, 5, 32);    
    const backWheel = new THREE.Mesh(geoWheel, wheelMaterial);
    backWheel.rotation.z = Math.PI / 2; // Rotate so the wheel lies flat
    backWheel.position.set(30, -20, -315); 
    

    const frontWheel = new THREE.Mesh(geoWheel, wheelMaterial);
    frontWheel.rotation.z = Math.PI / 2;
    frontWheel.position.set(30, -20, -290);
    
    trailer.add(backWheel);
    trailer.add(frontWheel);

    const backWheel2 = new THREE.Mesh(geoWheel, wheelMaterial);
    backWheel2.rotation.z = Math.PI / 2; // Rotate so the wheel lies flat
    backWheel2.position.set(-30, -20, -315); 
    

    const frontWheel2 = new THREE.Mesh(geoWheel, wheelMaterial);
    frontWheel2.rotation.z = Math.PI / 2;
    frontWheel2.position.set(-30, -20, -290);
    
    trailer.add(backWheel2);
    trailer.add(frontWheel2);

    scene.add(trailer);
    trailer.add(cube);
}


function createRobot(){

    createRobotHead();
    createRightArm();
    createRightForearm();
    createLeftArm();
    createLeftForearm();
    createAbdomen();
    createChest();
    createHeadplacer();
    createWaist();
    createLowerBody();
}

function createTrailerAll(){
    createTrailer();
    createTrailerCar();
}

//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions() {
    let newMaxX;
    let newMaxZ;
    let newMinX;
    let newMinZ;
    if (!isTruckMode()){ return false;}

    newMaxX = trailer.position.x + trailerCoordinates.xMax;
    newMaxZ = trailer.position.z + trailerCoordinates.zMax;
    newMinX = trailer.position.x + trailerCoordinates.xMin;
    newMinZ = trailer.position.z + trailerCoordinates.zMin;
    return (
        newMaxX >= truckCoordinates.xMin &&
        newMinX <= truckCoordinates.xMax &&
        newMaxZ >= truckCoordinates.zMin &&
        newMinZ <= truckCoordinates.zMax
    );
}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions() {
    if (trailer.position.x > 0) {
        trailer.position.x = Math.max(trailer.position.x - movingSpeed, 0);
    }
    if (trailer.position.x < 0) {
        trailer.position.x = Math.min(trailer.position.x + movingSpeed, 0);
    }
    if (trailer.position.z > 110) {
        trailer.position.z = Math.max(trailer.position.z - movingSpeed, 110);
    }
    if (trailer.position.z < 110) {
        trailer.position.z = Math.min(trailer.position.z + movingSpeed, 110);
    }

}

////////////
/* UPDATE */
////////////
function update() {
    controls.update();
    
    if(!isTrailerConnecting){

        if (lowerBodyPivot) {
            if (rotatingWaistLeft) {
                lowerBodyPivot.rotation.x = Math.min(lowerBodyPivot.rotation.x + rotationSpeed, WAIST_ROTATION_MAX);
            }
            if (rotatingWaistRight) {
                lowerBodyPivot.rotation.x = Math.max(lowerBodyPivot.rotation.x - rotationSpeed, WAIST_ROTATION_MIN);
            }
        }
        if (feetPivot) {
            if (rotatingFeetUp) {
                feetPivot.rotation.x = Math.min(feetPivot.rotation.x + rotationSpeed, 0);
            }
            if (rotatingFeetDown) {
                feetPivot.rotation.x = Math.max(feetPivot.rotation.x - rotationSpeed, -Math.PI);
            }
        }
        if (headPivot) {
            if (rotatingHeadUp) {
                headPivot.rotation.x = Math.max(headPivot.rotation.x - rotationSpeed, 0);
            }
            if (rotatingHeadDown) {
                headPivot.rotation.x = Math.min(headPivot.rotation.x + rotationSpeed, Math.PI);
            }
        }
        if(rightArm && leftArm){
            if (movingArmsOut) {
                rightArm.position.z = Math.min(rightArm.position.z + movingSpeed, 20);
                rightArm.position.x = Math.max(rightArm.position.x - movingSpeed, -20);
                leftArm.position.z = Math.min(leftArm.position.z + movingSpeed, 20);
                leftArm.position.x = Math.min(leftArm.position.x + movingSpeed, 20);
            }
            if (movingArmsBack) {
                rightArm.position.z = Math.max(rightArm.position.z - movingSpeed, 0);
                rightArm.position.x = Math.min(rightArm.position.x + movingSpeed, 0);
                leftArm.position.z = Math.max(leftArm.position.z - movingSpeed, 0);
                leftArm.position.x = Math.max(leftArm.position.x - movingSpeed, 0);
            }
        }
        
        if(trailer){
            const diagSpeed = movingSpeed / Math.sqrt(2);
            if (movingUp && movingRight && !movingDown && !movingLeft) {
                trailer.position.x -= diagSpeed;
                trailer.position.z += diagSpeed;
            }
            else if (movingUp && movingLeft && !movingDown && !movingRight) {
                trailer.position.x += diagSpeed;
                trailer.position.z += diagSpeed;
            }
            else if (movingDown && movingRight && !movingUp && !movingLeft) {
                trailer.position.x -= diagSpeed;
                trailer.position.z -= diagSpeed;
            }
            else if (movingDown && movingLeft && !movingUp && !movingRight) {
                trailer.position.x += diagSpeed;
                trailer.position.z -= diagSpeed;
            }
            else if (movingUp && !movingRight && !movingLeft && !movingDown) {
                trailer.position.z += movingSpeed;
            }
            else if (movingDown && !movingRight && !movingLeft && !movingUp) {
                trailer.position.z -= movingSpeed;
            }
            else if (movingRight && !movingUp && !movingDown && !movingLeft) {
                trailer.position.x -= movingSpeed;
            }
            else if (movingLeft && !movingUp && !movingDown && !movingRight) {
                trailer.position.x += movingSpeed;
            }
        }
        
    }

    if (checkCollisions() && !isTrailerConnecting && !isTrailerInColision) {
        isTrailerConnecting = true;
    }
    
    else if (trailer.position.x == 0 && trailer.position.z == 110) { // trailer está na posição de reposo
        isTrailerInColision = true;
        isTrailerConnecting = false;
    }
            
    else if (!checkCollisions() && isTrailerInColision && !isTrailerConnecting) { 
        isTrailerInColision = false;
    }

    else if (isTrailerConnecting) {
        handleCollisions();
    }



}

function isTruckMode(){
    return lowerBodyPivot.rotation.x == WAIST_ROTATION_MAX && feetPivot.rotation.x == 0 &&
            headPivot.rotation.x == 0 && leftArm.position.z == 0 && rightArm.position.z == 0;
}

function toggleWireframe() {
    materialList.forEach(material => {
        if (Array.isArray(material)) {
            material.forEach(mat => mat.wireframe = !mat.wireframe);
        } else {
            material.wireframe = !material.wireframe;
        }
    });
    isWireframe = !isWireframe;
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
    window.addEventListener('keyup', onKeyUp, false);
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
         case 'w':
            rotatingWaistLeft = true;
            break;
        case 's':
            rotatingWaistRight = true;
            break;
        case 'q':
            rotatingFeetUp = true;
            break;
        case 'a':
            rotatingFeetDown = true;
            break;
        case 'r':
            rotatingHeadUp = true;
            break;
        case 'f':
            rotatingHeadDown = true;
            break;
        case 'e':
            movingArmsBack = true;
            break;
        case 'd':
            movingArmsOut = true;
            break;
        case 'arrowup':
            movingUp = true;
            break;
        case 'arrowdown':
            movingDown = true;
            break;
        case 'arrowleft':
            movingLeft = true;
            break;
        case 'arrowright':
            movingRight = true;
            break;
        case '7':
            isWireframe = !isWireframe;
            toggleWireframe();
            break;
    }
}

function onKeyUp(event) {
    switch (event.key.toLowerCase()) {
        case 'w':
            rotatingWaistLeft = false;
            break;
        case 's':
            rotatingWaistRight = false;
            break;
        case 'q':
            rotatingFeetUp = false;
            break;
        case 'a':
            rotatingFeetDown = false;
            break;
        case 'r':
            rotatingHeadUp = false;
            break;
        case 'f':
            rotatingHeadDown = false;
            break;
        case 'e':
            movingArmsBack = false;
            break;
        case 'd':
            movingArmsOut = false;
            break;
        case 'arrowup':
            movingUp = false;
            break;
        case 'arrowdown':
            movingDown = false;
            break;
        case 'arrowleft':
            movingLeft = false;
            break;
        case 'arrowright':
            movingRight = false;
            break;
    }
}

init();
animate();
