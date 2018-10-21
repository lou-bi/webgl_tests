var params = {
	size: 22,
	noiseScale: 0.10,
	noiseSpeed: 0.009,
	noiseStrength: 0.08,
	noiseFreeze: false,
	particleCount: 3000,
	particleSize: 0.22,
	particleSpeed: 0.1,
	particleDrag: 0.9,
	particleColor: 0x41a5ff, //0x41a5ff, 0xff6728
	bgColor: 0x000000,
	particleBlending: THREE.AdditiveBlending
};

var gui = new dat.GUI();
var f1 = gui.addFolder('Flow Field');
var f2 = gui.addFolder('Particles');
var f3 = gui.addFolder('Graphics');

f1.add(params, 'size', 1, 100);
f1.add(params, 'noiseScale', 0, 0.5);
f1.add(params, 'noiseSpeed', 0.001, 0.05);
f1.add(params, 'noiseStrength', 0, 0.1);
f1.add(params, 'noiseFreeze');

f2.add(params, 'particleCount', 0, 10000);
f2.add(params, 'particleSize', 0, 1);
f2.add(params, 'particleSpeed', 0, 0.2);
// f2.add(params, 'particleDrag', 0.8, 1.00);
f2.addColor(params, 'particleColor');

f3.addColor(params, 'bgColor');
f3.add(params, 'particleBlending', {		
	Additive: THREE.AdditiveBlending,
	Subtractive: THREE.SubtractiveBlending,
	Normal: THREE.NormalBlending
});


////////////////////////////////////////////////////////////////////////////////
// Set up renderer
////////////////////////////////////////////////////////////////////////////////
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, .1, 1000);
camera.lookAt(scene.position);
camera.position.set(params.size*2,params.size/2,params.size/2);

var renderer = new THREE.WebGLRenderer();
document.body.appendChild(renderer.domElement);

var controls = new THREE.OrbitControls(camera, renderer.domElement);

var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

function resize() {
	w = document.body.clientWidth;
	h = document.body.clientHeight;
	camera.aspect = w / h;
	camera.updateProjectionMatrix();
	renderer.setSize(w, h);
}
resize();
window.addEventListener('resize', resize, false);


////////////////////////////////////////////////////////////////////////////////
// Particles
////////////////////////////////////////////////////////////////////////////////
var particles = [];

var pointGeometry = new THREE.Geometry();
pointGeometry.vertices.push(new THREE.Vector3(0,0,0));

var material = new THREE.PointsMaterial({
	color: params.particleColor,
	size: params.particleSize,
	sizeAttenuation: true,
	transparent: true,
	opacity: 0.35,
	blending: THREE.AdditiveBlending,
});

function Particle(x,y,z){
	this.pos = new THREE.Vector3(x,y,z);
	this.vel = new THREE.Vector3(0,0,0);
	this.acc = new THREE.Vector3(0,0,0);
	this.angle = new THREE.Euler(0,0,0);
	this.mesh = null;
}

Particle.prototype.init = function() {
	var point = new THREE.Points( pointGeometry, material );
	point.geometry.dynamic = true;
	point.geometry.verticesNeedUpdate = true;
	scene.add(point);
	this.mesh = point;
}

Particle.prototype.update = function() {
	this.acc.set(1,1,1);
	this.acc.applyEuler(this.angle);
	this.acc.multiplyScalar(params.noiseStrength);
	
	this.acc.clampLength(0, params.particleSpeed);
	this.vel.clampLength(0, params.particleSpeed);
	
	this.vel.add(this.acc);
	this.pos.add(this.vel);
	
	// this.acc.multiplyScalar(params.particleDrag);
	// this.vel.multiplyScalar(params.particleDrag);
	
	if(this.pos.x > params.size) this.pos.x = 0 + Math.random();
	if(this.pos.y > params.size) this.pos.y = 0 + Math.random();
	if(this.pos.z > params.size) this.pos.z = 0 + Math.random();
	if(this.pos.x < 0) this.pos.x = params.size - Math.random();
	if(this.pos.y < 0) this.pos.y = params.size - Math.random();
	if(this.pos.z < 0) this.pos.z = params.size - Math.random();
	
	this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z);
}



////////////////////////////////////////////////////////////////////////////////
// Rendering loop
////////////////////////////////////////////////////////////////////////////////
var frameCount = 0;
var gridIndex = 0;
var noise = 0;
var noiseOffset = Math.random()*100;
var numParticlesOffset = 0;
var p = null

function render() {
	requestAnimationFrame( render );
	stats.begin();
  controls.update();
	controls.target.set(params.size/2,params.size/2,params.size/2);
	
	// Update particle count
	numParticlesOffset = parseInt(params.particleCount - particles.length);
	if(numParticlesOffset > 0){
		for(var i = 0; i < numParticlesOffset; i++){
			var p = new Particle(
				Math.random()*params.size,
				Math.random()*params.size,
				Math.random()*params.size
			);
			p.init();
			particles.push(p);
		}
	} else {
		for(var i = 0; i < -numParticlesOffset; i++){
			scene.remove(particles[i].mesh);
			particles[i] = null;
   		particles.splice(i, 1);
		}
	}
	
	// Update particles based on their coords
	for(var i = 0; i < particles.length; i++){
		p = particles[i];
		
		noise = PerlinNoise.noise(
			p.pos.x*params.noiseScale,
			p.pos.y*params.noiseScale,
			p.pos.z*params.noiseScale + noiseOffset + frameCount*params.noiseSpeed
		) * Math.PI*2;

		p.angle.set(noise, noise, noise);
		p.update();
	}
	
	// Update params
	renderer.setClearColor(params.bgColor);
	material.color.setHex(params.particleColor);
	material.size = params.particleSize;
	material.blending = parseInt(params.particleBlending);
	if(!params.noiseFreeze) frameCount++;
	
	renderer.render( scene, camera );
	stats.end();
}
render();
