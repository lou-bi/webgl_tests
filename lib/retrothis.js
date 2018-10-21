// code from https://codepen.io/EastingAndNorthing/pen/dvjwVQ/?editors=0010

var params = {
	vectorDebug: false,
	noiseFreeze: false,
	gridSize: 12,
	noiseScale: 40,
	noiseSpeed: 0.005,
	noiseStrength: 0.065,
	particleCount: 3000,
	particleSize: 0.18,
	particleSpeed: 0.1,
	particleDrag: 0.9,
	particleColor: 0xff6728, //0x2f6cff, 0xff6728
};

var gui = new dat.GUI();

gui.add(params, 'vectorDebug');
gui.add(params, 'noiseFreeze');
gui.add(params, 'noiseSpeed', 0.001, 0.05);
gui.add(params, 'noiseStrength', 0, 0.1);
gui.add(params, 'particleCount', 0, 10000);
gui.add(params, 'particleSize', 0, 0.5);
gui.add(params, 'particleSpeed', 0, 0.2);
// gui.add(params, 'particleDrag', 0.8, 1.00);
gui.addColor(params, 'particleColor');

var scale = params.noiseScale/500;
var size = params.gridSize;

////////////////////////////////////////////////////////////////////////////////
// Set up renderer
////////////////////////////////////////////////////////////////////////////////
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, .1, 1000 );
camera.lookAt( scene.position );
camera.position.x = 20;

var renderer = new THREE.WebGLRenderer();
// renderer.setClearColor( 0xffffff );
document.body.appendChild( renderer.domElement );

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(size/2,size/2,size/2);
camera.position.set(size*2,size/2,size/2);

stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

function resize() {
	w = document.body.clientWidth
	h = document.body.clientHeight
	camera.aspect = w / h
	camera.updateProjectionMatrix()
	renderer.setSize(w, h)
}
resize();
window.addEventListener('resize', resize, false);


////////////////////////////////////////////////////////////////////////////////
// Vectors
////////////////////////////////////////////////////////////////////////////////
var vectors = [];

function Vector(x,y,z){
	this.x = x;
	this.y = y;
	this.z = z;
	this.angle = new THREE.Euler(0,0,0);
	this.vec3 = new THREE.Vector3(0,0,0);
	this.arrow = null;
}

Vector.prototype.update = function() {
	this.vec3.set(1, 1, 1);
	this.vec3.applyEuler(this.angle);
	this.vec3.multiplyScalar(params.noiseStrength);
	this.updateDebug();
}

Vector.prototype.showDebug = function() {
	if(!this.arrow){
		var arrowHelper = new THREE.ArrowHelper(
			this.angle.toVector3(),
			new THREE.Vector3( this.x, this.y, this.z ),
			0.75,
			0x0000ff,
			0.1,
			0.1
		);
		scene.add( arrowHelper );
		this.arrow = arrowHelper;
	}
}

Vector.prototype.updateDebug = function() {
	if(params.vectorDebug) {
		this.showDebug();
		this.arrow.setDirection(this.vec3.normalize());
	} else {
		scene.remove( this.arrow );
		this.arrow = null;
	}
}


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
	// blending: THREE.SubtractiveBlending,
});

function Particle(x,y,z){
	this.pos = new THREE.Vector3(x,y,z);
	this.vel = new THREE.Vector3(0,0,0);
	this.acc = new THREE.Vector3(0,0,0);
	this.mesh = null;

	this.applyForce = function(force){
		this.acc.add(force);
	}
}

Particle.prototype.init = function() {
	
	var point = new THREE.Points( pointGeometry, material );
	point.geometry.dynamic = true;
	point.geometry.verticesNeedUpdate = true;
	scene.add( point );

	this.mesh = point;
}

Particle.prototype.update = function() {
	this.acc.clampLength(0, params.particleSpeed);
	this.vel.clampLength(0, params.particleSpeed);
	
	this.vel.add(this.acc);
	this.pos.add(this.vel);
	
	// this.acc.multiplyScalar(params.particleDrag);
	// this.vel.multiplyScalar(params.particleDrag);
	
	this.mesh.position.set(
		this.pos.x,
		this.pos.y,
		this.pos.z
	);
	
	if(this.pos.x > size) this.pos.x = 0 + Math.random();
	if(this.pos.y > size) this.pos.y = 0 + Math.random();
	if(this.pos.z > size) this.pos.z = 0 + Math.random();
	if(this.pos.x < 0) this.pos.x = size - Math.random();
	if(this.pos.y < 0) this.pos.y = size - Math.random();
	if(this.pos.z < 0) this.pos.z = size - Math.random();
}



////////////////////////////////////////////////////////////////////////////////
// Init
////////////////////////////////////////////////////////////////////////////////
for(var i = 0; i <= size; i++){
	for(var j = 0; j <= size; j++){
		for(var k = 0; k <= size; k++){
			var v = new Vector(i,j,k);
			vectors.push(v);
		}
	}
}

function addParticle(){
	var p = new Particle(
		Math.random()*size,
		Math.random()*size,
		Math.random()*size
	);
	p.init();
	particles.push(p);
}

for(var i = 0; i < params.particleCount; i++){
	addParticle();
}

// var light = new THREE.AmbientLight("rgb(100,100,100)");
// scene.add( light );
// dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
// dirLight.color.setHSL( 0.1, 1, 0.95 );
// dirLight.position.set( 20, 20, 10 );
// dirLight.position.multiplyScalar( 150 );
// scene.add( dirLight );


////////////////////////////////////////////////////////////////////////////////
// Rendering loop
////////////////////////////////////////////////////////////////////////////////
var frameCount = 0;
var gridIndex = 0;
var noise = 0;
var noiseOffset = Math.random()*100;
var numParticlesOffset = 0;
var v = null;
var p = null

function render() {
	requestAnimationFrame( render );
	stats.begin();
  controls.update();
	
	// Update particle count
	numParticlesOffset = parseInt(params.particleCount - particles.length);
	if(numParticlesOffset > 0){
		for(var i = 0; i < numParticlesOffset; i++){
			addParticle();
		}
	} else {
		for(var i = 0; i < -numParticlesOffset; i++){
			scene.remove( particles[i].mesh );
			particles[i] = null;
   		particles.splice(i, 1);
		}
	}
	
	// Update vectors, at halve speed
	if(frameCount % 2) {
		for(var i = 0; i < vectors.length; i++){
			v = vectors[i];

			noise = PerlinNoise.noise(
				v.x*scale,
				v.y*scale,
				v.z*scale + noiseOffset + frameCount*params.noiseSpeed
			) * Math.PI*4;
			
			v.angle.set(noise, noise, noise);
			v.update();
		}
	}

	// Update particles based on their coords
	for(var i = 0; i < particles.length; i++){
		p = particles[i];

		gridIndex = linearIndexFromCoordinate(
			Math.floor(p.pos.x),
			Math.floor(p.pos.y),
			Math.floor(p.pos.z), 
			size
		);
		
		p.applyForce(vectors[gridIndex].vec3);
		p.update();
	}
	
	// Update params
	material.color.setHex(params.particleColor);
	material.size = params.particleSize;
	if(!params.noiseFreeze) frameCount++;
	
	renderer.render( scene, camera );
	stats.end();
}
render();


function linearIndexFromCoordinate(x,y,z, max){
	a = 1
	b = max + 1
	c = (max + 1) * (max + 1)
	d = 0
	return a*x + b*y + c*z + d
}
