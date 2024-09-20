import './style.css'
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

const doors = document.querySelector('.door');
const lefts = document.querySelector('.left');
const fronts = document.querySelector('.front');
const windowx = document.querySelector('.window');
const closes = document.querySelector('.close');

const canvas = document.querySelector('.webgl');
const scene = new THREE.Scene();

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', ()=>{
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
})

// Loading a model
let mixer = null;
let house = new THREE.Object3D();
const glftLoader = new GLTFLoader;
glftLoader.load('/house.glb', (gltf)=>{
    house = gltf.scene;
    mixer = new THREE.AnimationMixer(house);

    function door(){
        const action = mixer.clipAction(gltf.animations[0]);
        action.clampWhenFinished = true;
        action.setLoop(THREE.LoopOnce);
        action.play();
    }

    function close(){
        const action = mixer.clipAction(gltf.animations[0]);
        action.paused = false;
        action.timeScale = -1
        action.setLoop(THREE.LoopOnce)
        action.play();
    }

    function windows(){
        for(let i=1; i<3; i++){
            const actionx = mixer.clipAction(gltf.animations[i]);
            actionx.paused = false;
            actionx.clampWhenFinished = true;
            actionx.setLoop(THREE.LoopOnce);
            actionx.play();
        }  
    }

    function left(){
        house.rotation.y = Math.PI / 2;
    }

    function front(){
        house.rotation.y = 0;
    }

    document.addEventListener('keydown', (e)=>{
        if(e.key === 'd' || e.key ==='D'){
            door();
        }
        else if(e.key === 'c' || e.key ==='C'){
            close();
        }

        else if(e.key === 'w' || e.key === 'W'){
            windows();
        }

        else if(e.key === 'l' || e.key === 'L'){
            left();
        }

        else if(e.key === 'f' || e.key === 'F') {
            front();
        }
    })

    doors.addEventListener('click', ()=>{
        door();
    })

    closes.addEventListener('click', ()=>{
        close();
    })

    windowx.addEventListener('click', ()=>{
        windows();
    })

    lefts.addEventListener('click', ()=>{
        left();
    })

    fronts.addEventListener('click', ()=>{
        front();
    })

    scene.add(house);
})




const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

// Camera
const camera = new THREE.PerspectiveCamera(78, window.innerWidth / window.innerHeight);
camera.position.z = 6;
camera.position.y = 3.5;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);

controls.enabled = false;

// Renderer 
const renderer = new THREE.WebGLRenderer({
    canvas
})

renderer.setSize(window.innerWidth, window.innerHeight);

const clock = new THREE.Clock();
let prevTime = 0;
function animate(){
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - prevTime;
    prevTime = elapsedTime

    if(mixer !== null){
        mixer.update(deltaTime);
    }
    // glftLoader.rotation.x += 0.01;
    controls.update();
    renderer.setSize(window.innerWidth, window.innerHeight);
    window.requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

