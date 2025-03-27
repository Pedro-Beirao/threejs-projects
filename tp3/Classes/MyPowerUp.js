import * as THREE from 'three'

class MyPowerUp extends THREE.Group
{
    vertexShader = `
        varying vec2 vUv;
        uniform float time;

        void main() {
            vUv = uv;

            vec4 Vertex = vec4(position,1.0);

            float s = 0.9 + sin(time) * 0.1;
            Vertex.x *= s;
            Vertex.y *= s;
            Vertex.z *= s;

            gl_Position =   projectionMatrix * 
                            modelViewMatrix * 
                            Vertex;
        }
        `

    fragmentShader = `
        varying vec2 vUv;

        void main() {
            gl_FragColor = vec4(1,1,0,1);
        }
        `

    constructor(position, app) {
        super();
        this.app = app;

        const geometry = new THREE.SphereGeometry(0.4, 16, 16);
        const material = new THREE.ShaderMaterial({
            uniforms:
            {
                time: { value: 0 }
            },
            vertexShader: this.vertexShader,
            fragmentShader: this.fragmentShader
        }); 
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true;

        this.position.set(position.x, position.y, position.z);

        this.add(this.mesh);
        this.app.scene.add(this);

        this.boundingSphere = new THREE.Sphere(this.position.clone(), 0.5);
    }

    update()
    {
        this.mesh.material.uniforms.time.value += 1/(20);
    }
    
    
}

export { MyPowerUp };
