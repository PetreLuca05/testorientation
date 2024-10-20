import * as THREE from 'three'
import { DeviceOrientationControls } from './DeviceOrientationControls'
import image from '../textures/bg.jpg'

let camera, scene, renderer, controls, environment, clock;

const startButton = document.getElementById('explore');
startButton.addEventListener( 'click', function () {init(true);}, false);

clock = new THREE.Clock();

//CAMERA SETUP
camera = new THREE.PerspectiveCamera( 85, window.innerWidth / window.innerHeight, 1, 1100 );
controls = new DeviceOrientationControls( camera );

//SCENE SETUP
scene = new THREE.Scene();

//ENVIROMENT SETUP
const _VS = `
varying vec2 vUv;
uniform float time;

void main() {
  vUv = uv;

  vec4 res;
  res = vec4(position.x, position.y, position.z, 1.0);
  gl_Position = projectionMatrix * modelViewMatrix * res;
}
`;

const _FS = `
uniform sampler2D texture1;
uniform float time;

varying vec2 vUv;

void main() {
  vec4 colorA = vec4(0.0, 0.0, 0.0, 0.0);
  vec4 col = texture2D(texture1, vUv);
  vec4 res = mix(colorA, col, time);

  gl_FragColor = vec4(res);
}
`;

const shaderAttributes = {
  texture1: { type: "t", value: new THREE.TextureLoader().load(image) },
  time: { type: "f", value: clock.getElapsedTime()},
};

const ENVgeometry = new THREE.SphereGeometry( 500, 60, 40 );
ENVgeometry.scale( - 1, 1, 1 );

const ENVmaterial = new THREE.ShaderMaterial( {
  uniforms: shaderAttributes,
  vertexShader: _VS,
  fragmentShader: _FS,
} );

environment = new THREE.Mesh(ENVgeometry, ENVmaterial);

//GRID
const helperGeometry = new THREE.BoxGeometry( 100, 100, 100, 4, 4, 4);
const helperMaterial = new THREE.MeshBasicMaterial( { color: 0xff00ff, wireframe: true } );
const helper = new THREE.Mesh( helperGeometry, helperMaterial );

const canvas = document.getElementById('canvas');
canvas.remove();

//RENDERER SETUP
function init(useHelper) {
  clock.start();

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild(renderer.domElement);

  animate();

  scene.add(environment);

  if(useHelper)
    scene.add( helper );
}

function animate() {
  window.requestAnimationFrame(animate);

  controls.update();
  renderer.render( scene, camera );

  if(shaderAttributes.time.value < 1)
    shaderAttributes.time.value = clock.getElapsedTime();
  else shaderAttributes.time.value = 1;
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});