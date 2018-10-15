/* global THREE, requestAnimationFrame */
import {
	scene
} from './init.js'

import ParticleSystem from './components/ParticleSystem.js'

const PS = new ParticleSystem(100000, 10)

scene.add(PS.particles)

export {
	PS
}
