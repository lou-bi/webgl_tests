import {
  scene,
  renderer,
  camera,
  controls
} from './init.js'
const texture = new THREE.TextureLoader().load('../img/ground.jpg')
texture.wrapS = THREE.RepeatWrapping
texture.wrapT = THREE.RepeatWrapping
texture.repeat.set(2,2)

const groundGeo = new THREE.PlaneGeometry(50, 50)
const groundMaterial = new THREE.MeshBasicMaterial({
  side: THREE.DoubleSide,
  color: 0xe1e1e1,
})
const ground = new THREE.Mesh(groundGeo, groundMaterial)
ground.rotation.x = -90
ground.position.y = -10

const ballGeo = new THREE.SphereGeometry(1, 32, 32)
const ballMaterial = new THREE.MeshBasicMaterial({
  color: 0x0088ff
})
const ball = new THREE.Mesh(ballGeo, ballMaterial)
ball.position.y = 10
ball.velocity = new THREE.Vector3(0, 0, 0)
ball.acceleration = new THREE.Vector3(0, -0.05, 0)
ball.density = 0.5
// ball.
scene.add(ground, ball)
/***********************************/
ball.update = function() {
  this.velocity.add(this.acceleration)
  this.position.add(this.velocity)
}
ball.collide = function(target) {
  if (target.position.y > (this.position.y - this.geometry.parameters.radius)) {
    this.position.y = target.position.y + this.geometry.parameters.radius
    this.velocity.y *= -1 + this.density
  }
}
const animation = () => {

  requestAnimationFrame( animation )
  controls.update()

  ball.update()
  ball.collide(ground)
  renderer.render( scene, camera )
}

;(() => {
  animation()
})()
