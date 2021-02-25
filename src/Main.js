import React, { Component } from 'react';
import {FlyControls} from 'three/examples/jsm/controls/FlyControls'
import {WebGLRenderer} from "three/src/renderers/WebGLRenderer";
import {PerspectiveCamera} from "three/src/cameras/PerspectiveCamera";
import {Color} from "three/src/math/Color";
import {Scene} from 'three/src/scenes/Scene';
import {
    AmbientLight,
    AxesHelper, BackSide, BoxGeometry, Clock, DirectionalLight,
    GridHelper, Mesh, MeshBasicMaterial, PlaneBufferGeometry, SphereGeometry, TorusKnotGeometry,
} from "three";
import PortalsMain from "./portals/portals_main";




export default class GLStage extends Component{
    constructor(props){
        super(props);
        this.state={
            prevTime: 0
        }
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.animate = this.animate.bind(this);
        this.renderScene = this.renderScene.bind(this);
        this.setupScene = this.setupScene.bind(this);
        this.destroyContext = this.destroyContext.bind(this);
        this.handleWindowResize = this.handleWindowResize.bind(this);

        this.components = [];


    }

    componentDidMount(){
        this.setupScene();
        window.addEventListener('resize', this.handleWindowResize)
    }

    setupScene(){
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;

        const canvas = document.createElement( 'canvas' );
        // const context = canvas.getContext( 'webgl2', { alpha: false } );
        const context = canvas.getContext( 'webgl', { alpha: false } );
        const renderer = new WebGLRenderer({
            canvas: canvas,
            context: context,
            powerPreference: "high-performance",
            logarithmicDepthBuffer: false,
            antialias: false,
            stencil: false,
            depth: false
        });

        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = false;
        renderer.gammaOutput = false;
        // renderer.shadowMap.type = PCFSoftShadowMap;
        renderer.autoClear = false;
        // console.log('%c RENDERER', 'color:green;');


        const camera = new PerspectiveCamera(60, this.width / this.height, 1, 10000);
        // scene.add(camera)
        //TODO
        // const controls = new FlyControls(camera, renderer.domElement);

        this.Clock = new Clock();
        this.renderer = renderer;
        // this.scene = scene;
        this.camera = camera;
        // this.controls = controls;

        const essentials = Object.assign({}, {
            renderer, camera
        });

        // essentials.scene.add(new AxesHelper(10));
        // essentials.scene.add(new GridHelper(10, 10));


        this.renderer.setSize(this.width, this.height);
        this.container.appendChild(this.renderer.domElement);


        window.addEventListener('resize', (e) => {
            this.width = this.container.clientWidth * window.devicePixelRatio;
            this.height = this.container.clientHeight * window.devicePixelRatio;

            renderer.setSize(this.width, this.height);
            camera.aspect = this.width / this.height;
            camera.updateProjectionMatrix();
        });

        //TODO props object
        this.Portals = initPortals({renderer: this.renderer, camera: this.camera});

        this.start();
    }


    start(){
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate)
        }
    }

    renderScene(){
        const dt = this.Clock.getDelta();
        this.Portals.update(dt);
        this.Portals.render(dt);
    }

    animate() {
        this.frameId = requestAnimationFrame(this.animate);
        this.renderScene();
    }

    stop() {
        cancelAnimationFrame(this.frameId);
    }

    handleWindowResize(){
        let width = window.innerWidth;
        let height = window.innerHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    componentWillUnmount(){
        this.stop();
        this.destroyContext();
    }

    destroyContext(){
        this.container.removeChild(this.renderer.domElement);
        this.renderer.forceContextLoss();
        this.renderer.context = null;
        this.renderer.domElement = null;
        this.renderer = null;
    }

    render() {
        const width = '100vw';
        const height = '100vh';
        return (
            <>
                <div
                    ref={(container) => {
                        this.container = container
                    }}
                    style={{width: width, height: height, overflow: 'hidden'}}
                >
                </div>
                <div id={'tools'}></div>
                <div id={'ui'}></div>
            </>
        )
    }
}


function initPortals(props){

    const portals = new PortalsMain(props)

    portals.registerScene('scene-1', initScene1());
    portals.registerScene('scene-2', initScene2());

    // then create the portals
    let portal1 = portals.createPortal(20, 20, 'scene-1');
    portal1.position.set(-50, 10, 0);

    let extraPortal = portals.createPortal(20, 20, 'scene-1');
    extraPortal.position.set(50, 10, 0);

    let portal2 = portals.createPortal(20, 20, 'scene-2');
    portal2.position.set(0, 10, 0);
    portal2.rotateY(Math.PI);

    // then link the portals (portals don't have to be bi-directional)
    portal1.setDestinationPortal(portal2);
    portal2.setDestinationPortal(portal1);
    extraPortal.setDestinationPortal(portal1);

    // then set the starting scene
    portals.setCurrentScene('scene-1');

    // set the starting camera position
    portals.setCameraPosition(0, 0, 60);

    return portals;
}





function initScene1() {
    const scene1 = new Scene();

    // place some objects in the scene
    let geometry, material, mesh, light;

    // sky
    geometry = new SphereGeometry(1000);
    material = new MeshBasicMaterial({color: 0xaaaaaa, side: BackSide});
    const mesh1 = new Mesh(geometry, material);
    scene1.add(mesh1);

    // a box in the center
    geometry = new BoxGeometry(400, 25, 20);
    material = new MeshBasicMaterial({color: 0xFFFFFF});
    const mesh2 = new Mesh(geometry, material);
    mesh2.position.set(0, 12.5, -10);
    scene1.add(mesh2);

    // something fancy to look at
    geometry = new TorusKnotGeometry(10, 1, 64, 8, 3, 5);
    material = new MeshBasicMaterial({color: 0x00FF00});
    const mesh3 = new Mesh(geometry, material);
    mesh3.position.set(0, 20, 75);
    scene1.add(mesh3);

    geometry = new TorusKnotGeometry(10, 1, 64, 8, 7, 11);
    material = new MeshBasicMaterial({color: 0x00FF00});
    const mesh4 = new Mesh(geometry, material);
    mesh4.position.set(0, 20, -75);
    scene1.add(mesh4);

    // the floor
    geometry = new PlaneBufferGeometry(400, 400);
    material = new MeshBasicMaterial({color: 0x0000ff});
    const mesh5 = new Mesh(geometry, material);
    mesh5.rotation.x = Math.PI * 1.5;
    scene1.add(mesh5);

    // lights
    light = new DirectionalLight(0x000000, 1);
    light.position.set(1, 1, -1).normalize();
    scene1.add(light);

    light = new AmbientLight(0x101010);
    scene1.add(light);
    return scene1;
}

function initScene2() {
    const scene2 = new Scene();

    // place some objects in the scene
    let geometry, material, mesh, light;

    // sky
    geometry = new SphereGeometry(1000);
    material = new MeshBasicMaterial({color: 0xeeeeee, side: BackSide});
    mesh = new Mesh(geometry, material);
    scene2.add(mesh);

    // a box in the center
    geometry = new BoxGeometry(40, 25, 20);
    material = new MeshBasicMaterial({color: 0xFFFFFF});
    mesh = new Mesh(geometry, material);
    mesh.position.set(0, 12.5, 10);
    scene2.add(mesh);

    // something fancy to look at
    geometry = new TorusKnotGeometry(10, 4, 64, 8, 2, 3);
    material = new MeshBasicMaterial({color: 0xFF0000});
    mesh = new Mesh(geometry, material);
    mesh.position.set(0, 20, -75);
    scene2.add(mesh);

    // the floor
    geometry = new PlaneBufferGeometry(400, 400);
    material = new MeshBasicMaterial({color: 0xff00ff});
    mesh = new Mesh(geometry, material);
    mesh.rotation.x = Math.PI * 1.5;
    scene2.add(mesh);

    // lights
    light = new DirectionalLight(0x000000, 1);
    light.position.set(1, 1, -1).normalize();
    scene2.add(light);

    light = new AmbientLight(0x101010);
    scene2.add(light);
    return scene2;
}