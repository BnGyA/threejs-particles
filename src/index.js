import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap'
import Model from './models.js';
/*------------------------------
Renderer
------------------------------*/
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/*------------------------------
Slider effect
------------------------------*/

// let speed = 0;
// let position = 0;
// let rounded = 0;
// let block = document.getElementById('block');
// let wrap = document.getElementById('wrap');
// let elems = [...document.querySelectorAll('.n')];


// // Event listener
// window.addEventListener('wheel', (e) => {
//   speed += e.deltaY * 0.0003;
//   position += speed;
//   rounded = Math.round(position);
//   console.log(rounded, speed);
// })

// Setup isScrolling variable
var isScrolling;
// Listen for scroll events
var scrolled = false;
var body = document.querySelector('body');
function animationIsRunning(){
  return body.classList.contains('active');
}
window.addEventListener('wheel', function ( event ) {
	// Clear our timeout throughout the scroll
	window.clearTimeout( isScrolling );
	// Set a timeout to run after scrolling ends
	isScrolling = setTimeout(function() {
		// Run the callback
    
		console.log( 'Scrolling has stopped.' );

    if(event.deltaY >1 && !animationIsRunning()){
      console.log(fehu);
      fehu.add()
      uruz.remove()
      thorn.remove()
    }else if(event.deltaY <1 && !animationIsRunning()){
      uruz.add()
      fehu.remove()
      thorn.remove()
    }
    
	}, 66);

}, false);

/*------------------------------
Scene & Camera
------------------------------*/
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.z = 5;
camera.position.y = 1;


/*------------------------------
Mesh
------------------------------*/
const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
});
const cube = new THREE.Mesh(geometry, material);
//scene.add( cube );


/*------------------------------
OrbitControls
------------------------------*/
const controls = new OrbitControls(camera, renderer.domElement);
controls.enabled = false;


/*------------------------------
Helpers 
------------------------------*/
// const gridHelper = new THREE.GridHelper( 10, 10 );
// scene.add( gridHelper );
// const axesHelper = new THREE.AxesHelper( 5 );
// scene.add( axesHelper );


/*------------------------------
Models
------------------------------*/
const uruz = new Model({
  name: 'uruz',
  color1: 'red',
  color2: 'yellow',
  background: '#47001b',
  file: './models/uruz.glb',
  scene: scene,
  placeOnLoad: true,
  positionMoved: 0
});

const fehu = new Model({
  name: 'fehu',
  color1: 'blue',
  color2: 'pink',
  background: '#110047',
  file: './models/fehu.glb',
  scene: scene,
  positionMoved: 1
});

const thorn = new Model({
  name: 'thorn',
  color1: 'blue',
  color2: 'pink',
  background: '#110047',
  file: './models/ythorno.glb',
  scene: scene,
  positionMoved: 2
});

let models = ['uruz', 'fehu', 'thorn'];



/*------------------------------
Controller
------------------------------*/
const buttons = document.querySelectorAll('.button')
buttons[0].addEventListener('click', () => {
  uruz.add()
  fehu.remove()
  thorn.remove()
})

buttons[1].addEventListener('click', () => {
  fehu.add()
  uruz.remove()
  thorn.remove()
})

buttons[2].addEventListener('click', () => {
  thorn.add()
  uruz.remove()
  fehu.remove()
})

buttons[3].addEventListener('click', () => {
  thorn.add()
  uruz.add()
  fehu.add()
})


/*------------------------------
Clock
------------------------------*/
const clock = new THREE.Clock();

/*------------------------------
Loop
------------------------------*/
//-slider
let objs = Array(5).fill({ dist: 0 });

const animate = function () {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  if (uruz.isActive) {
    uruz.particlesMaterial.uniforms.uTime.value = clock.getElapsedTime();
  }
  if (fehu.isActive) {
    fehu.particlesMaterial.uniforms.uTime.value = clock.getElapsedTime();
  }
  if (thorn.isActive) {
    thorn.particlesMaterial.uniforms.uTime.value = clock.getElapsedTime();
  }


  // // Slider effect
  // position += speed;

  // // Inertia
  // speed *= 0.8;
  // rounded = Math.round(position);

  // // Update the scale of the object depending of the distance from the cube
  // objs.forEach((o, i) => {
  //   o.dist = Math.min(Math.abs(position - i), 1);
  //   o.dist = 1 - o.dist ** 2;

  //   elems[i].style.transform = `scale(${1 + 0.4 * o.dist})`
  // });

  // // Lerp
  // let diff = rounded - position;
  // position += Math.sign(diff) * Math.pow(Math.abs(diff), 0.5) * 0.015;
  // //block.style.transform = `translate(0,${position*100 + 50}px)`
  // wrap.style.transform = `translate(0,${-position * 100 - 50}px)`;

};
animate();


/*------------------------------
Resize
------------------------------*/
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize, false);

/*------------------------------
MouseMove
------------------------------*/
function onMouseMove(e) {
  const x = e.clientX
  const y = e.clientY

  gsap.to(scene.rotation, {
    y: gsap.utils.mapRange(0, window.innerWidth, .2, -.2, x),
    x: gsap.utils.mapRange(0, window.innerHeight, .2, -.2, y)
  })
}
window.addEventListener('mousemove', onMouseMove)



