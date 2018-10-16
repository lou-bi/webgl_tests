import {
  scene,
  renderer,
  camera,
  controls
} from './init.js'
import {
  PS
} from './meshes.js'
import event from './event.js'
event(renderer, camera)
const size = 20

renderer.autoClearColor = false
scene.add( getCleaner(10000) )


const sph1 = new THREE.Mesh(
  new THREE.SphereGeometry(10,32,32),
  new THREE.MeshBasicMaterial({
    color: 0x000000
  })
)

const sph2 = new THREE.Mesh(
  new THREE.SphereGeometry(10,32,32),
  new THREE.MeshBasicMaterial({
    color: 0x000000
  })
)

const sph3 = new THREE.Mesh(
  new THREE.SphereGeometry(10,32,32),
  new THREE.MeshBasicMaterial({
    color: 0x000000
  })
)
sph1.position.x = -250
sph1.position.y = 0
sph1.position.z = 0

sph2.position.x = 250
sph2.position.y = 0
sph2.position.z = 0

sph3.position.x = 0
sph3.position.y = 250
sph3.position.z = 0
scene.add(
  sph1,
  sph2,
  sph3
)
/**
 * Gravity
 */
// F = G * ((m1*m2)/d²)
const animation = () => {

  requestAnimationFrame( animation )
  controls.update()


  PS.applyGravityFrom(sph1.position)
  PS.applyGravityFrom(sph2.position)
  PS.applyGravityFrom(sph3.position)
  // PS.applyGravityFromSelf()
  PS.updatePositions()

  renderer.render( scene, camera )

}

export {
  animation
}

function getCleaner(dimensions) {
  const t = new THREE.Mesh(
    new THREE.BoxGeometry( dimensions, dimensions, dimensions ),
    new THREE.MeshBasicMaterial({
      transparent: true,
      color: 0x000000,
      // color: 0xffffff,
      opacity: 0.3,
      side: THREE.DoubleSide
    })
  )
  return t
}