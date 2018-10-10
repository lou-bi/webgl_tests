/* global THREE, requestAnimationFrame */

let camera, scene, renderer, material
let mouseX = 0; let mouseY = 0

let windowHalfX = window.innerWidth / 2
let windowHalfY = window.innerHeight / 2
let particles
const NB_PARTICLES = 10000
init()
animate()

function init () {
  camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 2, 2000)
  camera.position.z = 1000

  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x000000, 0.001)

  const geometry = new THREE.BufferGeometry()
  const vertices = []

  const sprite = new THREE.TextureLoader().load('img/particle.png')

  for (let i = 0; i < NB_PARTICLES; i++) {
    const x = 2000 * Math.random() - 1000
    const y = 2000 * Math.random() - 1000
    const z = 2000 * Math.random() - 1000

    vertices.push(x, y, z)
  }

  geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))

  material = new THREE.PointsMaterial({
    size: 25,
    // sizeAttenuation: false,
    map: sprite,
    alphaTest: 0.6
    // transparent: true
  })
  material.color.setHSL(1.0, 0.3, 0.7)
  
  particles = new THREE.Points(geometry, material)
  scene.add(particles)

  //

  renderer = new THREE.WebGLRenderer()
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  //

  document.addEventListener('mousemove', onDocumentMouseMove, false)
  document.addEventListener('touchstart', onDocumentTouchStart, false)
  document.addEventListener('touchmove', onDocumentTouchMove, false)

  //

  window.addEventListener('resize', onWindowResize, false)
}

function onWindowResize () {
  windowHalfX = window.innerWidth / 2
  windowHalfY = window.innerHeight / 2

  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
}

function onDocumentMouseMove (event) {
  mouseX = event.clientX - windowHalfX
  mouseY = event.clientY - windowHalfY
}

function onDocumentTouchStart (event) {
  if (event.touches.length == 1) {
    event.preventDefault()

    mouseX = event.touches[ 0 ].pageX - windowHalfX
    mouseY = event.touches[ 0 ].pageY - windowHalfY
  }
}

function onDocumentTouchMove (event) {
  if (event.touches.length == 1) {
    event.preventDefault()

    mouseX = event.touches[ 0 ].pageX - windowHalfX
    mouseY = event.touches[ 0 ].pageY - windowHalfY
  }
}

//

function animate () {
  requestAnimationFrame(animate)

  render()
}

function render () {
  const time = Date.now() * 0.0001

  camera.position.x += (mouseX - camera.position.x) * 0.05
  camera.position.y += (-mouseY - camera.position.y) * 0.05
  for (var i = 0; i < scene.children.length; i++) {
    var object = scene.children[ i ]

    if (object instanceof THREE.Points) {
      object.rotation.y = time * (i < 4 ? i + 1 : -(i + 1))
      object.rotation.x = time * (i < 4 ? i + 1 : -(i + 1))
      object.rotation.z = time * (i < 4 ? i + 1 : -(i + 1))
    }
  }
  camera.lookAt(scene.position)
  // const x = Math.sin(time * 100)
  // const y = Math.cos(time * 100)
  // // particles.position.x += x
  // // particles.position.y += y
  // particles.position.z += x
  const h = (360 * (1.0 + time) % 360) / 360
  material.color.setHSL(h, 0.5, 0.5)

  renderer.render(scene, camera)
}
