/* global THREE, requestAnimationFrame */
import {
	scene
} from './init.js'

import ParticleSystem from './components/ParticleSystem.js'

const PS = new ParticleSystem(50000, 4)

scene.add(PS.particles)

export {
	PS
}
