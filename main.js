import * as THREE from 'three'
import { DeviceOrientationControls } from './DeviceOrientationControls'
import image from './textures/bg.jpg'
import { Clock } from 'three';

let camera, scene, renderer, controls;

const startButton = document.getElementById( 'startButton' );
startButton.addEventListener( 'click', function () {
  init();
  animate();

}, false );

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

const clock = new THREE.Clock();
const uniformsss = {
  texture1: { type: "t", value: new THREE.TextureLoader().load(image) },
  time: { type: "f", value: clock.getElapsedTime()},
};

function init() {
  const canvas = document.getElementById( 'canvas' );
  canvas.remove();

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );
  controls = new DeviceOrientationControls( camera );

  scene = new THREE.Scene();

  const geometry = new THREE.SphereGeometry( 500, 60, 40 );
  // invert the geometry on the x-axis so that all of the faces point inward
  geometry.scale( - 1, 1, 1 );

  const materialOLD = new THREE.MeshBasicMaterial( {
    map: new THREE.TextureLoader().load(image)
  } );

  const material = new THREE.ShaderMaterial( {
    uniforms: uniformsss,
    vertexShader: _VS,
    fragmentShader: _FS,
  } );

  const mesh = new THREE.Mesh( geometry, material );
  scene.add(mesh);

  const helperGeometry = new THREE.BoxGeometry( 100, 100, 100, 4, 4, 4);
  const helperMaterial = new THREE.MeshBasicMaterial( { color: 0xff00ff, wireframe: true } );
  const helper = new THREE.Mesh( helperGeometry, helperMaterial );
  scene.add( helper );

  //
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  function myGeeks() {
    clock.start();
  }

  clock.start();

  //setTimeout(myGeeks, 1000);

}

function animate() {
  window.requestAnimationFrame( animate );

  controls.update();
  renderer.render( scene, camera );


  if(uniformsss.time.value < 1)
    uniformsss.time.value = clock.getElapsedTime();
  else uniformsss.time.value = 1;


  //uniformsss.time.value = clock.getElapsedTime();

  //console.log(uniformsss.time.value);
}

const videoElement = document.getElementById('cam');

let facingMode = 'environment';
let constraints = {
  audio: false,
  video: {
    facingMode
  }
};

// Fix for iOS Safari from https://leemartin.dev/hello-webrtc-on-safari-11-e8bcb5335295
videoElement.setAttribute('autoplay', '');
videoElement.setAttribute('muted', '');
videoElement.setAttribute('playsinline', '')

navigator.mediaDevices.getUserMedia(constraints)
.then(function(stream) {
  videoElement.srcObject = stream;
})
.catch(error => {
  alert(error);
})
