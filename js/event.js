const event = (renderer, camera) => {
  let mousepressed = false
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  })
  window.addEventListener('mousedown', (e) => { mousepressed = true })
  window.addEventListener('mouseup', (e) => { mousepressed = false })
  window.addEventListener('mousemove', (e) => {
    if (mousepressed)
      renderer.clear()
  })
}



export default event