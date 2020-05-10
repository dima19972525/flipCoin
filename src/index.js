import * as THREE from 'three';
import * as settings from './settings.js';
import { OBJLoader } from 'three-obj-mtl-loader';
import _coin from './coin.obj';
import _texture from './texture.jpg';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    settings.width / settings.height,
    0.1,
    1000
);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(settings.width, settings.height);

document.getElementById('content').append(renderer.domElement);

const light = new THREE.SpotLight(0xffffff, 1, 1000);
light.position.set(0, 0, 100);

scene.add(light);

const objLoader = new OBJLoader();

let COIN = null;
objLoader.load(_coin, (coin) => {
    COIN = coin;
    const texture = new THREE.TextureLoader().load(_texture);
    coin.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            child.material.map = texture;
        }
    });
    console.log('here');
    coin.position.z = -3;

    // coin.position.y = -1;
    // coin.position.x = -1;
    coin.scale.set(coin.scale.x / 15, coin.scale.y / 15, coin.scale.z / 15);

    scene.add(coin);
    loop();
    renderer.render(scene, camera);
});

function loop() {
    // COIN.rotation.z += 0.01;
    COIN.rotation.x += 0.08;

    renderer.render(scene, camera);
    requestAnimationFrame(() => loop());
}
