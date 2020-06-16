import * as THREE from 'three';
import * as settings from './settings.js';
import { OBJLoader } from 'three-obj-mtl-loader';
import state from './state';

export class Object3D {
    /* 
    example of config
     {
        elem: document.getElementById('..'),  (html element)
        lightColor?: 0xffffff (color of light, default is 0xffffff),
        zPos: -3 (position of z index of your model, default is -3),
        scaleValue: 2 (this is used to make your object smaller, default value is 15)
     }
    */
    constructor(config) {
        this._config = {
            ...this._config,
            ...config,
        };
        this._initGlobalObjects(config);
    }

    _config = {
        lightColor: 0xffffff,
        zPos: -1,
        scaleValue: 15,
    };

    _scene = null;
    _camera = null;
    _renderer = null;
    _elem = null;
    _light = null;
    _objLoader = null;
    MODEL = null;

    _state = {
        isMove: false,
        lastScreenX: null,
        lastScreenY: null,
    };

    _initGlobalObjects(config) {
        this._scene = new THREE.Scene();
        this._camera = new THREE.PerspectiveCamera(
            75,
            settings.width / settings.height,
            0.1,
            1000,
        );
        this._renderer = new THREE.WebGLRenderer();
        this._renderer.setSize(settings.width, settings.height);

        this._elem = config.elem;
        this._elem.append(this._renderer.domElement);

        this._initLight({ color: config.lightColor });

        this._objLoader = new OBJLoader();
    }

    _initLight(config) {
        this._light = new THREE.SpotLight(config.color, 1, 1000);
        this._light.position.set(0, 0, 100);

        this._scene.add(this._light);
    }

    _loadTexture(model) {
        const texture = new THREE.TextureLoader().load(texture);
        model.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.material.map = texture;
            }
        });
    }

    _loop() {
        requestAnimationFrame(this._loop);

        this._renderer.render(this._scene, this._camera);
    }

    loadModel({ objModel, texture }, callback) {
        this._objLoader.load(objModel, (model) => {
            this.MODEL = model;
            if (texture) {
                this._loadTexture(texture);
            }

            model.cursor = 'pointer';
            model.position.z = this._config.zPos;

            model.scale.set(
                model.scale.x / this._config.scaleValue,
                model.scale.y / this._config.scaleValue,
                model.scale.z / this._config.scaleValue,
            );

            this._scene.add(model);

            this._elem.addEventListener('mouseup', () => {
                event.preventDefault();
                state.isMove = false;
            });
            this._elem.addEventListener('mouseout', () => {
                event.preventDefault();
                this._state.isMove = false;
            });

            this._elem.addEventListener('mousedown', (event) => {
                event.preventDefault();
                this._state.isMove = true;
                this._state.lastScreenX = event.clientX;
                this._state.lastScreenY = event.clientY;
            });

            this._elem.addEventListener('mousemove', (event) => {
                event.preventDefault();
                if (this._state.isMove) {
                    const deltaX = event.clientX - state.lastScreenX;
                    const deltaY = event.clientY - state.lastScreenY;
                    this.MODEL.rotation.y += deltaX / 100;
                    this.MODEL.rotation.x += deltaY / 100;
                    this._state.lastScreenX = event.clientX;
                    this._state.lastScreenY = event.clientY;
                }
            });
            if (callback) {
                callback(this.MODEL);
            }

            this._loop();
        });
    }
}
