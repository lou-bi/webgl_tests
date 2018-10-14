/* global THREE, requestAnimationFrame */
import {
	scene
} from './init.js'
import axis from './components/axis.js'
// import Particle from './components/particle.js'

const
	nbParticles = 100000
let
	particleSystem,
	meshes = {}

// scene.add(...axis())

const radius = 50

const
	particles = new THREE.Geometry(),
	attractor1G = new THREE.Geometry(),
	attractor2G = new THREE.Geometry(),
	particleMaterial = new THREE.PointsMaterial({
	  size: 0.1,
	  color: 0xffc000,
	  // color: 0x00aaff,
	  // map: new THREE.TextureLoader().load('img/star.png'),
	  // depthWrite: true,
	  blending: THREE.AdditiveBlending,
	  transparent: true,
	  opacity: 0.2,
	  // alphaTest: 0.6
	}),
	attractorMaterial = new THREE.PointsMaterial({
	  color: 0xffffff,
	  size: 1,
	  map: new THREE.TextureLoader().load('img/particle.png'),
	  depthWrite: true,
	  blending: THREE.AdditiveBlending,
	  // transparent: true,
	  // opacity: .5,
	  alphaTest: 0.6
	})

const amplitude = 5
for (let i = 0; i < nbParticles; i++) {
	const particle = new THREE.Vector3(
		// Math.random() * (amplitude * 2) - amplitude,
		// Math.random() * (amplitude * 2) - amplitude,
		// Math.random() * (amplitude * 2) - amplitude,
	)
	particle.velocity = new THREE.Vector3(
		Math.random() * .1 - .05,
		Math.random() * .1 - .05,
		Math.random() * .1 - .05
		// 0, 0, 0
	)
	particle.acceleration = new THREE.Vector3()
	particles.vertices.push(particle)
}
particleSystem = new THREE.Points( particles, particleMaterial )

attractor1G.vertices.push(new THREE.Vector3(0, 10, 0))
attractor2G.vertices.push(new THREE.Vector3(0, -10, 0))

let attractor1 = new THREE.Points(
	attractor1G,
	attractorMaterial
)
let attractor2 = new THREE.Points(
	attractor2G,
	attractorMaterial
)
const sphere = new THREE.SphereGeometry()
// const sphereMat = new THREE.
// Add to the export to play easily with in animation
meshes = { particleSystem, attractor1, attractor2 }

scene.add(
	particleSystem,
	attractor1,
	attractor2,
)

export {
	meshes
}
