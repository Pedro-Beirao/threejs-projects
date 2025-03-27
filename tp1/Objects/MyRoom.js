import * as THREE from 'three';

/**
 * MyRoom class creates a 3D representation of a room with walls and floor
 */
class MyRoom extends THREE.Object3D {
    /**
     * Constructor for the MyRoom class
     * @param {*} app - the application object
     */
    constructor(app) {
        super();
        this.app = app
        this.type = 'Group';

        const texLoader = new THREE.TextureLoader();
        
        /// Floor
        const floorTex = texLoader.load( 'Textures/wood5.jpg' ); 
        floorTex.wrapS = THREE.RepeatWrapping;
        floorTex.wrapT = THREE.RepeatWrapping;

        floorTex.repeat.set(2, 4);

        this.floorMat = new THREE.MeshStandardMaterial({
            map: floorTex,
            color: "rgb(240,180,140)", 
            specular: "rgb(100,100,100)", 
            emissive: "rgb(30, 20, 20)", 
            emissiveIntensity: 0.2, 
            shininess: 50             
        });

        this.floorMesh = new THREE.Mesh( new THREE.PlaneGeometry( 20, 35 ), this.floorMat );
        this.floorMesh.rotation.x = -Math.PI / 2;
        this.floorMesh.position.y = -0;
        this.floorMesh.receiveShadow = true;
        this.app.scene.add( this.floorMesh );


        // Walls
        const wallTex = texLoader.load( 'Textures/pinkwall2.jpg' ); 
        wallTex.wrapS = THREE.RepeatWrapping;
        wallTex.wrapT = THREE.RepeatWrapping;

        // Wall 1 - Left Wall
        this.wallMat = new THREE.MeshStandardMaterial({
            map: wallTex,
            color: "rgb(200,200,200)",
            roughness: 0.4,
            metalness: 0.1,
            emissive: "rgb(30, 20, 20)", 
            emissiveIntensity: 0.2,
            specular: "rgb(100,100,100)"
        });

        wallTex.repeat.set(4, 2);
        const wallGeometry1 = new THREE.PlaneGeometry(35, 13);
        this.wall1Mesh = new THREE.Mesh(wallGeometry1, this.wallMat);
        this.wall1Mesh.rotation.y = Math.PI / 2;
        this.wall1Mesh.position.set(-10, 6.5, 0);
        this.wall1Mesh.receiveShadow = true;
        this.app.scene.add(this.wall1Mesh);

         // Wall 2 - Right Wall 
         wallTex.repeat.set(4, 2); 
         const wallGeometry2 = new THREE.PlaneGeometry(35, 13);
         this.wall2Mesh = new THREE.Mesh(wallGeometry2, this.wallMat);
         this.wall2Mesh.rotation.y = -Math.PI / 2;
         this.wall2Mesh.position.set(10, 6.5, 0);
         this.wall2Mesh.receiveShadow = true;
         this.app.scene.add(this.wall2Mesh);
 
         // Wall 3 - Back Wall
         wallTex.repeat.set(2, 1); 
         const wallGeometry3 = new THREE.PlaneGeometry(20, 13);
         this.wall3Mesh = new THREE.Mesh(wallGeometry3, this.wallMat);
         this.wall3Mesh.position.set(0, 6.5, -17.5);
         this.wall3Mesh.receiveShadow = true;
         this.app.scene.add(this.wall3Mesh);
 
         // Wall 4 - Front Wall
         wallTex.repeat.set(2, 1); 
         const wallGeometry4 = new THREE.PlaneGeometry(20, 13);
         this.wall4Mesh = new THREE.Mesh(wallGeometry4, this.wallMat);
         this.wall4Mesh.rotation.y = Math.PI;
         this.wall4Mesh.position.set(0, 6.5, 17.5);
         this.wall4Mesh.receiveShadow = true;
         this.app.scene.add(this.wall4Mesh);
    }

}

export { MyRoom };