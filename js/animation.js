import {
  scene,
  renderer,
  camera,
  controls
} from './init.js'
import {
  meshes
} from './meshes.js'

const size = 20

const bounds = {
  top: size, bottom: -size,
  right: size, left: -size,
  front: size, rear: -size
}
/**
 * Gravity
 */
// F = G * ((m1*m2)/d²)
const { particleSystem, attractor1, attractor2 } = meshes
const particles = particleSystem.geometry.vertices

const wind = new THREE.Vector3()
const G = .05
// const G = 6.67408
const animation = () => {
  
  requestAnimationFrame( animation )
  controls.update()
  // const time = Date.now() * 0.001
  // console.log(wind)
  for (const el of particles) {
    // if (el.x > bounds.right || el.x < bounds.left) el.x = el.x *-1
    // if (el.y > bounds.top || el.y < bounds.bottom) el.y = el.y *-1
    // if (el.z > bounds.front || el.z < bounds.rear) el.z = el.z *-1
    // if (el.x > bounds.right || el.x < bounds.left)
    //   el.velocity.x *= -1
    // if (el.y > bounds.top || el.y < bounds.bottom)
    //   el.velocity.y *= -1
    // if (el.z > bounds.front || el.z < bounds.rear)
    //   el.velocity.z *= -1

    let n = (new THREE.Vector3()).subVectors(attractor1.geometry.vertices[0], el)
    let dsq = n.lengthSq()
    dsq = THREE.Math.clamp(dsq, 5, 25)
    // let str = G / 100
    let str = G / dsq
    // n.setLength(0.01)
    n.setLength(str)
    // n.clampLength(-1, 1)
    el.acceleration.add(n)
    // el.velocity.clampLength(-5, 5)
    ///////
    n = (new THREE.Vector3()).subVectors(attractor2.geometry.vertices[0], el)
    dsq = n.lengthSq()
    dsq = THREE.Math.clamp(dsq, 5, 25)
    // let str = G / 10000000000000
    str = G / dsq
    // n.setLength(0.01)
    n.setLength(str)
    el.acceleration.add(n)

    el.velocity.add(el.acceleration)
    el.add(el.velocity)
    el.acceleration.multiplyScalar(0)
    // el.velocity.negate()
  }
  // particleSystem.rotation.z += 0.01
  particleSystem.geometry.verticesNeedUpdate = true
  renderer.render( scene, camera )

}

export {
  animation
}
