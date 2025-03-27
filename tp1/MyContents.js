import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyRoom } from './Objects/MyRoom.js';
import { MyTable } from './Objects/MyTable.js';
import { MyPainting } from './Objects/MyPainting.js';
import { MyMirror } from './Objects/MyMirror.js';
import { MySofa } from './Objects/MySofa.js';
import { MyRug } from './Objects/MyRug.js';
import { MyLipstick } from './Objects/MyLipstick.js';
import { MyLamp } from './Objects/MyLamp.js';

/**
 *  This class contains the contents of our application: the room, its objects and lights
 */
class MyContents {

    /**
     * Constructs the object and initializes properties
     * @param {MyApp} app - The application object
     */
    constructor(app) {
        this.app = app
        this.axis = null
        this.showAxis = true;

        this.shadowMapSize = 1024;

        this.lights = [];
        this.lightsEnabled = true;
        this.tableLightEnabled = true;
        this.painting1LightEnabled = true;
        this.painting2LightEnabled = true;
        this.windowLightEnabled = true;
        this.beetlePaintingLightEnabled = true;
        this.sofaLightEnabled = true;
        this.lampLightEnabled = true;


        this.room = new MyRoom(this.app);
        this.table = new MyTable(this.app);
        this.painting1 = new MyPainting(this.app, "Textures/barbie.jpg", 5, 5);
        this.painting2 = new MyPainting(this.app, "Textures/ken.png", 5, 5);
        this.window = new MyPainting(this.app, "Textures/landscape.jpg", 10, 5)
        this.beetlePainting = new MyPainting(this.app, "Textures/FabricWhite.jpg", 10, 5, true);
        this.mirror = new MyMirror(this.app);
        this.sofa = new MySofa(this.app);
        this.rug = new MyRug(this.app, 'round');
        this.rug2 = new MyRug(this.app, 'rectangular');
        this.lamp = new MyLamp(this.app);

        this.tableLight = null;
        this.painting1Light = null;
        this.painting2Light = null;
        this.windowLight = null;
        this.beetlePaintingLight = null;
        this.sofaLight = null;
        this.lampLight = null;

        this.tableZ = 9.5;
        this.lipstick = new MyLipstick(this.app);
    }

    /**
     * initializes the contents of the scene and the lights
     */
    init() {

        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
        }

       
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); 
        this.app.scene.add(ambientLight);

        const ceilingLight = new THREE.PointLight(0xfffacd, 1.5, 30); 
        ceilingLight.position.set(0, 8, 0); 
        this.app.scene.add(ceilingLight);

        this.app.renderer.outputEncoding = THREE.sRGBEncoding;


        this.app.scene.add(this.room)

        this.table.rotation.y = 2 * Math.PI;
        this.table.position.x = 0;
        this.table.position.z = this.tableZ;
        this.app.scene.add(this.table)

        this.painting1.rotation.y = -Math.PI / 2;
        this.painting1.position.y = 7;
        this.painting1.position.x = 10;
        this.painting1.position.z = -5;
        this.app.scene.add(this.painting1)

        this.painting2.rotation.y = -Math.PI / 2;
        this.painting2.position.y = 7;
        this.painting2.position.x = 10;
        this.painting2.position.z = 5;
        this.app.scene.add(this.painting2)

        this.window.rotation.y = Math.PI / 2;
        this.window.position.y = 7;
        this.window.position.x = -10;
        this.app.scene.add(this.window)

        this.beetlePainting.position.z = 17.4
        this.beetlePainting.position.y = 7
        this.beetlePainting.rotation.y = Math.PI
        this.app.scene.add(this.beetlePainting)

        this.sofa.position.z = -8
        this.sofa.rotation.y = Math.PI
        this.sofa.position.y = 0.02
        this.app.scene.add(this.sofa);

        this.app.scene.add(this.mirror)

        this.rug.position.set(0, 0, 10.5);
        this.app.scene.add(this.rug);

        this.rug2.position.set(0, 0, -10);
        this.app.scene.add(this.rug2);

        this.lipstick.position.set(8, 0, -16);
        this.lipstick.scale.set(2.5, 2.5, 2.5);
        this.app.scene.add(this.lipstick);

        this.lamp.position.set(-8, 0, -16);
        this.app.scene.add(this.lamp);

        this.initLights();
    }

    /**
     * Initializes the spotlights for specific objects in the scene
     */
    initLights() {
        this.tableLight = this.addSpotLight([0xffffff, 40, 20, 0.75], [0, 6, 14.5], null)
        this.painting1Light = this.addSpotLight([0xffffff, 200, 20, .5], [5, 12, -5], this.painting1)
        this.painting2Light = this.addSpotLight([0xffffff, 200, 20, .5], [5, 12, 5], this.painting2)
        this.windowLight = this.addSpotLight([0xffffff, 100, 250, .7], [-5, 10, 0], this.window)
        this.beetlePaintingLight = this.addSpotLight([0xffffff, 100, 20, .7], [0, 10, 15], this.beetlePainting)
        this.sofaLight = this.addSpotLight([0xffffff, 100, 20, .7], [0, 11, -10.5], this.sofa)
    }

    /**
     * Adds a spotlight to the scene with specified properties
     * @param {[color, intensity, range, angle]} lightParams - Array of light properties
     * @param {[x, y, z]} position - Array defining the position of the spotlight
     * @param {THREE.Object3D|null} target - The target object for the spotlight
     * @returns {THREE.SpotLight} The created spotlight
     */
    addSpotLight([color, intensity, range, angle], [x, y, z], target) {
        var spotLight = new THREE.SpotLight(color, intensity, range, angle, 0.2, 2);
        spotLight.position.set(x, y, z);
        if (target != null) spotLight.target = target;
        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = this.shadowMapSize;
        spotLight.shadow.mapSize.height = this.shadowMapSize;
        spotLight.shadow.camera.near = 0.5;
        spotLight.shadow.camera.far = 100;
        this.app.scene.add(spotLight);
        return spotLight;
    }

    /**
     * Updates the visibility and positioning of the elements in the scene
     */
    update() {
        this.axis.visible = this.showAxis;
        this.table.position.z = this.tableZ;
        this.rug.position.z = this.tableZ;
        this.tableLight.visible = this.tableLightEnabled;
        this.painting1Light.visible = this.painting1LightEnabled;
        this.painting2Light.visible = this.painting2LightEnabled;
        this.windowLight.visible = this.windowLightEnabled;
        this.beetlePaintingLight.visible = this.beetlePaintingLightEnabled;
        this.sofaLight.visible = this.sofaLightEnabled;
        this.lamp.lampLight.visible = this.lampLightEnabled;
    }

}

export { MyContents };