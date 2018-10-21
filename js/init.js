let
  WIDTH = window.innerWidth,
  HEIGHT = window.innerHeight,
  FOV = 45,
  RATIO = WIDTH / HEIGHT,
  NEAR = 0.1,
  FAR = 10000

const scene = new THREE.Scene()
scene.background = new THREE.Color('#fff')
const canvaContainer = document.getElementById('container')

const camera = new THREE.PerspectiveCamera(FOV, RATIO, NEAR, FAR)
camera.position.z = 500
const controls = new THREE.OrbitControls( camera )
controls.update()

const renderer = new THREE.WebGLRenderer({
  preserveDrawingBuffer: true,
})
renderer.setSize( WIDTH, HEIGHT )
canvaContainer.appendChild( renderer.domElement )

export {
	scene,
	camera,
	renderer,
	controls
}
