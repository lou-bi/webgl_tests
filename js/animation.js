import {
  scene,
  renderer,
  camera,
  controls
} from './init.js'
import {
  PS
} from './meshes.js'
// debugger
const size = 20

scene.add( getCleaner() )
/**
 * Gravity
 */
// F = G * ((m1*m2)/d²)
const animation = () => {
  
  requestAnimationFrame( animation )
  controls.update()
  // PS.positionAdd(0.1)
  // PS.particles.geometry.attributes.position.needsUpdate = true
  PS.particles.rotation.z += 0.005
  PS.particles.rotation.y += 0.005
  renderer.render( scene, camera )

}

export {
  animation
}

function getCleaner() {
  const t = new THREE.Mesh(
    new THREE.BoxGeometry( 100, 100, 100 ),
    new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.05,
      side: THREE.DoubleSide
    })
  )
  return t
}