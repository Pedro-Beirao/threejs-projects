import * as THREE from 'three';
import { Reflector } from '../utils/Reflector.js';

/**
 * This class contains a 3D representation of a mirror object using Reflector class
 */
class MyMirror extends THREE.Object3D {
    /**
     * Constructor for the MyMirror class
     * @param {*} app . the application object
     */
    constructor(app) {
        super();
        this.app = app;

        const width = 12;  
        const height = 10; 

        const geometry = new THREE.PlaneGeometry(width, height);
        const mirror = new Reflector(geometry, { textureWidth: window.innerWidth * 2, textureHeight: window.innerHeight * 2,
            color: 0x777777});

        mirror.position.set(0, 6.5, -17.4);
        this.add(mirror);
    }
}

export { MyMirror };
