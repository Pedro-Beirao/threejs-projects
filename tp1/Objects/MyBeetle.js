import * as THREE from 'three';
import { curveGenerator } from '../utils/CurveUtils.js';

/**
 * MyBeetle class
 * 
 * This class creates a representation of a beetle car using Bezier curves.
 * It extends THREE.Object3D, making it a 3D object that can be added to a Three.js scene.
 */
class MyBeetle extends THREE.Object3D {

    /**
     * Constructor for the MyBeetle class
     * 
     * @param {Object} app - The application object
     */
    constructor(app) {
        super();
        this.app = app
        this.type = 'Group';

        // control points for the Bezier curves
        let points = [
            [
                new THREE.Vector3(0,0 ,0),
                new THREE.Vector3(0,5,0),
                new THREE.Vector3(6,5,0),
                new THREE.Vector3(6,0,0),
            ],
            [
                new THREE.Vector3(0,0,0),
                new THREE.Vector3(0,8,0),
                new THREE.Vector3(8,8,0),
            ],
            [
                new THREE.Vector3(8,8,0),
                new THREE.Vector3(12,8,0),
                new THREE.Vector3(12,5,0),
            ],
            [
                new THREE.Vector3(12,5,0),
                new THREE.Vector3(16,5,0),
                new THREE.Vector3(16,0,0),
            ]
        ];

        let numberOfSamples = 20;

        // Bezier curves
        let wheel1 = curveGenerator.cubicBezierCurve(0,0,0, points[0], numberOfSamples);
        let wheel2 = curveGenerator.cubicBezierCurve(10,0,0, points[0], numberOfSamples);
        let carBody1 = curveGenerator.quadraticBezierCurve(0,0,0,points[1], numberOfSamples);
        let carBody2 = curveGenerator.quadraticBezierCurve(0,0,0, points[2], numberOfSamples);
        let carHood = curveGenerator.quadraticBezierCurve(0,0,0,points[3], numberOfSamples);
        
        this.add(wheel1, carBody1, carBody2, carHood, wheel2);
    }
}

export { MyBeetle };
