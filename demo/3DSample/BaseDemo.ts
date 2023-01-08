import {
    DefaultLoadingManager, DoubleSide, FileLoader, Group, Mesh, MeshBasicMaterial,
    PerspectiveCamera, PlaneGeometry, RepeatWrapping,
    Scene, Texture, TextureLoader, Vector2, WebGLRenderer
} from 'three';
import { ThreeFactory } from '@dragonbones-threejs';

import backgroundPng from '../assets/background.png';

import { OrbitControls } from './OrbitControls.js';

export abstract class BaseDemo extends Group {
    private static readonly BACKGROUND_URL: string = backgroundPng;
    private readonly _scene: Scene = new Scene();
    //private readonly _camera: OrthographicCamera = new OrthographicCamera(-0.5, 0.5, -0.5, 0.5, -1000, 1000);
    private readonly _camera: PerspectiveCamera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    private readonly _renderer: WebGLRenderer = new WebGLRenderer({ antialias: true });

    private readonly controls: OrbitControls = new OrbitControls(this._camera, this._renderer.domElement);

    private readonly _background: Mesh = new Mesh(new PlaneGeometry(1, 1));
    protected readonly _resources: string[] = [BaseDemo.BACKGROUND_URL];
    protected readonly _loadedResources: { [key: string]: any | ArrayBuffer | Texture } = {};

    public constructor() {
        super();

        this._scene.add(this);
        this._renderer.setClearColor(0x666666);
        this._renderer.setSize(1136, 640);

        this.scale.setY(-1.0);

        this._camera.position.set(0, 0, 1000);

        this._camera.updateProjectionMatrix();
        document.body.appendChild(this._renderer.domElement);
        //
        setTimeout(() => {
            this._loadResources();
        }, 10);

        this.controls.minDistance = 100;
        this.controls.maxDistance = 750;
    }

    protected abstract _onStart(): void;

    protected _startTick(): void {
        const update = () => {
            this.controls.update();

            ThreeFactory.factory.dragonBones.advanceTime(-1.0);
            this._renderer.render(this._scene, this._camera);

            requestAnimationFrame(update);
        };

        update();
    }

    protected _loadResources(): void {
        for (const resource of this._resources) {
            if (resource.indexOf("dbbin") > 0) {
                const loader = new FileLoader();
                loader.setResponseType("arraybuffer");
                loader.load(resource, (result: any) => {
                    this._loadedResources[resource] = result;
                });
            }
            else if (resource.indexOf(".png") > 0) {
                const loader = new TextureLoader();
                this._loadedResources[resource] = loader.load(resource);
            }
            else {
                const loader = new FileLoader();
                loader.setResponseType("json");
                loader.load(resource, (result: any) => {
                    this._loadedResources[resource] = result;
                });
            }
        }

        DefaultLoadingManager.onLoad = () => {
            const backgroundTexture = this._loadedResources[BaseDemo.BACKGROUND_URL] as THREE.Texture;
            backgroundTexture.wrapS = RepeatWrapping;
            backgroundTexture.wrapT = RepeatWrapping;
            this._background.material = new MeshBasicMaterial({ map: backgroundTexture, side: DoubleSide });
            this._background.scale.set(backgroundTexture.image.width, backgroundTexture.image.height, 1.0);
            this._background.position.z = -10;
            this.add(this._background);
            //
            this._startTick();
            this._onStart();
        };
    }

    // public createText(string: string): PIXI.Text {
    //     const text = new PIXI.Text(string, { align: "center" });
    //     text.text = string;
    //     text.scale.x = 0.7;
    //     text.scale.y = 0.7;
    //     text.x = - text.width * 0.5;
    //     text.y = this.stageHeight * 0.5 - 100.0;
    //     this.addChild(text);

    //     return text;
    // }

    public get stageWidth(): number {
        return this._renderer.getSize(new Vector2()).width;
    }

    public get stageHeight(): number {
        return this._renderer.getSize(new Vector2()).height;
    }
}