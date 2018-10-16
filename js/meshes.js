/* global THREE, requestAnimationFrame */
import {
	scene
} from './init.js'

import ParticleSystem from './components/ParticleSystem.js'

const PS = new ParticleSystem(3, 40)

scene.add(PS.particles)

export {
	PS
}
