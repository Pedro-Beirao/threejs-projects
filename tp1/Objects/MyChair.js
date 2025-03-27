import * as THREE from 'three';

/**
 * MyChair class, which represents a chair object
 */
class MyChair extends THREE.Object3D {
    /**
     * Constructor for the MyChair class
     * 
     * @param {Object} app - The application object
     */
    constructor(app) {
        super();
        this.app = app;

        // Load textures for the chair
        const texLoader = new THREE.TextureLoader();
        const legTexture = texLoader.load('Textures/gold.jpg');
        const chairTexture = texLoader.load('Textures/chair.jpg');

        // Chair seat
        const seatGeom = new THREE.BoxGeometry(1.9, 0.15, 1.7);
        const seatMat = new THREE.MeshPhongMaterial({ map: chairTexture, color: 0xffb88f, specular: "#4a4a4a", shininess: 10 });
        const seat = new THREE.Mesh(seatGeom, seatMat);
        seat.position.y = 1.7;
        seat.castShadow = true;
        seat.receiveShadow = true;
        this.add(seat);

        // Chair backrest
        const heartShape = new THREE.Shape();

        // Create heart shape
        heartShape.moveTo(0, 0.5);
        heartShape.bezierCurveTo(0, 0.9, -0.4, 1.3, -0.75, 1.1);
        heartShape.bezierCurveTo(-1.1, 0.8, -0.9, 0, 0, -0.6);
        heartShape.bezierCurveTo(0.9, 0, 1.1, 0.8, 0.75, 1.1);
        heartShape.bezierCurveTo(0.4, 1.3, 0, 0.9, 0, 0.5);

        // Create extrude settings
        const extrudeSettings = {
            depth: 0.15,
            bevelEnabled: true,
            bevelThickness: 0.02,
            bevelSize: 0.2,
            bevelSegments: 3
        };

        const heartGeom = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
        const heartMat = new THREE.MeshPhongMaterial({ map: chairTexture, color: 0xffb88f, specular: "#4a4a4a", shininess: 10 });
        const backrest = new THREE.Mesh(heartGeom, heartMat);

        backrest.rotation.y = Math.PI;
        backrest.position.set(0, 2.5, -0.75); 
        backrest.castShadow = true;
        backrest.receiveShadow = true;
        this.add(backrest);

        // Chair legs
        const legGeom = new THREE.CylinderGeometry(0.07, 0.07, 1.7, 16);
        const legMat = new THREE.MeshPhongMaterial({map: legTexture, color: 0xe3b326, shininess: 10, specular: "#4a4a4a"});

        //leg 1
        let chairlegMesh = new THREE.Mesh(legGeom, legMat);
        chairlegMesh.position.y = 0.9;
        chairlegMesh.position.x = -0.7;
        chairlegMesh.position.z = -0.7;
        chairlegMesh.castShadow = true;
        chairlegMesh.receiveShadow = true;
        this.add(chairlegMesh);

        //leg 2
        chairlegMesh = new THREE.Mesh(legGeom, legMat);
        chairlegMesh.position.y = 0.9;
        chairlegMesh.position.x = 0.7;
        chairlegMesh.position.z = -0.7;
        chairlegMesh.castShadow = true;
        chairlegMesh.receiveShadow = true;
        this.add(chairlegMesh);

        //leg 3
        chairlegMesh = new THREE.Mesh(legGeom, legMat);
        chairlegMesh.position.y = 0.9;
        chairlegMesh.position.x = -0.7;
        chairlegMesh.position.z = 0.7;
        chairlegMesh.castShadow = true;
        chairlegMesh.receiveShadow = true;
        this.add(chairlegMesh);

        //leg 4
        chairlegMesh = new THREE.Mesh(legGeom, legMat);
        chairlegMesh.position.y = 0.9;
        chairlegMesh.position.x = 0.7;
        chairlegMesh.position.z = 0.7;
        chairlegMesh.castShadow = true;
        chairlegMesh.receiveShadow = true;
        this.add(chairlegMesh);
    }
}

export { MyChair };
