import * as THREE from 'three';
import { RoundedBoxGeometry } from 'https://threejs.org/examples/jsm/geometries/RoundedBoxGeometry.js';
import { MyPillow } from './MyPillow.js';

/**
 * This class contains a 3D representation of a sofa object using RoundedBoxGeometry
 */
class MySofa extends THREE.Object3D {
    /**
     * Constructor for the MySofa class
     * @param {*} app - the application object
     */
    constructor(app) {
        super();
        this.app = app
        this.type = 'Group';

        const texLoader = new THREE.TextureLoader();
        
        const texture = texLoader.load( 'Textures/sofa.jfif' ); 
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        const material = new THREE.MeshPhongMaterial({ map: texture, color: 0xf5e5d1, specular: "rgb(50,50,50)", emissive: "#000000", shininess: 20})

        // Sofa parts
        let bottomGeom = new RoundedBoxGeometry(10, 1.2, 3, 2, .1);
        let bottom = new THREE.Mesh( bottomGeom, material );
        bottom.position.y = .6;
        bottom.castShadow = true;
        bottom.receiveShadow = true;
        this.add(bottom);

        let backGeom = new RoundedBoxGeometry(10, .8, 4, 2, .1);
        let back = new THREE.Mesh( backGeom, material );
        back.position.y = 2;
        back.position.z = -2;
        back.rotation.x = Math.PI / 2.5;
        back.castShadow = true;
        back.receiveShadow = true;
        this.add(back);

        let leftRestGeom = new RoundedBoxGeometry(3, .4, 4, 2, .1);
        let leftRest = new THREE.Mesh( leftRestGeom, material );
        leftRest.position.y = 1.5;
        leftRest.position.z = -.5;
        leftRest.position.x = -5;
        leftRest.rotation.z = Math.PI / 2;
        leftRest.castShadow = true;
        leftRest.receiveShadow = true;
        this.add(leftRest);

        let rightRestGeom = new RoundedBoxGeometry(3, .4, 4, 2, .1);
        let rightRest = new THREE.Mesh( rightRestGeom, material );
        rightRest.position.y = 1.5;
        rightRest.position.z = -.5;
        rightRest.position.x = 5;
        rightRest.rotation.z = Math.PI / 2;
        rightRest.castShadow = true;
        rightRest.receiveShadow = true;
        this.add(rightRest);

        let leftPillowGeom = new RoundedBoxGeometry(3.2, .7, 2.9, 2, .1);
        let leftPillow = new THREE.Mesh( leftPillowGeom, material );
        leftPillow.position.y = 1.5;
        leftPillow.position.x = -3.15;
        leftPillow.castShadow = true;
        leftPillow.receiveShadow = true;
        this.add(leftPillow);

        let middlePillowGeom = new RoundedBoxGeometry(3, .7, 2.9, 2, .1);
        let middlePillow = new THREE.Mesh( middlePillowGeom, material );
        middlePillow.position.y = 1.5;
        middlePillow.castShadow = true;
        middlePillow.receiveShadow = true;
        this.add(middlePillow);

        let rightPillowGeom = new RoundedBoxGeometry(3.2, .7, 2.9, 2, .1);
        let rightPillow = new THREE.Mesh( rightPillowGeom, material );
        rightPillow.position.y = 1.5;
        rightPillow.position.x = 3.15;
        rightPillow.castShadow = true;
        rightPillow.receiveShadow = true;
        this.add(rightPillow);

        this.pillow = new MyPillow(this.app);
        this.pillow.position.set(3.8, 2.5, -1.5);
        this.pillow.rotation.x = Math.PI /4;
        this.pillow.rotation.y = -Math.PI /6;
        this.add(this.pillow);

        this.pillow = new MyPillow(this.app);
        this.pillow.position.set(-3.8, 2.5, -1.5);
        this.pillow.rotation.x = Math.PI /4;
        this.pillow.rotation.y = Math.PI /6;
        this.add(this.pillow);
    }

    
}

export { MySofa };
