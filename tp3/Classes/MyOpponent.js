import * as THREE from 'three'
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';

class MyOpponent extends THREE.Group
{
    constructor(app, route, color)
    {
        super();
        this.app = app;
        this.route = route;
        this.balloon = null;
        this.next = this.route.getNext();

        this.createBalloon(color)
    }

    createBalloon(color)
    {
        const lod = new THREE.LOD();

        let objLoader = new OBJLoader()
        const mtlLoader = new MTLLoader();

        mtlLoader.load('./objs/balloon_' + color + '.mtl', (mtl) => {
            objLoader.setMaterials(mtl);

            objLoader.load('./objs/balloon.obj', (detailedBalloon) => {
                detailedBalloon.scale.x = 0.0015;
                detailedBalloon.scale.y = 0.0015;
                detailedBalloon.scale.z = 0.0015;
                detailedBalloon.position.z = -0.05;
                detailedBalloon.rotation.x = -Math.PI / 2;
                lod.addLevel(detailedBalloon, 10);
            });
        })


        const texture = new THREE.TextureLoader().load('./objs/balloon_' + color + '.png');
        const simplifiedMaterial = new THREE.SpriteMaterial({ map: texture });
        const billboard = new THREE.Sprite(simplifiedMaterial);
        billboard.scale.x = 0.5;
        billboard.scale.y = 0.5;

        lod.addLevel(billboard, 30); 

        // initial position
        lod.position.set(0, 3, 0);

        this.balloon = lod;

        this.createGroundMark();

        this.add(this.balloon);
    }

    createGroundMark()
    {
        const geometry = new THREE.CylinderGeometry(0.4, 0.4, 0.1); 
        const material = new THREE.MeshBasicMaterial({
            color: 0x000000
        });
        const groundMark = new THREE.Mesh(geometry, material);
        groundMark.castShadow = true;
        groundMark.position.set(0, 80, 0); 
        this.balloon.add(groundMark);
    }

    update()
    {
        let distance = Math.sqrt( Math.pow(-this.next.x - this.balloon.position.x, 2) + Math.pow(this.next.z - this.balloon.position.z, 2) );

        if (distance < 0.1) this.next = this.route.getNext();

        var dir = new THREE.Vector3(-this.next.x - this.balloon.position.x, 0, this.next.z - this.balloon.position.z).normalize();
        this.balloon.position.x += dir.x * 0.02;
        this.balloon.position.z += dir.z * 0.02;
    }
}

export { MyOpponent };