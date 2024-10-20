import * as THREE from 'three'
import { DeviceOrientationControls } from './DeviceOrientationControls'
import image from './textures/bg.jpg'

let camera, scene, renderer, controls;

const startButton = document.getElementById( 'startButton' );
startButton.addEventListener( 'click', function () {

  init();
  animate();

}, false );

const _VS = `
varying vec2 vertexUV;

void main(){
  vertexUV = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;
const _FS = `
uniform sampler2D image;

varying vec2 vertexUV;

void main(){
  vec3 color = texture2D(image, vertexUV).rgb;
  gl_FragColor = vec4(color, 1.0);
}`;

function init() {
  const canvas = document.getElementById( 'canvas' );
  canvas.remove();

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );

  controls = new DeviceOrientationControls( camera );

  scene = new THREE.Scene();

  const geometry = new THREE.SphereGeometry( 500, 60, 40 );
  // invert the geometry on the x-axis so that all of the faces point inward
  geometry.scale( - 1, 1, 1 );

  const material = new THREE.MeshBasicMaterial( {
    map: new THREE.TextureLoader().load(image)
  } );

  const material2 = new THREE.ShaderMaterial( {
    uniforms: {
      texture: new THREE.TextureLoader().load(image)
    },
    vertexShader: _VS,
    fragmentShader: _FS,
  } );

  const mesh = new THREE.Mesh( geometry, material );
  scene.add( mesh );

  const helperGeometry = new THREE.BoxGeometry( 100, 100, 100, 4, 4, 4);
  const helperMaterial = new THREE.MeshBasicMaterial( { color: 0xff00ff, wireframe: true } );
  const helper = new THREE.Mesh( helperGeometry, helperMaterial );
  scene.add( helper );

  //
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  //
  window.addEventListener( 'resize', onWindowResize, false );
}

function animate() {
  window.requestAnimationFrame( animate );

  controls.update();
  renderer.render( scene, camera );
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
}

const videoElement = document.getElementById('cam');

let facingMode = 'user';
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
