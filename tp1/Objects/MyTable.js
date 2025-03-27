import * as THREE from 'three';
import { MyCake } from './MyCake.js';
import { MyNewspaper } from './MyNewspaper.js';
import { MyJar } from './MyJar.js';
import { MyFlower } from './MyFlower.js';
import { MySpring } from './MySpring.js';
import { MyChair } from './MyChair.js';

/**
 * This class contains a 3D representation of a table object with objects on top of it, such as a cake, a newspaper, 
 * a jar, flowers, a spring. It also contains two chairs.
 */
class MyTable extends THREE.Object3D {
    /**
     * Constructor for the MyTable class
     * @param {*} app - the application object
     */
    constructor(app) {
        super();
        this.app = app
        this.type = 'Group';

        const texLoader = new THREE.TextureLoader();

        // TableTop shape
        const heartShape = new THREE.Shape();

        heartShape.moveTo(0, -1);
        
        const leftCurve = new THREE.CubicBezierCurve(
            new THREE.Vector2(0, -1),            
            new THREE.Vector2(-1, -2),           
            new THREE.Vector2(-2, 0),            
            new THREE.Vector2(0, 1)              
        );
        

        const rightCurve = new THREE.CubicBezierCurve(
            new THREE.Vector2(0, 1),             
            new THREE.Vector2(2, 0),             
            new THREE.Vector2(1, -2),            
            new THREE.Vector2(0, -1)             
        );
        
    
        const leftPoints = leftCurve.getPoints(20);  
        const rightPoints = rightCurve.getPoints(20);
        
        // Add the points to the shape
        for (let i = 0; i < leftPoints.length; i++) {
            heartShape.lineTo(leftPoints[i].x, leftPoints[i].y);
        }

        // Add the points to the shape
        for (let i = 0; i < rightPoints.length; i++) {
            heartShape.lineTo(rightPoints[i].x, rightPoints[i].y);
        }

        // Extrude settings
        const extrudeSettings = {
            depth: 0.1,             
            bevelEnabled: true,     
            bevelThickness: 0.05,   
            bevelSize: 0.05,        
            bevelSegments: 20,      
            curveSegments: 20       
        };

        // Create the table top geometry
        const tableTopGeometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);

        // TableTop material
        const tableTopTex = texLoader.load( 'Textures/Travertine.jpg' ); 
        tableTopTex.wrapS = THREE.RepeatWrapping;
        tableTopTex.wrapT = THREE.RepeatWrapping;
        let tableTopMat = new THREE.MeshPhongMaterial({ map: tableTopTex, color: 0xf57a9b, specular: "rgb(50,50,50)", emissive: "#000000", shininess: 20})

        // Create the table top mesh
        const tableTopMesh = new THREE.Mesh(tableTopGeometry, tableTopMat);
        tableTopMesh.rotation.x = -Math.PI / 2;  
        tableTopMesh.position.y = 2.5;           
        tableTopMesh.scale.set(2.5,2.5,2.5);
        tableTopMesh.castShadow = true;
        tableTopMesh.receiveShadow = true;
        this.add(tableTopMesh);


        // Legs
        const tableLegTex = texLoader.load( 'Textures/gold.jpg' ); 
        tableLegTex.wrapS = THREE.RepeatWrapping;
        tableLegTex.wrapT = THREE.RepeatWrapping;
        let tableLegMat = new THREE.MeshPhongMaterial({ map: tableLegTex, color: 0xe3b326, specular: "rgb(100,100,100)", emissive: "#000000", shininess: 20})

        let tableLeg = new THREE.CylinderGeometry( 0.1, 0.1, 2.5, 32 );

        //leg 1
        let tableLegMesh = new THREE.Mesh( tableLeg, tableLegMat );
        tableLegMesh.position.y = 1.3;
        tableLegMesh.position.x = -2.7;
        tableLegMesh.position.z = 1.8;
        tableLegMesh.castShadow = true;
        tableLegMesh.receiveShadow = true;
        this.add(tableLegMesh);

        //leg 2
        tableLegMesh = new THREE.Mesh( tableLeg, tableLegMat );
        tableLegMesh.position.y = 1.3;
        tableLegMesh.position.x = 2.7;
        tableLegMesh.position.z = 1.8;
        tableLegMesh.castShadow = true;
        tableLegMesh.receiveShadow = true;
        this.add(tableLegMesh);

        //leg 3
        tableLegMesh = new THREE.Mesh( tableLeg, tableLegMat );
        tableLegMesh.position.y = 1.3;
        tableLegMesh.position.x = 0;
        tableLegMesh.position.z = -2.3;
        tableLegMesh.castShadow = true;
        tableLegMesh.receiveShadow = true;
        this.add(tableLegMesh);
        
        // create the objects on top of the table
        // Cake
        this.cake = new MyCake(app);
        this.cake.scale.set(.7, .7, .7);
        this.cake.position.x = -1;
        this.cake.position.y = 2.9;
        this.cake.position.z = 1.3;
        this.add(this.cake);

        // Newspaper
        this.newspaper = new MyNewspaper(app);
        this.newspaper.scale.set(-.3, .3, -.3);
        this.newspaper.position.x = 2;
        this.newspaper.position.y = 2.9;
        this.newspaper.position.z = 0.5;
        this.newspaper.rotation.x = Math.PI / 2;
        this.newspaper.rotation.z = Math.PI / 4;
        this.add(this.newspaper);

        // Jar
        this.jar = new MyJar(app);
        this.jar.scale.set(0.35, 0.35, 0.35);
        this.jar.position.set(1.5, 2.3, 2); 
        this.add(this.jar);

        // Flower
        this.flower = new MyFlower();
        this.flower.position.set(1.5, 3.3, 1.95); 
        this.add(this.flower);

        // Spring
        this.spring = new MySpring(app);
        this.spring.scale.set(0.5,0.5,0.5);
        this.spring.position.set(0.5,1.45,1.5);
        this.add(this.spring);

        // Chairs
        this.chair = new MyChair(app);
        this.chair.position.set(-3, 0, -1);
        this.chair.rotation.y = Math.PI / 4;
        this.add(this.chair);

        this.chair = new MyChair(app);
        this.chair.position.set(3, 0, -1);
        this.chair.rotation.y = -Math.PI / 4;
        this.add(this.chair);
    }
}

export { MyTable };
