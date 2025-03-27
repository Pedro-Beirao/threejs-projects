import * as THREE from 'three';

/**
 * MyPillow class which creates a pillow object using Bezier curves
 */
class MyPillow extends THREE.Object3D {
    /**
     * Constructor for the MyPillow class
     * @param {} app - the application object
     */
    constructor(app) {
        super();
        this.app = app;

        // Texture
        const texLoader = new THREE.TextureLoader();
        const pillowTexture = texLoader.load('Textures/pillow.jpg');

        // Bezier curve for the pillow
        const heartShape = new THREE.Shape();
        heartShape.moveTo(0, 0.25);
        heartShape.bezierCurveTo(0.6, 0.9, 1.6, 0.3, 0, -1.2); 
        heartShape.bezierCurveTo(-1.6, 0.3, -0.6, 0.9, 0, 0.25);

        // Extrude settings
        const extrudeSettings = {
            steps: 2,
            depth: 0.2,             
            bevelEnabled: true,
            bevelThickness: 0.08,  
            bevelSize: 0.1,         
            bevelSegments: 32,     
        };
        const pillowGeometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);

        const pillowMaterial = new THREE.MeshPhongMaterial({
            map: pillowTexture,
            color: 0xff8a9d, 
            side: THREE.DoubleSide,
            shininess: 20
        });

        // Pillow mesh
        this.pillow = new THREE.Mesh(pillowGeometry, pillowMaterial);
        this.pillow.rotation.x = -Math.PI / 2;
        this.pillow.position.y = 0.1; 
        this.pillow.castShadow = true;
        this.pillow.receiveShadow = true;

        this.add(this.pillow);
    }
}

export { MyPillow };
