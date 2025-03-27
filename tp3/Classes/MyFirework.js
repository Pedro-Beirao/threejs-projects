import * as THREE from 'three'

/**
 * MyFirework class creates a firework effect in a 3D scene
 */
class MyFirework {

    /**
     * Constructor initializes the firework object
     * @param {Object} app - The application object
     * @param {THREE.Scene} scene - The scene where the firework will be rendered
     */
    constructor(app, scene) {
        this.app = app
        this.scene = scene

        this.done = false 
        this.dest = [] 
        this.vertices = null
        this.colors = null
        this.geometry = null
        this.points = null
        this.particles = []; 
        this.gravity = -9.8; 
        
        this.material = new THREE.PointsMaterial({
            size: 0.2,
            vertexColors: true,
            transparent: true,
            opacity: 1,
            depthTest: false,
            blending: THREE.AdditiveBlending
        })
        
        this.height = 25
        this.speed = 60

        this.launch() 

    }

    /**
     * Launches the firework by initializing its particles
     */
    launch() {
        const colors = [];
        const color = new THREE.Color();
        
        if (Math.random() < 0.3) {
            color.setHSL(0.95, 1.0, Math.random() * 0.5 + 0.5); 
        } else {
            color.setHSL(Math.random(), 1.0, Math.random() * 0.5 + 0.5);
        }

        colors.push(color.r, color.g, color.b);

        let x = THREE.MathUtils.randFloat(-5, 5) 
        let y = THREE.MathUtils.randFloat(this.height * 0.9, this.height * 1.1)
        let z = THREE.MathUtils.randFloat(-5, 5) 
        this.dest.push( x, y, z ) 

        const position = new THREE.Vector3(-30.82, -0.5, -21.417);
        const velocity = new THREE.Vector3(
            THREE.MathUtils.randFloat(-3, 3), 
            THREE.MathUtils.randFloat(12, 14), 
            THREE.MathUtils.randFloat(-3, 3)  
        );

        this.particles.push({ position, velocity });
        
        this.geometry = new THREE.BufferGeometry()
        this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([position.x, position.y, position.z]), 3));
        this.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
        this.points = new THREE.Points(this.geometry, this.material)
        this.points.castShadow = true;
        this.points.receiveShadow = true;
        this.app.scene.add(this.points)  
    }

    /**
     * Creates an explosion effect
     * @param {THREE.Vector3} origin - The origin of the explosion
     * @param {number} particleCount - Number of particles in the explosion
     * @param {number} minRadius - Minimum radius of the explosion
     * @param {number} maxRadius - Maximum radius of the explosion
     */
    explode(origin, particleCount = 100, minRadius = 1, maxRadius = 10) {
        const vertices = [];
        const colors = [];
        const color = new THREE.Color();

        for (let i = 0; i < particleCount; i++) {
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(2 * Math.random() - 1);
            const radius = Math.random() * (maxRadius - minRadius) + minRadius;

            const x = origin[0] + radius * Math.sin(phi) * Math.cos(theta);
            const y = origin[1] + radius * Math.sin(phi) * Math.sin(theta);
            const z = origin[2] + radius * Math.cos(phi);

            vertices.push(x, y, z);

            color.setHSL(Math.random(), 1.0, 0.7);
            colors.push(color.r, color.g, color.b);
        }

        this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
        this.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
    }
    
    /**
    * Resets the firework object, removing it from the scene.
    */
    reset() {
        this.app.scene.remove(this.points)  
        this.dest = [] 
        this.vertices = null
        this.colors = null 
        this.geometry = null
        this.points = null
    }


    /**
     * Updates the firework
     * @param {number} deltaTime - Time for the velocity
     */
    update(deltaTime = 0.016) {
        if (!this.points || !this.geometry) return;

        const positions = this.geometry.getAttribute('position').array;

        this.particles.forEach((particle, index) => {
            particle.velocity.y += this.gravity * deltaTime;

            particle.position.addScaledVector(particle.velocity, deltaTime);

            positions[index * 3] = particle.position.x;
            positions[index * 3 + 1] = particle.position.y;
            positions[index * 3 + 2] = particle.position.z;

            if (particle.velocity.y <= 0 && particle.position.y > 0) {
                this.explode(particle.position, 100, 2, 10);
                this.particles.splice(index, 1); 
            }
        });

        this.geometry.attributes.position.needsUpdate = true;

        if (this.particles.length === 0) {
            this.material.opacity -= 0.02;
            if (this.material.opacity <= 0) {
                this.reset();
                this.done = true;
            }
        }
    }
}

export { MyFirework }