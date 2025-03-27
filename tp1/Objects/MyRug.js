import * as THREE from 'three';

/**
 * This class contains a 3D representation of a rug object
 */
class MyRug extends THREE.Object3D {
    /**
     * Constructor for the MyRug class
     * @param {*} app - the application object
     * @param {*} shape - the shape of the rug (round or rectangular)
     */
    constructor(app, shape) {
        super();
        this.app = app;

        
        const texLoader = new THREE.TextureLoader();
        const rugTexture = texLoader.load('Textures/rug.jfif');

        // Create the rug geometry
        let rugGeom;
        if (shape === 'round') {
            rugGeom = new THREE.CircleGeometry(7, 64); // 3 is the radius, 64 segments for smoothness
        } else {
            rugGeom = new THREE.PlaneGeometry(15, 13); 
        }

        const rugMat = new THREE.MeshPhongMaterial({
            map: rugTexture,
            side: THREE.DoubleSide, 
            color: 0xffdbdb,
            specular: 0xFFFFFF
        });

        this.rug = new THREE.Mesh(rugGeom, rugMat);

        this.rug.rotation.x = -Math.PI / 2;
        this.rug.position.y = 0.01; 
        this.rug.receiveShadow = true;

        this.add(this.rug);
    }
}

export { MyRug };
