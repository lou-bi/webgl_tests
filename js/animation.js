import {
  scene,
  renderer,
  camera,
  controls
} from './init.js'
import { make } from './lights.js'
make()
const geoCube = new THREE.BoxGeometry(200, 200, 200)
const matCube = new THREE.MeshBasicMaterial({
  // color: 0xffffff,
  transparent: true,
  // opacity: 0.2
})
const cube = new THREE.Mesh(geoCube, matCube)

const {
  width: cw,
  height: ch,
  depth: cd
} = cube.geometry.parameters

const scl = 20
let
  colx = cw / scl,
  coly = ch / scl,
  colz = cd / scl

const childs = []
let inc = 0.01
let xoff = 0
for (let x = 0; x < colx; x++) {
  let yoff = 0
  for (let y = 0; y < coly; y++) {
    let zoff = 0
    for (let z = 0; z < colz; z++) {

      const noise = ImprovedNoise().noise(xoff, yoff, zoff)
      const size = scl / 3
      const cg = new THREE.BoxGeometry(size, size, size)
      const cm = new THREE.MeshLambertMaterial({
        transparent: true,
        // color: 0xcccccc
        opacity: 0.5,
        // blending: THREE.AdditiveBlending
      })
      const nc = new THREE.Mesh(cg, cm)
      nc.position.x = x * scl - (cw / 2)
      nc.position.y = y * scl - (ch / 2)
      nc.position.z = z * scl - (cd / 2)
      childs.push(nc)

      zoff += inc
    }
    yoff += inc
  }
  xoff += inc
}
scene.add(...childs)
const clock = new THREE.Clock()
const animation = () => {

  requestAnimationFrame( animation )
  controls.update()
  for (let i = 0; i < childs.length; i++) {
    const t = clock.getElapsedTime()
    const r = ImprovedNoise().noise(t, 0, 0) + i / 1000
    const g = ImprovedNoise().noise(0, t, 0) + i / 1000
    const b = ImprovedNoise().noise(0, 0, t) + i / 1000
    const col = new THREE.Color(r, g, b)
    // childs[i].material.color = col
    childs[i].rotation.x += 0.01
    childs[i].rotation.y += 0.01
    childs[i].rotation.z += 0.01
  }

  renderer.render( scene, camera )
}

;(() => {
  animation()
})()
