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

const scl = 40
let
  colx = cw / scl,
  coly = ch / scl,
  colz = cd / scl

let inc = 0.01
let xoff = 0

const childs = []

const lineM = new THREE.LineBasicMaterial({ color: 0x000000 })

for (let x = 0; x < colx; x++) {
  let yoff = 0
  for (let y = 0; y < coly; y++) {
    let zoff = 0
    for (let z = 0; z < colz; z++) {

      const noise = ImprovedNoise().noise(xoff, yoff, zoff) * (Math.PI * 2)
      const size = scl / 3
      
      const lineG = new THREE.Geometry()
      
      const linex = x * scl - (cw / 2)
      const liney = y * scl - (ch / 2)
      const linez = z * scl - (cd / 2)
      
      const begin = new THREE.Vector3( linex, liney, linez )
      const end = begin.clone().addScalar(10)

      
      lineG.vertices.push(begin)
      lineG.vertices.push(end)

      const line = new THREE.LineSegments(lineG, lineM)
      // line.rotateOnAxis(middle, noise)

      childs.push(line)

      zoff += inc
    }
    yoff += inc
  }
  xoff += inc
}
scene.add(...childs)

let toadd = 0.01
const animation = () => {

  requestAnimationFrame( animation )
  controls.update()


  for (let i = 0; i < childs.length; i++) {
    const a = childs[i].geometry.vertices[0]
    const b = childs[i].geometry.vertices[1]
    const middle = (new THREE.Vector3(a)).add(new THREE.Vector3(b)).divideScalar(2).normalize()
  }

  renderer.render( scene, camera )
}

;(() => {
  animation()
})()
