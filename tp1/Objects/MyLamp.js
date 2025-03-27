import * as THREE from 'three';

/**
 * Class representing a lamp object
 */
class MyLamp extends THREE.Object3D {
    /**
     * Constructor for the MyLamp class
     * 
     * @param {Object} app - The application object
     */
    constructor(app) {
        super();
        this.app = app;

        // Load textures for the lamp
        const texLoader = new THREE.TextureLoader();
        const baseTexture = texLoader.load('Textures/base.avif');

        // Base of the lamp
        const baseGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.1, 32);
        const baseMaterial = new THREE.MeshPhongMaterial({map: baseTexture, color: 0xd1d1d1 });
        this.base = new THREE.Mesh(baseGeometry, baseMaterial);
        this.base.position.y = 0.05; 
        this.base.castShadow = true;
        this.base.receiveShadow = true;
        this.add(this.base);

        // Pole of the lamp
        const poleGeometry = new THREE.CylinderGeometry(0.06, 0.06, 5, 32);
        const poleMaterial = new THREE.MeshPhongMaterial({ map: baseTexture, color: 0xd1d1d1 });
        this.pole = new THREE.Mesh(poleGeometry, poleMaterial);
        this.pole.position.y = 2.6; 
        this.pole.castShadow = true;
        this.pole.receiveShadow = true;
        this.add(this.pole);

        // lamp 
        const lampshadeGeometry = new THREE.CylinderGeometry(0.6, 0.6, 1, 32);
        const lampshadeMaterial = new THREE.MeshPhongMaterial({ color: 0xf1b1b8, opacity: 0.9, transparent: true });
        this.lampshade = new THREE.Mesh(lampshadeGeometry, lampshadeMaterial);
        this.lampshade.position.y = 5.4; 
        this.lampshade.castShadow = true;
        this.lampshade.receiveShadow = true;
        this.add(this.lampshade);

        // Light inside the lamp
        this.lampLight = new THREE.PointLight(0xffffff, 1, 10, 2.5); 
        this.lampLight.position.set(0, 6, 0); 
        this.lampLight.castShadow = true;
        this.add(this.lampLight);
    }
}

export { MyLamp };
