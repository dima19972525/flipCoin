import * as THREE from 'three';
import * as settings from './settings.js';
import { MTLLoader, OBJLoader } from 'three-obj-mtl-loader';
import _coin from './coin.obj';
import _coinSTL from './coin2.stl';

import _STLLoader from 'three-stl-loader';

const STLLoader = _STLLoader(THREE);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    settings.width / settings.height,
    0.1,
    1000,
);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(settings.width, settings.height);

document.getElementById('content').append(renderer.domElement);

const light = new THREE.PointLight(0xffffff, 1, 1000);
light.position.set(50, 50, 50);
scene.add(light);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const cube = new THREE.Mesh(geometry, material);

cube.position.z = -5;

const mtlLoader = new MTLLoader();

const objLoader = new OBJLoader();

// mtlLoader.load('./coin.mtl', (materials) => {
//     materials.preload();
//     objLoader.setMaterials(materials);
let COIN = null;
// objLoader.load(_coin, (coin) => {
//     COIN = coin;
//     coin.position.z = -3;
//     coin.position.y = -1;
//     coin.position.x = -1;
//     coin.scale.set(coin.scale.x / 10, coin.scale.y / 10, coin.scale.z / 10);

//     scene.add(coin);
//     loop();
// });

const loader = new STLLoader();

loader.load(_coinSTL, function (geometry) {
    const material = new THREE.MeshNormalMaterial();
    const coin = new THREE.Mesh(geometry, material);
    console.log('HERE');
    COIN = coin;

    coin.position.z = -3;
    coin.position.y = -1;
    coin.position.x = -1;
    //  coin.scale.set(coin.scale.x / 2, coin.scale.y / 10, coin.scale.z / 10);
    scene.add(coin);
});
// });

// scene.add(cube);

function loop() {
    COIN.rotation.z += 0.01;
    // COIN.rotation.y += 0.01;

    renderer.render(scene, camera);
    requestAnimationFrame(() => loop());
}
