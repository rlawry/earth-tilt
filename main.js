import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 0.1, 100000 );
camera.position.z = 20;
camera.position.y = 8;
camera.lookAt(new THREE.Vector3(0,0,0));

//For centering the meshGroup


const group = new THREE.Group();
const group2 = new THREE.Group();
// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls( camera, renderer.domElement );

// Create a cube
const materialDay = new THREE.MeshStandardMaterial({ color: 0x0096FF });
const materialNight = new THREE.MeshStandardMaterial({ color: 0x222222 });

const geometryDay = new THREE.SphereGeometry(1, 32, 32, Math.PI, 2*Math.PI);
const geometryNight = new THREE.SphereGeometry(1, 32, 32, 0, Math.PI);

const erths = [];
for (let i = 0; i<12; i++){
    const erthDay = new THREE.Mesh(geometryDay, materialDay);
    const erthNight = new THREE.Mesh(geometryNight, materialNight);
    // erthDay.material.flatShading = false;
    // erthNight.material.flatShading = false;
    erths.push(erthDay);
    erths.push(erthNight);
}
let dis = 10;
let sphereCount = 0;
for(let i = 0; i<12; i++){
    erths[sphereCount].position.set(dis*Math.sin(i*Math.PI/2/3),0,dis*Math.cos(i*Math.PI/2/3));
    erths[sphereCount+1].position.set(dis*Math.sin(i*Math.PI/2/3),0,dis*Math.cos(i*Math.PI/2/3));
    erths[sphereCount].rotation.y = i * Math.PI/2/3;
    erths[sphereCount+1].rotation.y = i * Math.PI/2/3;
    group.add(erths[sphereCount]);
    group.add(erths[sphereCount+1]);
    sphereCount +=2;
}

const lines = [];

const lineMaterial = new THREE.LineBasicMaterial({color: 0xDA70D6, linewidth: 10});

for (let i = 0; i < 12; i++) {
    // Calculate the position of the current segment
    const angle = i * Math.PI/2/3;
    const x = dis * Math.cos(angle);
    const y = dis * Math.sin(angle);

    // Create a line segment
    const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, -2, 0), // Start point (vertical line segment)
        new THREE.Vector3(0, 2, 0)   // End point (vertical line segment)
    ]);
    const line = new THREE.Line(geometry, lineMaterial);

    // Position the line segment in the circular pattern
    line.position.set(x, 0, y);

    // Apply a slight rotation to the line segment
    line.rotation.z = 0.4;

    // Add the line segment to the scene
    lines.push(line);
    group2.add(line);
}


const geometry2 = new THREE.PlaneGeometry( 100, 100 );
const material2 = new THREE.MeshBasicMaterial( {color: 0x444444, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( geometry2, material2 );
plane.rotation.x = (Math.PI/2);
plane.position.set(0,-10,0);
scene.add( plane );

//group.add(lines);

scene.add(group);
scene.add(group2);

const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Color and intensity (0.5)
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff,1);
directionalLight.position.set(0,2,0);
//scene.add(directionalLight);

const light = new THREE.PointLight( 0xffFFFF, 1 );
light.position.set( 0, 0, 0 );
scene.add( light );

// Animation loop
var time = new Date();

var box = new THREE.Box3().setFromObject(group);
box.center(group.position);
group.localToWorld(box);
group.position.multiplyScalar(-1);

//For fitting the object to the screen when using orthographic camera

camera.zoom = Math.min(window.innerWidth / (box.max.x - box.min.x),
    window.innerHeight / (box.max.y - box.min.y)) * 0.4;
camera.updateProjectionMatrix();
camera.updateMatrix();

const animate = () => {
    requestAnimationFrame(animate);

    // Rotate the cube
    group.rotation.y += 0.005;
    group2.rotation.y += 0.005;

    lines.forEach(lin => {
        lin.rotation.y -= 0.005;
    });

    time = new Date();
    controls.update();
    renderer.render(scene, camera);
};

animate();

window.addEventListener("resize", () => {
    // Get the new window dimensions
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    // Adjust the Three.js renderer size to fill the new window size

    const newAspect = newWidth / newHeight;
   
    camera.left = newWidth * newAspect / -2;
    camera.right = newWidth * newAspect / 2;
    camera.zoom = Math.min(window.innerWidth / (box.max.x - box.min.x),
    window.innerHeight / (box.max.y - box.min.y)) * 0.4;
    camera.updateProjectionMatrix();
    camera.updateMatrix();

    renderer.setSize(newWidth, newHeight);
});

document.addEventListener('keydown', event => {
    const key = event.key.toLowerCase();
    
    if (key === 'w') {
        // Rotate spheres about their X-axes in the positive direction
            lines.forEach( lin => {
                lin.rotation.z += 0.01;
            })
            
    } else if (key === 's') {
        // Rotate spheres about their X-axes in the negative direction
        lines.forEach( lin => {
            lin.rotation.z -= 0.01;
        })
    }
});
