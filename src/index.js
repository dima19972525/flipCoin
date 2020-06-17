import * as THREE from 'three';
import { OBJLoader } from 'three-obj-mtl-loader';

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
        zPos: -3,
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
        this._elem = config.elem;
        this._scene = new THREE.Scene();
        this._camera = new THREE.PerspectiveCamera(
            75,
            this._elem.clientWidth / this._elem.clientHeight,
            0.1,
            1000,
        );
        this._renderer = new THREE.WebGLRenderer({ alpha: true });
        this._renderer.setSize(this._elem.clientWidth, this._elem.clientHeight);

        this._elem.append(this._renderer.domElement);

        this._initLight({ color: config.lightColor });

        this._objLoader = new OBJLoader();
    }

    _initLight(config) {
        this._light = new THREE.SpotLight(config.color, 1, 1000);
        this._light.position.set(0, 0, 100);

        this._scene.add(this._light);
    }

    _loadTexture(model, texture) {
        const _texture = new THREE.TextureLoader().load(texture);
        model.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.material.map = _texture;
            }
        });
    }

    _loop() {
        requestAnimationFrame(() => this._loop());

        this._renderer.render(this._scene, this._camera);
    }

    loadModel({ model, texture }, callback) {
        this._objLoader.load(model, (_model) => {
            this.MODEL = _model;
            if (texture) {
                this._loadTexture(this.MODEL, texture);
            }

            this.MODEL.cursor = 'pointer';
            this.MODEL.position.z = this._config.zPos;

            this.MODEL.scale.set(
                this.MODEL.scale.x / this._config.scaleValue,
                this.MODEL.scale.y / this._config.scaleValue,
                this.MODEL.scale.z / this._config.scaleValue,
            );

            this._scene.add(this.MODEL);

            this._elem.addEventListener('mouseup', () => {
                event.preventDefault();
                this._state.isMove = false;
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
                    const deltaX = event.clientX - this._state.lastScreenX;
                    const deltaY = event.clientY - this._state.lastScreenY;
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
