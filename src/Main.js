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



        this.renderer.setSize(this.width, this.height);
        this.container.appendChild(this.renderer.domElement);


        window.addEventListener('resize', (e) => {
            this.width = this.container.clientWidth * window.devicePixelRatio;
            this.height = this.container.clientHeight * window.devicePixelRatio;

            renderer.setSize(this.width, this.height);
            camera.aspect = this.width / this.height;
            camera.updateProjectionMatrix();
        });


        this.start();
    }


    start(){
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate)
        }
    }

    renderScene(){
        const dt = this.Clock.getDelta();
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

