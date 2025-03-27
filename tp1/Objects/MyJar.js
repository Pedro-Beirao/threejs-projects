import * as THREE from 'three';
import { MyNurbsBuilder } from '../utils/MyNurbsBuilder.js';

/**
 * This class contains a 3D representation of a jar object using NURBS surfaces and curves 
 */
class MyJar extends THREE.Object3D {
    /**
     * Constructor for the MyJar class
     * @param {*} app - the application object
     */
    constructor(app) {
        super();
        this.app = app;

        // NURBS builder
        this.builder = new MyNurbsBuilder()

        this.samplesU = 32;
        this.samplesV = 32;

        this.meshes = []

        // Material
        const map = new THREE.TextureLoader().load( 'Textures/pinktravertine.jpg' );
        map.wrapS = map.wrapT = THREE.RepeatWrapping;

        this.material = new THREE.MeshPhongMaterial({ 
            map: map,
            color: 0xf8f6f0,
            roughness: 0.4,
            metalness: 0.2,
            shininess: 30,
			side: THREE.DoubleSide, 
			specular: 0xFFFFFF
         });

        this.jar = null;
    
        if (this.meshes !== null) {
            for (let i=0; i<this.meshes.length; i++) {
                this.app.scene.remove(this.meshes[i])
            }
            this.meshes = []
        }
        let orderU = 3
        let orderV = 3
        let mesh1;
        let mesh2;

        // Control points for the NURBS surface
        let points = [
			[ 
				[ -0.5,  1.5, 0.0, 1 ],
				[ -0.5,  0.5, 0.0, 1 ],
				[ -2, -0.5, 0.0, 1 ],
				[ -0.3, -1.5, 0.0, 	1 ],
			],
			[ 
				[ -0.5,  1.5, 0.5, 1 ],
				[ -0.5,  0.5, 0.6, 1 ],
				[ -2, -0.5, 2.8, 1 ],
				[ -0.3, -1.5, 0.25, 1 ],
			],	
			[
				[ 0.5,  1.5, 0.5, 1 ],
				[ 0.5,  0.5, 0.6, 1 ],
				[ 2, -0.5, 2.8, 1 ],
				[ 0.3, -1.5, 0.25, 1 ],
			],
			[
				[ 0.5,  1.5, 0.0, 1 ],
				[ 0.5,  0.5, 0.0, 1 ],
				[ 2, -0.5, 0.0, 1 ],
				[ 0.3, -1.5, 0.0, 1 ],
			]
        ]

        const geometry = this.builder.build(points, orderU, orderV, this.samplesU, this.samplesV, this.material);

        mesh1 = new THREE.Mesh(geometry, this.material);

        mesh1.rotation.x = 0
        mesh1.rotation.y = 0
        mesh1.rotation.z = 0
        mesh1.scale.set( 1,1,1 )
        mesh1.position.set(0,3,0)

        mesh2 = new THREE.Mesh(geometry, this.material);

        mesh2.rotation.x = 0
        mesh2.rotation.y = Math.PI
        mesh2.rotation.z = 0
        mesh2.scale.set( 1,1,1 )
        mesh2.position.set(0,3,0)

        mesh1.castShadow = true;
        mesh1.receiveShadow = true;
        mesh2.castShadow = true;
        mesh2.receiveShadow = true;

        this.add(mesh1);
        this.add(mesh2);
        this.meshes.push(mesh1);
        this.meshes.push(mesh2);
    }
}

export { MyJar };
