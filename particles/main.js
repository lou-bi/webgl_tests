/* global THREE, requestAnimationFrame */
let renderer, scene, camera, stats

let particleSystem, uniforms, geometry

let particles = 100000

init()
animate()

function init () {
  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000)
  camera.position.z = 300

  scene = new THREE.Scene()

  // uniforms = {

  //   texture: { value: new THREE.TextureLoader().load('textures/sprites/spark1.png') }

  // }

  // let shaderMaterial = new THREE.ShaderMaterial({

  //   uniforms: uniforms,
  //   vertexShader: document.getElementById('vertexshader').textContent,
  //   fragmentShader: document.getElementById('fragmentshader').textContent,

  //   blending: THREE.AdditiveBlending,
  //   depthTest: false,
  //   transparent: true,
  //   vertexColors: true

  // })

  let radius = 200

  geometry = new THREE.BufferGeometry()

  let positions = []
  let colors = []
  let sizes = []

  let color = new THREE.Color()

  for (let i = 0; i < particles; i++) {
    positions.push((Math.random() * 2 - 1) * radius)
    positions.push((Math.random() * 2 - 1) * radius)
    positions.push((Math.random() * 2 - 1) * radius)

    color.setHSL(i / particles, 1.0, 0.5)

    colors.push(color.r, color.g, color.b)

    sizes.push(20)
  }

  geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  geometry.addAttribute('size', new THREE.Float32BufferAttribute(sizes, 1).setDynamic(true))

  particleSystem = new THREE.Points(geometry, new THREE.BasicMaterial())

  scene.add(particleSystem)

  renderer = new THREE.WebGLRenderer()
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)

  let container = document.getElementById('container')
  container.appendChild(renderer.domElement)

  window.addEventListener('resize', onWindowResize, false)
}

function onWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
}

function animate () {
  requestAnimationFrame(animate)

  render()
}

function render () {
  // let time = Date.now() * 0.005

  // particleSystem.rotation.z = 0.01 * time

  let sizes = geometry.attributes.size.array

  // for (let i = 0; i < particles; i++) {
  //   sizes[ i ] = 10 * (1 + Math.sin(0.1 * i + time))
  // }

  geometry.attributes.size.needsUpdate = true

  renderer.render(scene, camera)
}
