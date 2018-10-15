
/* global THREE, requestAnimationFrame */

let
  WIDTH = window.innerWidth,
  HEIGHT = window.innerHeight,
  FOV = 45,
  RATIO = WIDTH / HEIGHT,
  NEAR = 0.1,
  FAR = 5000

const scene = new THREE.Scene()
scene.background = new THREE.Color('#000')
// scene.fog = new THREE.Fog('#fae321')
const canvaContainer = document.getElementById('container')

const camera = new THREE.PerspectiveCamera(FOV, RATIO, NEAR, FAR)
const controls = new THREE.OrbitControls( camera )
camera.position.z = 20
// camera.position.y = 100
controls.update()

const renderer = new THREE.WebGLRenderer({
  // preserveDrawingBuffer: true,
})
renderer.setSize( WIDTH, HEIGHT )
// renderer.autoClearColor = false
canvaContainer.appendChild( renderer.domElement )

export {
	scene,
	camera,
	renderer,
	controls
}
