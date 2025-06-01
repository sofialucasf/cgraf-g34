import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";


//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

let scene, renderer;
let perspectiveCamera, controls;
const house = new THREE.Group();
const ovni = new THREE.Group();

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

let heightMap = new THREE.TextureLoader().load('../heightmap.png');
    heightMap.wrapS = heightMap.wrapT = THREE.RepeatWrapping;

let groundLambertMaterial = new THREE.MeshLambertMaterial({ 
    map: generateFloralTexture(), 
    displacementMap: heightMap,
    displacementScale: 80,
    side: THREE.DoubleSide 
});

let groundPhongMaterial = new THREE.MeshPhongMaterial({ 
    map: generateFloralTexture(), 
    displacementMap: heightMap,
    displacementScale: 80,
    side: THREE.DoubleSide 
});

let groundToonMaterial = new THREE.MeshToonMaterial({ 
    map: generateFloralTexture(), 
    displacementMap: heightMap,
    displacementScale: 80,
    side: THREE.DoubleSide 
});


// Sky materials (BackSide so it surrounds the scene)
let skyLambertMaterial = new THREE.MeshLambertMaterial({ 
    map: generateStarrySkyTexture(), 
    side: THREE.BackSide 
});

let skyPhongMaterial = new THREE.MeshPhongMaterial({ 
    map: generateStarrySkyTexture(), 
    side: THREE.BackSide 
});

let skyToonMaterial = new THREE.MeshToonMaterial({ 
    map: generateStarrySkyTexture(), 
    side: THREE.BackSide 
});

// LambertMaterial
const wallMatLambert = new THREE.MeshLambertMaterial({ color: 0xf5f5dc });
const wallMatDetailLambert = new THREE.MeshLambertMaterial({ color: 0x0000ff });
const roofMatLambert = new THREE.MeshLambertMaterial({ color: 0xffa500 });
const doorMatLambert = new THREE.MeshLambertMaterial({ color: 0x632e00 });
const windowMatLambert = new THREE.MeshLambertMaterial({ color: 0x0000ff });
const ovniBodyMatLambert = new THREE.MeshLambertMaterial({ color: 0x909090 });
const ovniCylinderMatLambert = new THREE.MeshLambertMaterial({ color: 0x707070 });
const ovniGlassMatLambert = new THREE.MeshLambertMaterial({ color: 0x70c6ff });
const ovniLightsMatLambert = new THREE.MeshLambertMaterial({ color: 0xfff838 });

// PhongMaterial
const wallMatPhong = new THREE.MeshPhongMaterial({ color: 0xf5f5dc });
const wallMatDetailPhong = new THREE.MeshPhongMaterial({ color: 0x0000ff });
const roofMatPhong = new THREE.MeshPhongMaterial({ color: 0xffa500 });
const doorMatPhong = new THREE.MeshPhongMaterial({ color: 0x632e00 });
const windowMatPhong = new THREE.MeshPhongMaterial({ color: 0x0000ff });
const ovniBodyMatPhong = new THREE.MeshPhongMaterial({ color: 0x909090 });
const ovniCylinderMatPhong = new THREE.MeshPhongMaterial({ color: 0x707070 });
const ovniGlassMatPhong = new THREE.MeshPhongMaterial({ color: 0x70c6ff });
const ovniLightsMatPhong = new THREE.MeshPhongMaterial({ color: 0xfff838 });

//ToonMaterial
const wallMatToon = new THREE.MeshToonMaterial({ color: 0xf5f5dc });
const wallMatDetailToon = new THREE.MeshToonMaterial({ color: 0x0000ff });
const roofMatToon = new THREE.MeshToonMaterial({ color: 0xffa500 });
const doorMatToon = new THREE.MeshToonMaterial({ color: 0x632e00 });
const windowMatToon = new THREE.MeshToonMaterial({ color: 0x0000ff });
const ovniBodyMatToon = new THREE.MeshToonMaterial({ color: 0x909090 });
const ovniCylinderMatToon = new THREE.MeshToonMaterial({ color: 0x707070 });
const ovniGlassMatToon = new THREE.MeshToonMaterial({ color: 0x70c6ff });
const ovniLightsMatToon = new THREE.MeshToonMaterial({ color: 0xfff838 });

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
    perspectiveCamera.position.set(-200, 50, -200);
}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function generateFloralTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Fundo verde-claro
    ctx.fillStyle = '#ccffcc';
    ctx.fillRect(0, 0, 512, 512);

    const colors = ['white', 'yellow', 'violet', 'lightblue'];
    for (let i = 0; i < 600; i++) {
        ctx.beginPath();
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const r = Math.random() * 2 + 1;
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
}

function generateStarrySkyTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(0, '#000033');
    gradient.addColorStop(1, '#330033');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);

    // Estrelas
    for (let i = 0; i < 600; i++) {
        ctx.beginPath();
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const r = Math.random() * 1 + 0.1;
        ctx.fillStyle = 'white';
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
}

function createGround(){
    const groundGeometry = new THREE.PlaneGeometry(500, 500, 100, 100);   

    groundGeometry.computeVertexNormals();

    let groundMesh = new THREE.Mesh(groundGeometry, groundLambertMaterial)
    groundMesh.castShadow = true;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -60;
}

function createSkyDome(){
    const skyGeometry = new THREE.SphereGeometry(250, 32, 32);

    const skyDome = new THREE.Mesh(skyGeometry, skyLambertMaterial);
    scene.add(skyDome);
}

function createMoon(){
    const moonGeometry = new THREE.SphereGeometry(20, 32, 32);
    const moonMaterial = new THREE.MeshStandardMaterial({
        color: COLORS.grey.light,
        emissive: 'white',
        emissiveIntensity: 5
    });

    const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
    moonMesh.position.set(100, 150, 100);
    scene.add(moonMesh);
}

function createGlobalLight() {
    const globalLight = new THREE.DirectionalLight(0xffffff, 3);
    globalLight.position.set(100, 150, 100);
    globalLight.lookAt(new THREE.Vector3(0, 0, 0));
    globalLight.castShadow = true;
    scene.add(globalLight);
};

function createWallFace(p1, p2, p3, p4, material) {
    const geom = new THREE.BufferGeometry();
    const verts = new Float32Array([
      ...p1, ...p2, ...p3,
      ...p3, ...p4, ...p1,
    ]);
    geom.setAttribute('position', new THREE.BufferAttribute(verts, 3));
    geom.computeVertexNormals();
    return new THREE.Mesh(geom, material);
  }
  

  
  function createHouse(){

    // House
    house.add(createWallFace( [-20, 5 ,20], [20, 5 ,20], [20, 20 ,20], [-20, 20 ,20], wallMatLambert)); // Front Top
    house.add(createWallFace( [20, 0 ,20], [20, 0 ,-40], [20, 20 ,-40], [20, 20 ,20], wallMatLambert)); // Right Top
    house.add(createWallFace( [20, 0 ,-40], [-20, 0 ,-40], [-20, 20 ,-40], [20, 20 ,-40], wallMatLambert)); // Back Top
    house.add(createWallFace( [-20, 0 ,-40], [-20, 0 ,20], [-20, 20 ,20], [-20, 20 ,-40], wallMatLambert)); // Left Top
    
    house.add(createWallFace( [-20.05, 0 ,20.05], [20.05, 0 ,20.05], [20.05, 5 ,20.05], [-20.05, 5 ,20.05], wallMatDetailLambert)); // Front Bottom
    house.add(createWallFace( [20.05, 0 ,20.05], [20.05, 0 ,-40.05], [20.05, 5 ,-40.05], [20, 5 ,20.05], wallMatDetailLambert)); // Right Bottom
    house.add(createWallFace( [20.05, 0 ,-40.05], [-20.05, 0 ,-40.05], [-20.05, 5 ,-40.05], [20.05, 5 ,-40.05], wallMatDetailLambert)); // Back Bottom
    house.add(createWallFace( [-20.05, 0 ,-40.05], [-20.05, 0 ,20.05], [-20.05, 5 ,20.05], [-20.05, 5 ,-40.05], wallMatDetailLambert)); // Left Bottom
    
    // Roof
    house.add(createWallFace( [-20, 20 ,20] , [20, 20 ,20] , [0, 30 ,20] , [-20, 20 ,20] , wallMatLambert));   // Front 
    house.add(createWallFace( [20, 20 ,20] , [20, 20 ,-40] , [0, 30 ,-40] , [0, 30 ,20] , roofMatLambert));    // Right 
    house.add(createWallFace( [20, 20 ,-40], [-20, 20 ,-40] , [0, 30 ,-40] , [20, 20 ,-40] , wallMatLambert)); // Back 
    house.add(createWallFace( [-20, 20 ,-40] , [-20, 20 ,20] , [0, 30 ,20] , [0, 30 ,-40], roofMatLambert));  // Left 

    // Door
    const door = new THREE.Mesh(new THREE.PlaneGeometry(10, 15), doorMatLambert);
    door.position.set(0, 7.5, 20.1);
    house.add(door);

    // Windows
    const windowGeom = new THREE.PlaneGeometry(8, 8);
    
    const winL1 = new THREE.Mesh(windowGeom, windowMatLambert);
    winL1.position.set(-20.1, 13, -20);
    winL1.rotation.y = - Math.PI / 2;
    house.add(winL1);
    
    const winL2 = new THREE.Mesh(windowGeom, windowMatLambert);
    winL2.position.set(-20.1, 13, 0);
    winL2.rotation.y = - Math.PI / 2;
    house.add(winL2);
    
    const winR1 = new THREE.Mesh(windowGeom, windowMatLambert);
    winR1.position.set(20.1, 13, 0);
    winR1.rotation.y = Math.PI / 2;
    house.add(winR1);

    const winR2 = new THREE.Mesh(windowGeom, windowMatLambert);
    winR2.position.set(20.1, 13, -20);
    winR2.rotation.y = Math.PI / 2;
    house.add(winR2);

    house.position.set(-100,-10,-40);
    house.rotateY(Math.PI / 6);
    scene.add(house);
}

// Adds a small sphere at a given angle around the bottom of the ovni
function addBottomLight(angle) {
    const radius = 30; 
    const lightDistance = radius * 0.9; 

    const x = lightDistance * Math.cos(angle);
    const z = lightDistance * Math.sin(angle);
    const y = -30 * 0.2; 

    const light = new THREE.Mesh(new THREE.SphereGeometry(2, 16, 8), ovniLightsMatLambert);
    light.position.set(x, y, z);

    const pointLight = new THREE.PointLight(0xfff838, 2, 30);
    pointLight.position.set(x, y, z);
    ovni.add(pointLight);

    ovni.add(light);
}

function createOvni(){
    const ovniBody = new THREE.Mesh(new THREE.SphereGeometry(40), ovniBodyMatLambert);
    ovniBody.scale.set(1, 0.2,1);
    ovni.add(ovniBody);

    const ovniGlass = new THREE.Mesh(new THREE.SphereGeometry(22, 32, 16, 0, Math.PI * 2, 0, Math.PI/2), ovniGlassMatLambert);
    ovni.add(ovniGlass);

    const ovniCylinder = new THREE.Mesh(new THREE.CylinderGeometry(22, 22, 5), ovniCylinderMatLambert);
    ovniCylinder.position.set(0, -6, 0);
    ovni.add(ovniCylinder);

    const spotLight = new THREE.SpotLight('white', 10, 30);
    spotLight.rotation.x = -Math.PI / 2;
    spotLight.position.set(0, -3, 0);
    ovni.add(spotLight);

    addBottomLight(0);
    addBottomLight(Math.PI / 4);
    addBottomLight(Math.PI / 2);
    addBottomLight(3 * Math.PI / 4);
    addBottomLight(Math.PI);
    addBottomLight(5 * Math.PI / 4);
    addBottomLight(3 * Math.PI / 2);
    addBottomLight(7 * Math.PI / 4);

    ovni.position.set(100, 100, -100);
    scene.add(ovni);
    
}

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
    createHouse();
    createOvni();

    controls = new OrbitControls(perspectiveCamera, renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('keydown', onKeyDown, false);
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
    switch (event.key.toLowerCase()){
        case '1':
            groundLambertMaterial.map = generateFloralTexture();
            groundLambertMaterial.map.needsUpdate = true;
            break;
        case '2':
            skyLambertMaterial.map = generateStarrySkyTexture();
            skyLambertMaterial.map.needsUpdate = true;
            break;
    }
}

function onKeyUp(event) {
}

init();
animate();
