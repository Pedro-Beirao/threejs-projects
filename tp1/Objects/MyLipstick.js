import * as THREE from 'three';

/**
 * MyLipstick class, which represents a lipstick object
 */
class MyLipstick extends THREE.Object3D {
    /**
     * Constructor for the MyLipstick class
     * @param {*} app - the application object 
     */
    constructor(app) {
        super();
        this.app = app;

        // Load textures for the lipstick
        const texLoader = new THREE.TextureLoader();
        
        const texture = texLoader.load( 'Textures/lipstick.jpg' ); 
        const metalTexture = texLoader.load( 'Textures/metal.jpg' );

        // pink part of the lipstick
        const bulletGeometry = new THREE.CylinderGeometry(0.3, 0.32, 0.8, 32);
        const bulletMaterial = new THREE.MeshPhongMaterial({ color: 0xff8a9d });
        const bulletMesh = new THREE.Mesh(bulletGeometry, bulletMaterial);
        bulletMesh.position.y = 1.6; 
        bulletMesh.castShadow = true;
        bulletMesh.receiveShadow = true;
        this.add(bulletMesh);

        // middle part of the lipstick
        const tubeGeometry = new THREE.CylinderGeometry(0.35, 0.35, 1, 32);
        const tubeMaterial = new THREE.MeshPhongMaterial({map: metalTexture, color: 0xffcc00, shininess: 50 , specular: 0xffffff});
        const tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);
        tubeMesh.position.y = 1; 
        tubeMesh.castShadow = true;
        tubeMesh.receiveShadow = true;
        this.add(tubeMesh);

        // bottom part of the lipstick
        const baseGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.8, 32);
        const baseMaterial = new THREE.MeshPhongMaterial({ map: texture, color: 0x1f1f1f, shininess: 0 , specular: 0xffffff});
        const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
        baseMesh.position.y = 0.3;
        baseMesh.castShadow = true;
        baseMesh.receiveShadow = true;
        this.add(baseMesh);
    }
}

export { MyLipstick };
