import * as THREE from 'three'
import { MyPowerUp } from './MyPowerUp.js';
import { MyObstacle } from './MyObstacle.js';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';

/**
 * Represents a 3D balloon object
 */
class MyBalloon extends THREE.Group
{
    constructor(app, track, color)
    {
        super();
        this.app = app;
        this.track = track;
        this.keys = { w: false, s: false };
        this.balloon = null;
        this.layerHeights = [3, 3.4, 3.8, 4.2, 4.6]; 
        this.windDirections = [
            { x: 0, z: 0 },
            { x: 0, z: -0.3 }, 
            { x: 0, z: 0.3 },  
            { x: 0.3, z: 0 },  
            { x: -0.3, z: 0 }, 
        ];
        this.windSpeed = 0.1;
        this.currentLayer = 0;
        this.powerUps = []; 
        this.obstacles = [];
        this.vouchers = 0;
        this.balloonStopped = false;
        this.trackPenaltyActivity = false;
        this.balloonPenaltyDuration = 3;
        this.createBalloon(color);
        this.addBalloonControls();

        this.boundingSphere = new THREE.Sphere(this.balloon.position.clone(), 0.4); 

        this.arrows = [
            null,
            document.getElementById("uarr"),
            document.getElementById("darr"),
            document.getElementById("rarr"),
            document.getElementById("larr")
        ]
    }

    /**
     * Creates the balloon object using LOD (Level of Detail)
     * @param {string} color - The color of the balloon texture
     */
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
        lod.position.set(0, 0.4, 0);

        this.balloon = lod;

        this.createGroundMark();

        this.add(this.balloon);
    }

    /**
    * Creates a visual ground marker for the balloon's position
    */
    createGroundMark() {
        const geometry = new THREE.CylinderGeometry(0.4, 0.4, 0.1); 
        const material = new THREE.MeshBasicMaterial({
            color: 0x000000
        });
        const groundMark = new THREE.Mesh(geometry, material);
        groundMark.castShadow = true;
        groundMark.position.set(0, 80, 0); 
        this.balloon.add(groundMark);
    }
    

    /**
     * Adds keyboard controls for the balloon (W to go up, S to go down)
    */
    addBalloonControls() {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'w') this.keys.w = true;
            else if (e.key === 's') this.keys.s = true;
        });
    }

    update() {
        if (this.balloonStopped) {
            return; 
        }

        if (this.keys.w || this.keys.s)
        {
            if (this.keys.w) this.currentLayer++;
            else if (this.keys.s) this.currentLayer--;

            if (this.currentLayer < 0) this.currentLayer = 0;
            else if (this.currentLayer > 4) this.currentLayer = 4;

            for (var i = 1; i < this.arrows.length; i++)
            {
                if (i == this.currentLayer) this.arrows[i].style = "background: url('./objs/circle.png') no-repeat center; background-size:2em; padding-top: 0.5em;padding-bottom:0.5em"
                else this.arrows[i].style = "background-size:2em; padding-top: 0.5em;padding-bottom:0.5em"
            }
        }

        this.app.updateDisplay();

        this.applyWind(this.currentLayer)
        this.insideTrack()

        this.keys.w = false;
        this.keys.s = false;

        this.boundingSphere.center.copy(this.balloon.position);

        if (this.balloonLOD && camera) {
            this.balloonLOD.update(camera); 
        }
    }

    /**
     * Applies wind effects based on the current layer
     * @param {number} layer - The current air layer index
     */
    applyWind(layer) {
        const wind = this.windDirections[layer];
        this.balloon.position.x += wind.x * this.windSpeed;
        this.balloon.position.z += wind.z * this.windSpeed;
        this.balloon.position.y = this.layerHeights[this.currentLayer]
    }

    /**
     * Checks if the balloon is inside the track limits and applies penalties if not
    */
    insideTrack()
    {
        //if (this.trackPenaltyActivity) return;
        var closest = this.track.getClosestPoint(this.balloon.position)
        if (closest.y > 1.3)
        {
            if(this.vouchers > 0) {
                this.vouchers--;
                console.log("Voucher used. Remaining vouchers: " + this.vouchers);

                this.balloon.position.x = closest.x;
                this.balloon.position.z = closest.z;
                this.currentLayer = 0;

                this.app.updateDisplay();

            } else {
                this.balloonStopped = true;
                console.log("Balloon Stopped!");
                this.balloon.position.x = closest.x;
                this.balloon.position.z = closest.z;
                this.currentLayer = 0;

                for (var i = 1; i < this.arrows.length; i++)
                {
                    this.arrows[i].style = "background-size:2em; padding-top: 0.5em;padding-bottom:0.5em"
                }

                setTimeout(() => {this.balloonStopped = false; console.log("Balloon resumed movement.");}, this.balloonPenaltyDuration * 1000); 
            }

            this.changeTrackPenaltyActivity();

        }
    }

    /**
     * Sets the powerups
     * @param {Array} powerUps - Array of power-up objects
     */
    setPowerUps(powerUps) {
        this.powerUps = powerUps;
    }

    /**
    * Sets the obstacles
    * @param {Array} obstacles - Array of obstacle objects
    */
    setObstacles(obstacles) {
        this.obstacles = obstacles;
    }
    

    applyPowerUpEffect() {
        console.log("PowerUp Effect Applied!");
        this.windSpeed *= 2; 
        setTimeout(() => this.windSpeed /= 2, 4000); 
    }

    changeTrackPenaltyActivity(duration = 3000) {
        this.trackPenaltyActivity = true;
        setTimeout(() => {this.trackPenaltyActivity = false;}, duration);
    }

    /**
     * Handles collisions with obstacles
     */
    handleCollisionWithObstacle() {
        if (this.vouchers > 0) {
            console.log("Voucher used! Avoiding penalty.");
            this.vouchers--;
            this.app.updateDisplay();
        } else {
            console.log("Balloon stopped due to collision!");
            this.balloonStopped = true;
            setTimeout(() => {this.balloonStopped = false; console.log("Balloon movement resumed.");}, this.balloonPenaltyDuration * 1000); 
        }
    }
    

    /**
     * Handles collisions with powerups
     */
    handleCollisionWithPowerUp() {
        console.log("Power-up collected! Voucher added.");
        this.vouchers++;
        this.applyPowerUpEffect();
        this.app.updateDisplay();
    }
    
    
    
    
}

export { MyBalloon };