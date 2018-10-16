export default class ParticleSystem {
  constructor( maxParticles = 1000, size = 2 ) {
    this.maxParticles = maxParticles
    this.size = size
    this.particles = this.make()
    this.G = 5
  }
  make() {
    return new THREE.Points(
      this.createGeometry(),
      this.createMaterial()
    )
  }
  applyGravityFromSelf() {
    const positions = this.particles.geometry.attributes.position.array
    for (let i = 0; i < positions.length; i++) {
      this.applyGravityFrom(positions[i++], positions[i++], positions[i])
    }
  }
  applyGravityFrom({x, y, z}) {
    const positions = this.particles.geometry.attributes.position.array
    const accelerations = this.particles.geometry.attributes.acceleration.array
    const force = this.particles.geometry.attributes.force.array
    const directions = []
    const newAccelerations = []

    for (let i = 0; i < positions.length; i += 3) {
      const difX = x - positions[i]
      const difY = y - positions[i + 1]
      const difZ = z - positions[i + 2]
      const distance = Math.sqrt(
        ( Math.pow(difX, 2) +
          Math.pow(difY, 2) +
          Math.pow(difZ, 2)
        )
      )

      if (distance >= 4) {
        directions.push(
          (difX * 2 * this.G) / Math.pow(distance, 2),
          (difY * 2 * this.G) / Math.pow(distance, 2),
          (difZ * 2 * this.G) / Math.pow(distance, 2)
        )
      } else {
        directions.push(
          0,
          0,
          0
        )
      }
      newAccelerations.push(
        accelerations[i] + directions[i],
        accelerations[i + 1] + directions[i + 1],
        accelerations[i + 2] + directions[i + 2]
      )
    }
    this.particles.geometry.attributes.force.set(directions)
    this.particles.geometry.attributes.acceleration.set(newAccelerations)
    this.particles.geometry.getAttribute('force').needsUpdate = true
    this.particles.geometry.getAttribute('acceleration').needsUpdate = true
  }
  setAcceleration(array) {
    this.particles.geometry.getAttribute('acceleration').set(array)
    this.particles.geometry.getAttribute('acceleration').needsUpdate = true
  }
  updatePositions() {
    const positions = this.particles.geometry.attributes.position.array
    const velocities = this.particles.geometry.attributes.velocity.array
    const accelerations = this.particles.geometry.attributes.acceleration.array

    const forces = this.particles.geometry.attributes.force.array

    const newPositions = []
    const newVelocities = []
    const newAccelerations = []

    for (let i = 0; i < positions.length; i++) {

      // x
      newPositions.push(positions[i] + accelerations[i])
      newVelocities.push(velocities[i] + accelerations[i])

      // y
      newPositions.push(positions[++i] + accelerations[i])
      newVelocities.push(velocities[i] + accelerations[i] + forces[i])

      // z
      newPositions.push(positions[++i] + accelerations[i])
      newVelocities.push(velocities[i] + accelerations[i] + forces[i])

    }

    this.particles.geometry.attributes.velocity.set(newVelocities)
    this.particles.geometry.attributes.position.set(newPositions)

    this.particles.geometry.attributes.velocity.needsUpdate = true
    this.particles.geometry.attributes.position.needsUpdate = true
    

  }
  createGeometry() {
    const g = new THREE.BufferGeometry()
    const positions = []
    const colors = []
    const velocities = []
    const accelerations = []

    const color = new THREE.Color()

    const
      n = 100,
      n2 = n / 2
    const rand = Math.random

    for ( let i = 0; i < this.maxParticles; i++ ) {

      const
        x = rand() * n - n2,
        y = rand() * n - n2,
        z = rand() * n - n2,
        vx = ( x / n ) + .5,
        vy = ( y / n ) + .5,
        vz = ( z / n ) + .5

      positions.push( x, y, z )
      color.setRGB( vx, vy, vz )
      colors.push( color.r, color.g, color.b )

      // velocities.push((rand() - .5) * 5, (rand() - .5) * 5, (rand() - .5) * 5)
      velocities.push(0,0,0)
      // accelerations.push((rand() - .5) * 5, (rand() - .5) * 5, (rand() - .5) * 5)
      accelerations.push(0,0,0)

    }

    g.addAttribute(
      'position', new THREE.Float32BufferAttribute( positions, 3 )
    )
    g.addAttribute(
      'color',
      new THREE.Float32BufferAttribute( colors, 3 )
    )
    g.addAttribute(
      'velocity',
      new THREE.Float32BufferAttribute( velocities, 3 )
    )
    g.addAttribute(
      'acceleration',
      new THREE.Float32BufferAttribute( accelerations, 3 )
    )
    g.addAttribute(
      'force',
      new THREE.Float32BufferAttribute( (new Array(this.maxParticles * 3)).fill(0), 3 )
    )
    g.getAttribute('position').setDynamic(true)
    g.getAttribute('velocity').setDynamic(true)
    g.getAttribute('acceleration').setDynamic(true)
    g.getAttribute('force').setDynamic(true)
    return g
  }
  createMaterial() {
    return new THREE.PointsMaterial({
      size: this.size,
      vertexColors: THREE.VertexColors,
      sizeAttenuation: false,
      blending: THREE.AdditiveBlending,
      // blending: THREE.SubtractiveBlending,
      transparent: true,
      opacity: 0.5,
      map: new THREE.TextureLoader().load('../../img/particle.png'),
      alphaTest: .5
    })
  }
}