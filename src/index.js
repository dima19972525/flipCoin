import * as THREE from 'three';
import * as settings from './settings.js';
import { OBJLoader } from 'three-obj-mtl-loader';
import { Interaction } from 'three.interaction';
import Quaternion from 'quaternion';
import _coin from './coin.obj';
import _texture from './texture.jpg';
import state from './state';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    settings.width / settings.height,
    0.1,
    1000,
);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(settings.width, settings.height);

const interaction = new Interaction(renderer, scene, camera);

document.getElementById('content').append(renderer.domElement);

const light = new THREE.SpotLight(0xffffff, 1, 1000);
light.position.set(0, 0, 100);

scene.add(light);

const objLoader = new OBJLoader();

let COIN = null;
let _x = 0;
let _y = 0;

objLoader.load(_coin, (coin) => {
    COIN = coin;
    const texture = new THREE.TextureLoader().load(_texture);
    coin.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            child.material.map = texture;
        }
    });

    coin.cursor = 'pointer';

    coin.position.z = -3;

    coin.scale.set(coin.scale.x / 15, coin.scale.y / 15, coin.scale.z / 15);

    scene.add(coin);

    document.getElementById('content').addEventListener('mouseup', () => {
        event.preventDefault();
        state.isMove = false;
    });
    document.getElementById('content').addEventListener('mouseout', () => {
        event.preventDefault();
        state.isMove = false;
    });

    document
        .getElementById('content')
        .addEventListener('mousedown', (event) => {
            event.preventDefault();
            state.isMove = true;
            state.lastScreenX = event.clientX;
            state.lastScreenY = event.clientY;
        });

    document
        .getElementById('content')
        .addEventListener('mousemove', (event) => {
            event.preventDefault();
            if (state.isMove) {
                const deltaX = event.clientX - state.lastScreenX;
                const deltaY = event.clientY - state.lastScreenY;
                COIN.rotation.y += deltaX / 100;
                COIN.rotation.x += deltaY / 100;
                state.lastScreenX = event.clientX;
                state.lastScreenY = event.clientY;
            }
        });

    loop();
});

function loop() {
    requestAnimationFrame(loop);

    renderer.render(scene, camera);
}
