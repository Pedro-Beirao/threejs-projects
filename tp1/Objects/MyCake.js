import * as THREE from 'three';

/**
 * MyCake class
 * 
 * This class represents a cake model with a plate, a slice cutout, a candle and its flame
 */
class MyCake extends THREE.Object3D {

    /**
     * Constructor for the MyCake class
     * 
     * @param {Object} app - The application object
     */
    constructor(app) {
        super();
        this.app = app
        this.type = 'Group';

        // Load textures for the cake
        const textLoader = new THREE.TextureLoader();
        const plateTexture = textLoader.load('Textures/plateTexture.jfif'); 
        const cakeTexture = textLoader.load('Textures/cake.webp');
        const cakeWallTexture = textLoader.load('Textures/cakeWall.jfif');

        // Create the plate
        let plateGeom = new THREE.CylinderGeometry(1, 1, .2, 16);
        let plateMat = new THREE.MeshPhongMaterial({ map: plateTexture, color: "#b0b0b0", specular: "#000000", emissive: "#000000", shininess: 90 })
        this.plate = new THREE.Mesh(plateGeom, plateMat);
        this.plate.castShadow = true;
        this.plate.receiveShadow = true;
        this.add(this.plate);

        // Create the cake
        let cakeGeom = new THREE.CylinderGeometry(.7, .7, .7, 16, 1, false, 0, Math.PI * 2 / 16 * 15);
        let cakeMat = new THREE.MeshPhongMaterial({ map: cakeTexture, color: "#b0b0b0", specular: "#000000", emissive: "#000000", shininess: 90 })
        this.cake = new THREE.Mesh(cakeGeom, cakeMat);
        this.cake.position.y = .4;
        this.cake.castShadow = true;
        this.cake.receiveShadow = true;
        this.add(this.cake);

        // Create the slice cutout
        let cakeWallMat = new THREE.MeshPhongMaterial({ map: cakeWallTexture, color: "#b0b0b0", specular: "#000000", emissive: "#000000", shininess: 90 })
        let cakeWall1Geom = new THREE.PlaneGeometry(.7, .7)
        this.cakeWall1 = new THREE.Mesh(cakeWall1Geom, cakeWallMat);
        this.cakeWall1.rotation.y = -Math.PI / 2
        this.cakeWall1.position.y = .4
        this.cakeWall1.position.z = .35
        this.cakeWall1.castShadow = true;
        this.cakeWall1.receiveShadow = true;
        this.add(this.cakeWall1);

        let cakeWall2Geom = new THREE.PlaneGeometry(.7, .7)
        this.cakeWall2 = new THREE.Mesh(cakeWall2Geom, cakeWallMat);
        this.cakeWall2.position.x = -Math.cos(Math.PI * 3 / 8) * .7 / 2
        this.cakeWall2.position.z = Math.sin(Math.PI * 3 / 8) * .7 / 2
        this.cakeWall2.position.y = .4
        this.cakeWall2.rotation.y = Math.PI * 3 / 8 	
        this.cakeWall2.castShadow = true;
        this.cakeWall2.receiveShadow = true;
        this.add(this.cakeWall2);

        // Create the candle
        let candleGeom = new THREE.CylinderGeometry(.02, .02, .25);
        let candleMat = new THREE.MeshPhongMaterial({ color: 0xf7a1b2, specular: "#000000", emissive: "#000000", shininess: 90 })
        this.candle = new THREE.Mesh(candleGeom, candleMat);
        this.candle.position.y = .85
        this.candle.castShadow = true;
        this.add(this.candle);

        // Create the flame
        let flameBottomGeom = new THREE.ConeGeometry(.02, .05)
        let flameBottomMat = new THREE.MeshPhongMaterial({ color: 0xefb74d, specular: "#000000", emissive: "#000000", shininess: 90 })
        this.flameBottom = new THREE.Mesh(flameBottomGeom, flameBottomMat);
        this.flameBottom.scale.y = -1
        this.flameBottom.position.y = 1
        this.flameBottom.castShadow = true;
        this.flameBottom.receiveShadow = true;
        this.add(this.flameBottom);

        let flameTopGeom = new THREE.ConeGeometry(.02, .15)
        let flameTopMat = new THREE.MeshPhongMaterial({ color: 0xefb74d, specular: "#000000", emissive: "#000000", shininess: 90 })
        this.flameTop = new THREE.Mesh(flameTopGeom, flameTopMat);
        this.flameTop.position.y = 1.1
        this.flameTop.castShadow = true;
        this.add(this.flameTop);
    }
}

export { MyCake };
