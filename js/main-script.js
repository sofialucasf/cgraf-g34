import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";


//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

let scene, renderer;
let perspectiveCamera, controls;

const clock = new THREE.Clock();

const house = new THREE.Group();
const trees = new THREE.Group();
const ovni = new THREE.Group();

const ovniRotationSpeed = 1;
const ovniMovingSpeed = 100;
const diagSpeed = ovniMovingSpeed / Math.sqrt(2);

let bufferZone = 20;
let ovniMovingUp = 0;
let ovniMovingDown = 0;
let ovniMovingLeft = 0;
let ovniMovingRight = 0;

let spotLight;
let spotLightOn = true;
let bottomPointLights = [];
let pointLightOn = true;

let globalLight
let globalLightOn = true;

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
      tire: '#111111',
      dark: '#222222',
      normal: '#333333',
      light: '#555555'
    }
};

let heightMap = new THREE.TextureLoader().load('../heightmap.png');
    heightMap.wrapS = heightMap.wrapT = THREE.RepeatWrapping;

let groundBasicMaterial = new THREE.MeshLambertMaterial({ 
    map: generateFloralTexture(), 
    displacementMap: heightMap,
    displacementScale: 80,
    side: THREE.DoubleSide,
    shading: THREE.FlatShading
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

let groundMaterial = groundBasicMaterial;


// Sky materials (BackSide so it surrounds the scene)
let skyBasicMaterial = new THREE.MeshLambertMaterial({ 
    map: generateStarrySkyTexture(), 
    side: THREE.BackSide,
    shading: THREE.FlatShading
});

let skyPhongMaterial = new THREE.MeshPhongMaterial({ 
    map: generateStarrySkyTexture(), 
    side: THREE.BackSide 
});

let skyToonMaterial = new THREE.MeshToonMaterial({ 
    map: generateStarrySkyTexture(), 
    side: THREE.BackSide 
});

let skyMaterial = skyBasicMaterial;

// BasicMaterial
const wallMatBasic = new THREE.MeshLambertMaterial({ color: 0xf5f5dc, shading: THREE.FlatShading });
const wallMatDetailBasic = new THREE.MeshLambertMaterial({ color: 0x0000ff, shading: THREE.FlatShading });
const roofMatBasic = new THREE.MeshLambertMaterial({ color: 0xffa500, shading: THREE.FlatShading });
const doorMatBasic = new THREE.MeshLambertMaterial({ color: 0x632e00, shading: THREE.FlatShading });
const windowMatBasic = new THREE.MeshLambertMaterial({ color: 0x0000ff, shading: THREE.FlatShading });
const ovniBodyMatBasic = new THREE.MeshLambertMaterial({ color: 0x909090, shading: THREE.FlatShading });
const ovniCylinderMatBasic = new THREE.MeshLambertMaterial({ color: 0x707070, shading: THREE.FlatShading });
const ovniGlassMatBasic = new THREE.MeshLambertMaterial({ color: 0x70c6ff, shading: THREE.FlatShading });
const ovniLightsMatBasic = new THREE.MeshLambertMaterial({color: 0xfff838, opacity: 0.4, shading: THREE.FlatShading, emissive: 0xfff838, emissiveIntensity: 1});
const trunkMatBasic = new THREE.MeshLambertMaterial({ color: 0xCC6600, shading: THREE.FlatShading });
const leafsMatBasic = new THREE.MeshLambertMaterial({ color: 0x006400, shading: THREE.FlatShading });

// PhongMaterial
const wallMatPhong = new THREE.MeshPhongMaterial({ color: 0xf5f5dc });
const wallMatDetailPhong = new THREE.MeshPhongMaterial({ color: 0x0000ff });
const roofMatPhong = new THREE.MeshPhongMaterial({ color: 0xffa500 });
const doorMatPhong = new THREE.MeshPhongMaterial({ color: 0x632e00 });
const windowMatPhong = new THREE.MeshPhongMaterial({ color: 0x0000ff });
const ovniBodyMatPhong = new THREE.MeshPhongMaterial({ color: 0x909090 });
const ovniCylinderMatPhong = new THREE.MeshPhongMaterial({ color: 0x707070 });
const ovniGlassMatPhong = new THREE.MeshPhongMaterial({ color: 0x70c6ff });
const ovniLightsMatPhong = new THREE.MeshPhongMaterial({color: 0xfff838, emissive: 0xfff838, emissiveIntensity: 1});
const trunkMatPhong = new THREE.MeshPhongMaterial({ color: 0xCC6600 });
const leafsMatPhong = new THREE.MeshPhongMaterial({ color: 0x006400 });

//ToonMaterial
const wallMatToon = new THREE.MeshToonMaterial({ color: 0xf5f5dc });
const wallMatDetailToon = new THREE.MeshToonMaterial({ color: 0x0000ff });
const roofMatToon = new THREE.MeshToonMaterial({ color: 0xffa500 });
const doorMatToon = new THREE.MeshToonMaterial({ color: 0x632e00 });
const windowMatToon = new THREE.MeshToonMaterial({ color: 0x0000ff });
const ovniBodyMatToon = new THREE.MeshToonMaterial({ color: 0x909090 });
const ovniCylinderMatToon = new THREE.MeshToonMaterial({ color: 0x707070 });
const ovniGlassMatToon = new THREE.MeshToonMaterial({ color: 0x70c6ff });
const ovniLightsMatToon = new THREE.MeshToonMaterial({color: 0xfff838, emissive: 0xfff838, emissiveIntensity: 1});
const trunkMatToon = new THREE.MeshToonMaterial({ color: 0xCC6600 });
const leafsMatToon = new THREE.MeshToonMaterial({ color: 0x006400 });

let wallMaterial = wallMatBasic;
let wallMaterialDetail = wallMatDetailBasic;
let roofMaterial = roofMatBasic;
let doorMaterial = doorMatBasic;
let windowMaterial = windowMatBasic;
let ovniBodyMaterial = ovniBodyMatBasic;
let ovniCylinderMaterial = ovniCylinderMatBasic;
let ovniGlassMaterial = ovniGlassMatBasic;
let ovniLightsMaterial = ovniLightsMatBasic;
let trunkMaterial = trunkMatBasic;
let leafsMaterial = leafsMatBasic;

let BasicOn = true;
let phongOn = false;
let toonOn = false;

const houseCoords = {
    xMin: -147 - bufferZone, 
    xMax: -82 + bufferZone,  
    zMin: -85 - bufferZone,  
    zMax: -12 + bufferZone   
  };

/////////////////////
/* CREATE SCENE(S) */
/////////////////////

function createScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xb0fcff);
}


/////////////////////
/* CREATE CAMERA(S)  */
/////////////////////
function createCameras() {
    const aspect = window.innerWidth / window.innerHeight;
    perspectiveCamera = new THREE.PerspectiveCamera(90, aspect, 0.1, 2000);
    perspectiveCamera.lookAt(0, 80, 0);
    perspectiveCamera.position.set(-160, 50, 200);
}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function createGroundFromHeightmap(url, onComplete) {
    const width = 500;
    const height = 500;
    const widthSegments = 100;
    const heightSegments = 100;

    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = url;

    image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image,0,0);
        const pixelData = ctx.getImageData(0,0, image.width,image.height).data;

        const geometry = new THREE.PlaneGeometry(width,height, widthSegments, heightSegments);
        geometry.rotateX(-Math.PI/2);

        const vertices = geometry.attributes.position;
        const heightValues = [];

        for(let i = 0; i < vertices.count;i++) {
            const x = i%(widthSegments + 1);
            const y = Math.floor(i/ (widthSegments +1));

            const imgX = Math.floor((x/ widthSegments) *(image.width - 1));
            const imgY = Math.floor((y / heightSegments) *(image.height - 1));
            const idx = (imgY * image.width + imgX)* 4;

            const pixelHeight = pixelData[idx];
            const heightValue = (pixelHeight /255) *75;
            vertices.setY(i, heightValue);
            heightValues.push(heightValue);
        }

        vertices.needsUpdate = true;
        geometry.computeVertexNormals();

       
        const material = new THREE.MeshLambertMaterial({ color: '' });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.position.y = -60;

        mesh.getHeightAt = function (x, z) {
            const halfWidth = width/2;
            const halfHeight = height/2;
            const col = Math.floor(((x + halfWidth) /width) * widthSegments);
            const row = Math.floor(((z + halfHeight)/ height) * heightSegments);
            const index = row * (widthSegments + 1) + col;
            return heightValues[index];
        };

        if ( onComplete ) onComplete(mesh);
    };

}

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
    groundGeometry.userData.type = "ground";

    groundGeometry.computeVertexNormals();
    groundGeometry.normalsNeedUpdate = true;

    let groundMesh = new THREE.Mesh(groundGeometry, groundMaterial)
    groundMesh.castShadow = true;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -60;
}

function createSkyDome(){
    const skyGeometry = new THREE.SphereGeometry(250, 32, 32);
    skyGeometry.userData.type = "skyDome";
    skyGeometry.normalsNeedUpdate = true;

    const skyDome = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(skyDome);
}

function createMoon(){
    const moonGeometry = new THREE.SphereGeometry(20, 32, 32);
    moonGeometry.userData.type = "moon";
    moonGeometry.normalsNeedUpdate = true;
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
    globalLight = new THREE.DirectionalLight('white', 1);
    globalLight.position.set(500, 500, 500);
    globalLight.lookAt(new THREE.Vector3(0, 0, 0));
    globalLight.castShadow = true;
    scene.add(globalLight);
};
 
function createWallFace(p1, p2, p3, p4, material) {
    const geom = new THREE.BufferGeometry();
    geom.normalsNeedUpdate = true;
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
    let mesh;

    // Walls
    mesh = createWallFace( [-20, 5 ,20], [20, 5 ,20], [20, 20 ,20], [-20, 20 ,20], wallMaterial);
    mesh.userData.type = "wall";
    house.add(mesh);

    mesh = createWallFace( [20, 0 ,20], [20, 0 ,-40], [20, 20 ,-40], [20, 20 ,20], wallMaterial);
    mesh.userData.type = "wall";
    house.add(mesh);

    mesh = createWallFace( [20, 0 ,-40], [-20, 0 ,-40], [-20, 20 ,-40], [20, 20 ,-40], wallMaterial);
    mesh.userData.type = "wall";
    house.add(mesh);

    mesh = createWallFace( [-20, 0 ,-40], [-20, 0 ,20], [-20, 20 ,20], [-20, 20 ,-40], wallMaterial);
    mesh.userData.type = "wall";
    house.add(mesh);

    // Details (bottom)
    mesh = createWallFace( [-20.05, 0 ,20.05], [20.05, 0 ,20.05], [20.05, 5 ,20.05], [-20.05, 5 ,20.05], wallMaterialDetail);
    mesh.userData.type = "detail";
    house.add(mesh);

    mesh = createWallFace( [20.05, 0 ,20.05], [20.05, 0 ,-40.05], [20.05, 5 ,-40.05], [20, 5 ,20.05], wallMaterialDetail);
    mesh.userData.type = "detail";
    house.add(mesh);

    mesh = createWallFace( [20.05, 0 ,-40.05], [-20.05, 0 ,-40.05], [-20.05, 5 ,-40.05], [20.05, 5 ,-40.05], wallMaterialDetail);
    mesh.userData.type = "detail";
    house.add(mesh);

    mesh = createWallFace( [-20.05, 0 ,-40.05], [-20.05, 0 ,20.05], [-20.05, 5 ,20.05], [-20.05, 5 ,-40.05], wallMaterialDetail);
    mesh.userData.type = "detail";
    house.add(mesh);

    // Roof
    mesh = createWallFace( [-20, 20 ,20] , [20, 20 ,20] , [0, 30 ,20] , [-20, 20 ,20] , wallMaterial);
    mesh.userData.type = "wall";
    house.add(mesh);

    mesh = createWallFace( [20, 20 ,20] , [20, 20 ,-40] , [0, 30 ,-40] , [0, 30 ,20] , roofMaterial);
    mesh.userData.type = "roof";
    house.add(mesh);

    mesh = createWallFace( [20, 20 ,-40], [-20, 20 ,-40] , [0, 30 ,-40] , [20, 20 ,-40] , wallMaterial);
    mesh.userData.type = "wall";
    house.add(mesh);

    mesh = createWallFace( [-20, 20 ,-40] , [-20, 20 ,20] , [0, 30 ,20] , [0, 30 ,-40], roofMaterial);
    mesh.userData.type = "roof";
    house.add(mesh);

    // Door
    const door = new THREE.Mesh(new THREE.PlaneGeometry(10, 15), doorMaterial);
    door.userData.type = "door";
    door.normalsNeedUpdate = true;
    door.position.set(0, 7.5, 20.1);
    house.add(door);

    // Windows
    const windowGeom = new THREE.PlaneGeometry(8, 8);
    windowGeom.normalsNeedUpdate = true;
    
    const winL1 = new THREE.Mesh(windowGeom, windowMaterial);
    winL1.userData.type = "window";
    winL1.position.set(-20.1, 13, -20);
    winL1.rotation.y = - Math.PI / 2;
    house.add(winL1);
    
    const winL2 = new THREE.Mesh(windowGeom, windowMaterial);
    winL2.userData.type = "window";
    winL2.position.set(-20.1, 13, 0);
    winL2.rotation.y = - Math.PI / 2;
    house.add(winL2);
    
    const winR1 = new THREE.Mesh(windowGeom, windowMaterial);
    winR1.userData.type = "window";
    winR1.position.set(20.1, 13, 0);
    winR1.rotation.y = Math.PI / 2;
    house.add(winR1);

    const winR2 = new THREE.Mesh(windowGeom, windowMaterial);
    winR2.userData.type = "window";
    winR2.position.set(20.1, 13, -20);
    winR2.rotation.y = Math.PI / 2;
    house.add(winR2);

    house.position.set(-100,-10,-40);
    house.rotateY(Math.PI / 6);
    scene.add(house);

        // Door
    // house.add(createWallFace( [-5, 0 , 20.1] , [5, 0 , 20.1] , [5, 15 , 20.1] , [-5, 15 , 20.1], doorMatLambert));
   
    //     // Windows
    // // Right Side
    // house.add(createWallFace( [-20.1, 9 , -24] , [-20.1, 9 , -16], [-20.1, 17 , -16], [-20.1, 17 , -24], windowMatLambert ));
    // house.add(createWallFace( [-20.1, 9 , -4] , [-20.1, 9 , 4], [-20.1, 17 , 4], [-20.1, 17 , -4], windowMatLambert));

    // // Left Side
    // house.add(createWallFace( [20.1, 9 , -16] , [20.1, 9 , -24] , [20.1, 17 , -24] , [20.1, 17 , -16], windowMatLambert));
    // house.add(createWallFace( [20.1, 9 , 4] , [20.1, 9 , -4] , [20.1, 17 , -4] , [20.1, 17 , 4], windowMatLambert));

    // house.position.set(-120,-10,-40);
    // house.rotateY(Math.PI / 6); 
    // scene.add(house);
}

function addBottomLight(angle) {
    const radius = 30; 
    const lightDistance = radius * 0.9; 

    const x = lightDistance * Math.cos(angle);
    const z = lightDistance * Math.sin(angle);
    const y = -30 * 0.2; 

    const light = new THREE.Mesh(new THREE.SphereGeometry(2, 16, 8), ovniLightsMaterial);
    light.userData.type = "ovniLight";
    light.normalsNeedUpdate = true;
    light.position.set(x, y, z);

    const pointLight = new THREE.PointLight(COLORS.yellow.light, 10, 100);
    pointLight.position.set(x, y - 5, z);
    pointLight.castShadow = true;
    bottomPointLights.push(pointLight);
    ovni.add(pointLight);

    ovni.add(light);
}

function createOvni(){
    const ovniBody = new THREE.Mesh(new THREE.SphereGeometry(40), ovniBodyMaterial);
    ovniBody.userData.type = "ovniBody";
    ovniBody.normalsNeedUpdate = true;
    ovniBody.scale.set(1, 0.2,1);
    ovni.add(ovniBody);

    const ovniGlass = new THREE.Mesh(new THREE.SphereGeometry(22, 32, 16, 0, Math.PI * 2, 0, Math.PI/2), ovniGlassMaterial);
    ovniGlass.userData.type = "ovniGlass";
    ovniGlass.normalsNeedUpdate = true;
    ovni.add(ovniGlass);

    const ovniCylinder = new THREE.Mesh(new THREE.CylinderGeometry(22, 22, 5), ovniCylinderMaterial);
    ovniCylinder.userData.type = "ovniCylinder";
    ovniCylinder.normalsNeedUpdate = true;
    ovniCylinder.position.set(0, -6, 0);
    ovni.add(ovniCylinder);

    spotLight = new THREE.SpotLight(0xffffff, 2, 300, Math.PI / 6, 0.1, 0);
    spotLight.position.set(0, -10, 0); // Just below the cylinder
    spotLight.target.position.set(0, -40, 0); // Pointing further down
    spotLight.castShadow = true;
    ovni.add(spotLight);
    ovni.add(spotLight.target);

    addBottomLight(0);
    addBottomLight(Math.PI / 4);
    addBottomLight(Math.PI / 2);
    addBottomLight(3 * Math.PI / 4);
    addBottomLight(Math.PI);
    addBottomLight(5 * Math.PI / 4);
    addBottomLight(3 * Math.PI / 2);
    addBottomLight(7 * Math.PI / 4);

    ovni.position.set(0, 150, -50);
    scene.add(ovni);
}

function createTree(x = 0, y = 0, z = 0, rot = 0, scalar = 1) {
    // Tronco grande
    const tree = new THREE.Group();

    const trunkGeo = new THREE.CylinderGeometry(0.5, 0.6, 5, 16);
    trunkGeo.normalsNeedUpdate = true;
    const trunk = new THREE.Mesh(trunkGeo, trunkMaterial);
    trunk.userData.type = "trunk";
    trunk.rotation.z = THREE.MathUtils.degToRad(10);
    trunk.position.y = 2.0;
    tree.add(trunk);

    // Ramo pequeno
    const branchGeo = new THREE.CylinderGeometry(0.2, 0.25, 2.5, 12);
    branchGeo.normalsNeedUpdate = true;
    const branch = new THREE.Mesh(branchGeo, trunkMaterial);
    branch.userData.type = "branch";
    branch.rotation.z = THREE.MathUtils.degToRad(-30);
    branch.position.set(.8, 4, 0);
    tree.add(branch);

    // Copa 2 ou 3 elipsoides 
    const numElipsoids = Math.floor(Math.random() * 3) +1; 
    for (let i = 0; i < numElipsoids; i++) {
      const leafsGeo = new THREE.SphereGeometry(1.5, 16, 16);
        leafsGeo.normalsNeedUpdate = true;
        const leafs = new THREE.Mesh(leafsGeo, leafsMaterial);
        leafs.userData.type = "leafs";
        leafs.receiveShadow = true;
        leafs.scale.set(1.2, 0.8, 1.2);
        leafs.position.set((Math.random() - 0.5) * 1.5,
                         4.5 + i* 0.5,
                        (Math.random() - 0.5) * 1.5);
        tree.add(leafs);
    }
    tree.position.set(x,y,z);
    tree.scale.setScalar(scalar);
    tree.rotation.y =rot;
    trees.add(tree);

    return tree;
}

function createTrees(num,mesh) {
    const size = 360;

    for(let i = 0; i < num; i++){
        const width = Math.floor(Math.random() * (size + 1)) - size/2;
        const length = Math.floor(Math.random() * (size + 1)) - size/2;
        const height = mesh.getHeightAt(width,length);
        const rot = Math.floor(Math.random() * 360);
        const scalar = Math.floor(Math.random() * 10) + 5;

        
        if (houseCoords.xMin <= width && width <= houseCoords.xMax &&
            houseCoords.zMin <= length && length <= houseCoords.zMax){
                console.log("hit!");      
                continue
            }  
             
        createTree(width,height -60,length,rot,scalar); 
    }  
   
}

function toggleOvniPointLights() {
    if (pointLightOn) {
        bottomPointLights.forEach((light, index) => {
            light.intensity = 10;
            ovniLightsMaterial.emissiveIntensity = 1;        
        });
    }
    else {
        bottomPointLights.forEach((light, index) => {
            light.intensity = 0;
            ovniLightsMaterial.emissiveIntensity = 0;
        });
    }
}

function toggleOvniSpotlight(){
    if(spotLightOn) {
        spotLight.intensity = 2;
    }
    else {
        spotLight.intensity = 0;
    }
}

function toggleGlobalLight(){
    if(globalLightOn){
        globalLight.intensity = 1;
    }
    else{
        globalLight.intensity = 0;
    }
}

function switchMaterial(){
    if (BasicOn){
        groundMaterial = groundBasicMaterial;
        skyMaterial = skyBasicMaterial;
        wallMaterial = wallMatBasic;
        wallMaterialDetail = wallMatDetailBasic;
        roofMaterial = roofMatBasic;
        doorMaterial = doorMatBasic;
        windowMaterial = windowMatBasic;
        ovniBodyMaterial = ovniBodyMatBasic;
        ovniCylinderMaterial = ovniCylinderMatBasic;
        ovniGlassMaterial = ovniGlassMatBasic;
        ovniLightsMaterial = ovniLightsMatBasic;
        trunkMaterial = trunkMatBasic;
        leafsMaterial = leafsMatBasic;
    }
    else if(phongOn){
        groundMaterial = groundPhongMaterial;
        skyMaterial = skyPhongMaterial;
        wallMaterial = wallMatPhong;
        wallMaterialDetail = wallMatDetailPhong;
        roofMaterial = roofMatPhong;
        doorMaterial = doorMatPhong;
        windowMaterial = windowMatPhong;
        ovniBodyMaterial = ovniBodyMatPhong;
        ovniCylinderMaterial = ovniCylinderMatPhong;
        ovniGlassMaterial = ovniGlassMatPhong;
        ovniLightsMaterial = ovniLightsMatPhong;
        trunkMaterial = trunkMatPhong;
        leafsMaterial = leafsMatPhong;
    }
    else if(toonOn){ 
        groundMaterial = groundToonMaterial;
        skyMaterial = skyToonMaterial;
        wallMaterial = wallMatToon;
        wallMaterialDetail = wallMatDetailToon;
        roofMaterial = roofMatToon;
        doorMaterial = doorMatToon;
        windowMaterial = windowMatToon;
        ovniBodyMaterial = ovniBodyMatToon;
        ovniCylinderMaterial = ovniCylinderMatToon;
        ovniGlassMaterial = ovniGlassMatToon;
        ovniLightsMaterial = ovniLightsMatToon;
        trunkMaterial = trunkMatToon;
        leafsMaterial = leafsMatToon;
    }
    updateMaterials();
}

function updateMaterials(){
    // Update ground
    scene.traverse(obj => {
        if (obj.isMesh && obj.geometry.type === "PlaneGeometry") {
            obj.material = groundMaterial;
        }
    });

    // Update sky
    scene.traverse(obj => {
        if (obj.isMesh && obj.geometry.type === "SphereGeometry" && obj.material.side === THREE.BackSide) {
            obj.material = skyMaterial;
        }
    });

    // Update house
    house.traverse(obj => {
        if (obj.isMesh) {
            // Door
            if (obj.userData.type === "door") {
                obj.material = doorMaterial;
            }
            // Window
            else if (obj.userData.type === "window") {
                obj.material = windowMaterial;
            }
            // Walls/roof/detail
            else if (obj.userData.type === "wall") {
                obj.material = wallMaterial;
            }
            else if (obj.userData.type === "roof") {
                obj.material = roofMaterial;
            }
            else if (obj.userData.type === "detail") {
                obj.material = wallMaterialDetail;
            }
        }
    });

    // Update OVNI
    ovni.traverse(obj => {
        if (obj.isMesh) {
            if (obj.userData.type === "ovniBody") {
                obj.material = ovniBodyMaterial;
            }
            else if (obj.userData.type === "ovniGlass") {
                obj.material = ovniGlassMaterial;
            }
            else if (obj.userData.type === "ovniCylinder") {
                obj.material = ovniCylinderMaterial;
            } else if (obj.userData.type === "ovniLight") {
                obj.material = ovniLightsMaterial;
        }
        }
    });

    // Update trees (Not working yet because of the way trees are created))
    trees.traverse(obj => {
        if (obj.isMesh) {
            if (obj.userData.type === "trunk") {
                obj.material = trunkMaterial;
            }
            else if (obj.userData.type === "leafs") {
                obj.material = leafsMaterial;
            }
            else if (obj.userData.type === "branch") {
                obj.material = trunkMaterial;
            }
        }
    });

}

////////////
/* UPDATE */
////////////
function update() {
    controls.update();
    const delta = clock.getDelta();
    ovni.rotation.y += ovniRotationSpeed * delta;

    let moveX = ovniMovingUp - ovniMovingDown;
    let moveZ = ovniMovingRight - ovniMovingLeft;

    if (moveX !== 0 && moveZ !== 0) {
        ovni.position.x += moveX * diagSpeed * delta;
        ovni.position.z += moveZ * diagSpeed * delta;
    } else {
        ovni.position.x += moveX * ovniMovingSpeed * delta;
        ovni.position.z += moveZ * ovniMovingSpeed * delta;
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
    //createGround();
    createGroundFromHeightmap('heightmap.png', groundMesh => {
        scene.add(groundMesh);
        createTrees(20,groundMesh);
    });
    createCameras();
    createSkyDome();
    createMoon();
    createGlobalLight();
    createHouse();
    createOvni();  
    //createTrees(20);

    controls = new OrbitControls(perspectiveCamera, renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('keydown', onKeyDown, false);
    window.addEventListener('keyup', onKeyUp, false);
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
            groundMaterial.map = generateFloralTexture();
            groundMaterial.map.needsUpdate = true;
            break;
        case '2':
            skyMaterial.map = generateStarrySkyTexture();
            skyMaterial.map.needsUpdate = true;
            break;
        case 'arrowup':
            ovniMovingUp = 1;
            break;
        case 'arrowdown':
            ovniMovingDown = 1;
            break;
        case 'arrowleft':
            ovniMovingLeft = 1;
            break;
        case 'arrowright':
            ovniMovingRight = 1;
            break;
        case 's':
            spotLightOn = !spotLightOn;
            toggleOvniSpotlight();
            break;
        case 'p':
            pointLightOn = !pointLightOn;
            toggleOvniPointLights();
            break;
        case 'd':
            globalLightOn = !globalLightOn;
            toggleGlobalLight();
            break;
        case 'q':
            if(BasicOn){break;}
            BasicOn = true;
            phongOn = false;
            toonOn = false;
            switchMaterial();
            break;
        case 'w':
            if(phongOn){break;}
            BasicOn = false;
            phongOn = true;
            toonOn = false;
            switchMaterial();
            break;
        case 'e':
            if(toonOn){break;}
            BasicOn = false;
            phongOn = false;
            toonOn = true;
            switchMaterial();
            break;
    }
}

function onKeyUp(event) {
    switch (event.key.toLowerCase()){
        case 'arrowup':
            ovniMovingUp = 0;
            break;
        case 'arrowdown':
            ovniMovingDown = 0;
            break;
        case 'arrowleft':
            ovniMovingLeft = 0;
            break;
        case 'arrowright':
            ovniMovingRight = 0;
            break;
    }
}

init();
animate();
