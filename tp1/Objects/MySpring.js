import * as THREE from 'three';

/**
 * This class contains a 3D representation of a spring object using a CatmullRomCurve3 curve
 */
class MySpring extends THREE.Object3D {

    /**
     * Constructor for the MySpring class
     * @param { } app - the application object 
     */
    constructor(app) {
        super();
        this.app = app;

        this.numberOfSamples = 16; 

        const radius = 0.2;  
        const height = 1.5;   
        const turns = 6;     
        const points = [];

        // Generate the points for the spiral spring
        for (let i = 0; i <= turns * 20; i++) {
            const angle = (i / 20) * Math.PI * 2;
            const x = radius * Math.cos(angle);
            const y = height * (i / (turns * 20)) - height / 2;
            const z = radius * Math.sin(angle);
            points.push(new THREE.Vector3(x, y, z));
        }

        const curve = new THREE.CatmullRomCurve3(points);
        const sampledPoints = curve.getPoints(this.numberOfSamples * turns);

        // Create the spiral spring geometry
        this.curveGeometry = new THREE.BufferGeometry().setFromPoints(sampledPoints);
        this.lineMaterial = new THREE.LineBasicMaterial({ color: 0xff69b4 }); 
        
        // Create the spiral spring object
        this.spiralSpring = new THREE.Line(this.curveGeometry, this.lineMaterial);

        this.spiralSpring.rotation.x = Math.PI / 2;
        this.spiralSpring.rotation.z = Math.PI / 2;
        
        this.spiralSpring.position.set(1.5, 3.1, 2.3);  

        this.spiralSpring.castShadow = true;
        this.spiralSpring.receiveShadow = true;

        this.add(this.spiralSpring);
    }
}

export {MySpring};
