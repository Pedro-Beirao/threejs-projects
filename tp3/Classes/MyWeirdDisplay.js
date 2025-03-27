import * as THREE from 'three'

class MyWeirdDisplay extends THREE.Group
{
    vertexShader= `
      varying vec2 vUv;

        uniform sampler2D grayimage;
        uniform float scalefactor;

        void main()
        {
          vUv = uv;

          float depth = texture2D(grayimage, uv).r;

          vec3 displacedPosition = position + normal * depth * scalefactor;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
        }
      `
    fragmentShader= `
        varying vec2 vUv;

        uniform sampler2D rgbimage;

        void main()
        {
          gl_FragColor = texture2D(rgbimage, vUv);
        }
      `

    constructor(app) {
        super();
        this.app = app;

        const geometry = new THREE.PlaneGeometry(2.5, 5, 100, 100);

        const loader = new THREE.TextureLoader();
        const peach = loader.load("./objs/peach.jpg")
        const peach_gray = loader.load("./objs/peach_gray.jpg")

        const material = new THREE.ShaderMaterial({
            uniforms:
            {
                gray: { value: peach_gray},
                rgbimage: { value: peach},
                scalefactor: { value: 0.3 }
            },
            side: THREE.DoubleSide,
            vertexShader: this.vertexShader,
            fragmentShader: this.fragmentShader
        }); 
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true;

        this.add(this.mesh);
    }
}

export { MyWeirdDisplay };
