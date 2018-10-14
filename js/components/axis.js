const axis = () => {
	const xLineMaterial = new THREE.LineBasicMaterial( { color: 0x0000ff } )
	const yLineMaterial = new THREE.LineBasicMaterial( { color: 0x00ff00 } )
	const zLineMaterial = new THREE.LineBasicMaterial( { color: 0xff0000 } )

	const xLineGeometry = new THREE.Geometry()
	const yLineGeometry = new THREE.Geometry()
	const zLineGeometry = new THREE.Geometry()

	xLineGeometry.vertices.push(new THREE.Vector3(-50, 0, 0))
	xLineGeometry.vertices.push(new THREE.Vector3(50, 0, 0))
	const xLine = new THREE.Line(xLineGeometry, xLineMaterial)

	yLineGeometry.vertices.push(new THREE.Vector3(0, -50, 0))
	yLineGeometry.vertices.push(new THREE.Vector3(0, 50, 0))
	const yLine = new THREE.Line(yLineGeometry, yLineMaterial)

	zLineGeometry.vertices.push(new THREE.Vector3(0, 0, -50))
	zLineGeometry.vertices.push(new THREE.Vector3(0, 0, 50))
	const zLine = new THREE.Line(zLineGeometry, zLineMaterial)

	return [xLine, yLine, zLine]
}

export default axis