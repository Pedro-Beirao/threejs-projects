import * as THREE from 'three'

class MyWeirdDynamicDisplay extends THREE.Group
{
    vertexShader= `
      varying vec2 vUv;

        uniform sampler2D grayimage;
        uniform float scalefactor;

        void main()
        {
          vUv = uv;

          float depth = texture2D(grayimage, uv).r;

          vec3 displacedPosition = position - normal * depth * scalefactor;

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

        const geometry = new THREE.PlaneGeometry(5, 5, 256, 256);

        const material = new THREE.ShaderMaterial({
            uniforms:
            {
                gray: { value: this.app.renderTarget.depthTexture},
                rgbimage: { value: this.app.renderTarget.texture},
                scalefactor: { value: 0.5 }
            },
            side: THREE.DoubleSide,
            vertexShader: this.vertexShader,
            fragmentShader: this.fragmentShader
        }); 
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true;

        this.add(this.mesh);

        // const material1 = new THREE.MeshPhongMaterial({
        //   map: this.app.renderTarget.texture,
        // });
        // const cube = new THREE.Mesh(geometry, material1);
        // this.add(cube);
    }
}

export { MyWeirdDynamicDisplay };
