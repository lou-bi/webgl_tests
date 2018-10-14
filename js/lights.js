import {
	scene
} from './init.js'

const make = () => {
	const pLight1 = new THREE.PointLight( 0xffffff, 1, 100 )
	const pLight2 = new THREE.PointLight( 0xffffff, 1, 100 )
	const ambientLight = new THREE.AmbientLight( 0xffffff )

	pLight1.position.set( 20, 20, 50 )
	pLight2.position.set( -20, -20, 50 )
	
	scene.add( pLight1, pLight2, ambientLight )
}

export {
	make
}
