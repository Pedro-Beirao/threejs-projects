import * as THREE from 'three'

class MyWater extends THREE.Group
{
    vertexShader = `
        varying vec2 vUv;
        uniform float time;

        float rand(vec2 co){
            return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
        }

        void main() {
            vUv = uv;

            gl_Position =   projectionMatrix * 
                            modelViewMatrix * 
                            vec4(position,1.0) + vec4(0, rand(vec2(uv.x + time * 0.000001, uv.y + time * 0.000001)) * 0.3, 0, 0);
        }
        `

    fragmentShader = `
        uniform sampler2D tex;
        uniform float time;

        varying vec2 vUv;

        void main() {
            gl_FragColor = texture2D(tex, vUv * vec2(15,15) - time);
        }
        `


    constructor(app, segments) {
        super();
        this.app = app;
        this.segments = segments;

        const geometry = new THREE.PlaneGeometry(segments, segments, segments); 

        const loader = new THREE.TextureLoader();
        const texture = loader.load("./track/438C7997_c.png")
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.minFilter = THREE.NearestFilter
        texture.magFilter = THREE.NearestFilter
        
        const material = new THREE.ShaderMaterial({
            uniforms:
            {
                tex: { value: texture},
                time: { value: 0 }
            },
            vertexShader: this.vertexShader,
            fragmentShader: this.fragmentShader
        }); 

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = -Math.PI / 2

        this.add(this.mesh)
    }

    update()
    {
        this.mesh.material.uniforms.time.value += 1/(20 * this.segments);
    }
}

export { MyWater };
