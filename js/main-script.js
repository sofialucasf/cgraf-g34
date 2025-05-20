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
const rotationSpeed = 0.03;
const movingSpeed = 0.2;
const WAIST_ROTATION_MIN = -Math.PI / 2;
const WAIST_ROTATION_MAX = 0;
const robotHead = new THREE.Group();  // grupo para o movimento da cabeça
const rightArm = new THREE.Group(); // grupos para o movimento dos braços
const leftArm = new THREE.Group();  //
const lowerBody = new THREE.Group();     // grupo para o movimento das pernas
const robotFeet = new THREE.Group();

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

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xb0fcff);

    // Axes Helper
    scene.add(new THREE.AxesHelper(10));

    createRobot();
    createFeet();
    createTrailer();
    createTrailerCar();

}

/////////////////////
/* CREATE CAMERA(S)  */
/////////////////////
function createCameras() {
    const aspect = window.innerWidth / window.innerHeight;

    // Top Camera (Orthographic)
    topCamera = new THREE.OrthographicCamera(
        window.innerWidth / -5, window.innerWidth / 5,
        window.innerHeight / 5, window.innerHeight / -5,
        1, 1000
    );
    topCamera.position.set(0, 50, 0);
    topCamera.lookAt(0, 0, 0);

    // Front Camera (Orthographic)
    frontCamera = new THREE.OrthographicCamera(
        window.innerWidth / -5, window.innerWidth / 5,
        window.innerHeight / 5, window.innerHeight / -5,
        1, 1000
    );
    frontCamera.position.set(0, 0, 50);
    frontCamera.lookAt(0, 0, 0);

    // Side Camera (Orthographic)
    sideCamera = new THREE.OrthographicCamera(
        window.innerWidth / -5, window.innerWidth / 5,
        window.innerHeight / 5, window.innerHeight / -5,
        1, 1000
    );
    sideCamera.position.set(50, 0, 0);
    sideCamera.lookAt(0, 0, 0);

    // Perspective Camera
    perspectiveCamera = new THREE.PerspectiveCamera(70, aspect, 1, 1000);
    perspectiveCamera.position.set(100, 100, 100);
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
    const geometryHead = new THREE.BoxGeometry(20, 20, 20);
    const material = new THREE.MeshBasicMaterial({ color: 0xdddddd});
    const cube = new THREE.Mesh(geometryHead, material);

    head.position.set(0, 30, -40);

    const geometryEye = new THREE.BoxGeometry(3, 3, 1);
    const materialEye = new THREE.MeshBasicMaterial({ color: 0x21b7fc});

    const geometryAntenna = new THREE.CylinderGeometry(0.5, 0.5, 8, 32);
    const materialAntenna = new THREE.MeshBasicMaterial({ color: COLORS.red.dark});

    const antenna1 = new THREE.Mesh(geometryAntenna, materialAntenna);
    antenna1.position.set(5, -12, 0);

    const antenna2 = new THREE.Mesh(geometryAntenna, materialAntenna);
    antenna2.position.set(-5, -12, 0);

    const eye1 = new THREE.Mesh(geometryEye, materialEye);
    eye1.position.set(4, -2, -10);

    const eye2 = new THREE.Mesh(geometryEye, materialEye);
    eye2.position.set(-4, -2, -10);

    head.add(cube);
    head.add(eye1);
    head.add(eye2);
    head.add(antenna1);
    head.add(antenna2);
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
    const colorArm = new THREE.MeshBasicMaterial({ color: COLORS.blue.dark} );
    const cube = new THREE.Mesh(geoArm, colorArm);
    cube.position.set(-20,25, -20);

    arm.add(cube);
    rightArm.add(arm);
    scene.add(rightArm);
}

function createRightForearm(){
    const arm = new THREE.Object3D();
    const geoArm= new THREE.BoxGeometry(20, 20, 60);
    const colorArm = new THREE.MeshBasicMaterial({ color: COLORS.blue.dark} );
    const cube = new THREE.Mesh(geoArm, colorArm);
    cube.position.set(-20,0, 0);

    const geoLight = new THREE.BoxGeometry(5, 2.5, 1);
    const colorLight = new THREE.MeshBasicMaterial({ color: COLORS.yellow.normal});
    const light = new THREE.Mesh(geoLight, colorLight);
    light.position.set(0, 0, 30);

    const geoDecor = new THREE.BoxGeometry(20, 1, 1);
    const colorDecor = new THREE.MeshBasicMaterial({ color: COLORS.red.dark});
    const decor = new THREE.Mesh(geoDecor, colorDecor);
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
    const colorArm = new THREE.MeshBasicMaterial({ color: COLORS.blue.dark} );
    const cube = new THREE.Mesh(geoArm, colorArm);
    cube.position.set(20,25, -20);

    arm.add(cube);

    leftArm.add(arm);
    scene.add(leftArm);

}

function createLeftForearm(){

    const arm = new THREE.Object3D();
    const geoArm= new THREE.BoxGeometry(20, 20, 60);
    const colorArm = new THREE.MeshBasicMaterial({ color: COLORS.blue.dark} );
    const cube = new THREE.Mesh(geoArm, colorArm);
    cube.position.set(20,0, 0);

    const geoLight = new THREE.BoxGeometry(5, 2.5, 1);
    const colorLight = new THREE.MeshBasicMaterial({ color: COLORS.yellow.normal});
    const light = new THREE.Mesh(geoLight, colorLight);
    light.position.set(0, 0, 30);

    const geoDecor = new THREE.BoxGeometry(20, 1, 1);
    const colorDecor = new THREE.MeshBasicMaterial({ color: COLORS.red.dark});
    const decor = new THREE.Mesh(geoDecor, colorDecor);
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
    const colorAbdomen = new THREE.MeshBasicMaterial({ color: COLORS.grey.light} );
    const cube = new THREE.Mesh(geoAbdomen, colorAbdomen);
    cube.position.set(0,0, 0);

    const geoDecor = new THREE.BoxGeometry(20, 1, 1);
    const colorDecor = new THREE.MeshBasicMaterial({ color: COLORS.grey.dark});
    const decor = new THREE.Mesh(geoDecor, colorDecor);
    decor.position.set(0, 10, 30);

    cube.add(decor);
    abdomen.add(cube);

    scene.add(abdomen);
}

function createChest(){
    const chest = new THREE.Object3D();
    const geoChest= new THREE.BoxGeometry(60, 30, 40);
    const colorChest = new THREE.MeshBasicMaterial({ color: COLORS.red.normal} );
    const cube = new THREE.Mesh(geoChest, colorChest);
    cube.position.set(0,25, 10);

    const geoWindow1 = new THREE.BoxGeometry(25, 20, 1);
    const colorWindow1 = new THREE.MeshBasicMaterial({ color: COLORS.yellow.light});
    const Window1 = new THREE.Mesh(geoWindow1, colorWindow1);
    Window1.position.set(-15, 0, 20);

    const geoWindow2 = new THREE.BoxGeometry(25, 20, 1);
    const colorWindow2 = new THREE.MeshBasicMaterial({ color: COLORS.yellow.light});
    const Window2 = new THREE.Mesh(geoWindow2, colorWindow2);
    Window2.position.set(15, 0, 20);

    cube.add(Window1);
    cube.add(Window2);
    chest.add(cube);
    scene.add(chest);
}

function createHeadplacer(){
    const arm = new THREE.Object3D();
    const geoArm= new THREE.BoxGeometry(20, 30, 20);
    const colorArm = new THREE.MeshBasicMaterial({ color: COLORS.red.normal} );
    const cube = new THREE.Mesh(geoArm, colorArm);
    cube.position.set(0,25, -20);

    arm.add(cube);

    scene.add(arm);
}

let waistObj = null;
function createWaist(){
    const waist = new THREE.Object3D();
    const geoWaist= new THREE.BoxGeometry(60, 10, 60);
    const colorWaist = new THREE.MeshBasicMaterial({ color: COLORS.grey.light} );
    const cube = new THREE.Mesh(geoWaist, colorWaist);
    cube.position.set(0,-15, 0);

    const geoWheel = new THREE.CylinderGeometry(10, 10, 5, 32);
    const colorWheel = new THREE.MeshBasicMaterial({ color: COLORS.black.tire });
    
    const wheelLeft = new THREE.Mesh(geoWheel, colorWheel);
    wheelLeft.rotation.z = Math.PI / 2; // Rotate so the wheel lies flat
    wheelLeft.position.set(-30, -20, 20); 
    

    const wheelRight = new THREE.Mesh(geoWheel, colorWheel);
    wheelRight.rotation.z = Math.PI / 2;
    wheelRight.position.set(30, -20, 20);
    
    waist.add(wheelLeft);
    waist.add(wheelRight);

    waist.add(cube);
    scene.add(waist);

    waistObj = waist;
}

function createLeftThigh(){
    const waist = new THREE.Object3D();
    const geoWaist= new THREE.BoxGeometry(29.9, 30, 29.9);
    const colorWaist = new THREE.MeshBasicMaterial({ color: COLORS.blue.dark} );
    const cube = new THREE.Mesh(geoWaist, colorWaist);
    cube.position.set(15,-5, -45);

    waist.add(cube);
    lowerBody.add(waist);
}

function createRightThigh(){
    const waist = new THREE.Object3D();
    const geoWaist= new THREE.BoxGeometry(29.9, 30, 29.9);
    const colorWaist = new THREE.MeshBasicMaterial({ color: COLORS.blue.dark} );
    const cube = new THREE.Mesh(geoWaist, colorWaist);
    cube.position.set(-15,-5, -45);

    waist.add(cube);
    lowerBody.add(waist);
}

function createLeftCalf(){
    const waist = new THREE.Object3D();
    const geoWaist= new THREE.BoxGeometry(30, 30, 70);
    const colorWaist = new THREE.MeshBasicMaterial({ color: COLORS.red.normal} );
    const cube = new THREE.Mesh(geoWaist, colorWaist);
    cube.position.set(15,-5, -95);

    const geoWheel = new THREE.CylinderGeometry(10, 10, 5, 32);
    const colorWheel = new THREE.MeshBasicMaterial({ color: COLORS.black.tire });
    
    const backWheel = new THREE.Mesh(geoWheel, colorWheel);
    backWheel.rotation.z = Math.PI / 2; // Rotate so the wheel lies flat
    backWheel.position.set(30, -20, -115); 
    

    const frontWheel = new THREE.Mesh(geoWheel, colorWheel);
    frontWheel.rotation.z = Math.PI / 2;
    frontWheel.position.set(30, -20, -90);
    
    waist.add(backWheel);
    waist.add(frontWheel);

    waist.add(cube);
    lowerBody.add(waist);
}

function createRightCalf(){
    const waist = new THREE.Object3D();
    const geoWaist= new THREE.BoxGeometry(30, 30, 70);
    const colorWaist = new THREE.MeshBasicMaterial({ color: COLORS.red.normal} );
    const cube = new THREE.Mesh(geoWaist, colorWaist);
    cube.position.set(-15,-5, -95);

    const geoWheel = new THREE.CylinderGeometry(10, 10, 5, 32);
    const colorWheel = new THREE.MeshBasicMaterial({ color: COLORS.black.tire });
    
    const backWheel = new THREE.Mesh(geoWheel, colorWheel);
    backWheel.rotation.z = Math.PI / 2; // Rotate so the wheel lies flat
    backWheel.position.set(-30, -20, -115); 
    

    const frontWheel = new THREE.Mesh(geoWheel, colorWheel);
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

    const geoFeet= new THREE.BoxGeometry(30, 30, 10);
    const colorFeet = new THREE.MeshBasicMaterial({ color: COLORS.blue.dark} );
    const rf = new THREE.Mesh(geoFeet, colorFeet);
    const lf = new THREE.Mesh(geoFeet, colorFeet);

    rf.position.set(15,-5, -135);
    lf.position.set(-15,-5, -135);


    robotFeet.add(rf);
    robotFeet.add(lf);
    lowerBody.add(robotFeet);
    feetPivot = new THREE.Object3D();
    scene.add(feetPivot);
    feetPivot.position.set(0, -20, -130);
    robotFeet.position.set(0, 20, 130);
    feetPivot.add(robotFeet);
    lowerBody.add(feetPivot);

}

function createTrailer(){
    const waist = new THREE.Object3D();
    const geoWaist= new THREE.BoxGeometry(60, 60, 160);
    const colorWaist = new THREE.MeshBasicMaterial({ color: COLORS.grey.normal} );
    //const colorWaist = new THREE.MeshBasicMaterial({ color: COLORS.grey.normal,wireframe: true} );
    const cube = new THREE.Mesh(geoWaist, colorWaist);
    cube.position.set(0,40, -140);

    const connection = new THREE.Object3D();
    const geoConnection= new THREE.BoxGeometry(60, 10, 10);
    const colorConnection = new THREE.MeshBasicMaterial({ color: COLORS.blue.dark} );
    const c = new THREE.Mesh(geoConnection, colorConnection);
    c.position.set(0,15, -55);


    waist.add(cube);
    waist.add(c);
    scene.add(waist);
}

function createTrailerCar(){
    const waist = new THREE.Object3D();
    const geoWaist= new THREE.BoxGeometry(60, 30, 80);
    const colorWaist = new THREE.MeshBasicMaterial({ color: COLORS.red.light} );
    const cube = new THREE.Mesh(geoWaist, colorWaist);
    cube.position.set(0,-5, -180);

    const geoWheel = new THREE.CylinderGeometry(10, 10, 5, 32);
    const colorWheel = new THREE.MeshBasicMaterial({ color: COLORS.black.tire });
    
    const backWheel = new THREE.Mesh(geoWheel, colorWheel);
    backWheel.rotation.z = Math.PI / 2; // Rotate so the wheel lies flat
    backWheel.position.set(30, -20, -205); 
    

    const frontWheel = new THREE.Mesh(geoWheel, colorWheel);
    frontWheel.rotation.z = Math.PI / 2;
    frontWheel.position.set(30, -20, -180);
    
    waist.add(backWheel);
    waist.add(frontWheel);

    const backWheel2 = new THREE.Mesh(geoWheel, colorWheel);
    backWheel2.rotation.z = Math.PI / 2; // Rotate so the wheel lies flat
    backWheel2.position.set(-30, -20, -205); 
    

    const frontWheel2 = new THREE.Mesh(geoWheel, colorWheel);
    frontWheel2.rotation.z = Math.PI / 2;
    frontWheel2.position.set(-30, -20, -180);
    
    waist.add(backWheel2);
    waist.add(frontWheel2);


    waist.add(cube);
    scene.add(waist);
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
            console.log(robotFeet.position);
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
    }
}

init();
animate();
