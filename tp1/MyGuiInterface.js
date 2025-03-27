import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';

/**
    This class customizes the gui interface for the app
*/
class MyGuiInterface  {

    /**
     * 
     * @param {MyApp} app The application object 
     */
    constructor(app) {
        this.app = app
        this.datgui =  new GUI();
        this.contents = null
    }

    /**
     * Set the contents object
     * @param {MyContents} contents the contents objects 
     */
    setContents(contents) {
        this.contents = contents
    }

    degreesToRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    /**
     * Initialize the gui interface
     */
    init() {
        // adds a folder to the gui interface for the camera
        const cameraFolder = this.datgui.addFolder('Camera')
        cameraFolder.add(this.app, 'activeCameraName', [ 'Perspective 1', 'Perspective 2', 'Left', 'Top', 'Front', 'Right', 'Back' ] ).name("Active Camera");
        // note that we are using a property from the app 
        cameraFolder.add(this.app.activeCamera.position, 'x', -10, 10).name("x coord")
        cameraFolder.open()

        const generalFolder = this.datgui.addFolder('General');
        generalFolder.add(this.contents, 'showAxis').name("Show Axis");
        generalFolder.add(this.contents, 'lightsEnabled').name("Spotlights Enabled");
        generalFolder.add(this.contents, 'tableZ', 0, 15).name("Table Z");
        generalFolder.open()

        const spotlightFolder = generalFolder.addFolder('Spotlights')
        spotlightFolder.add(this.contents, 'tableLightEnabled').name('Table Light');
        spotlightFolder.add(this.contents, 'painting1LightEnabled').name('Painting 1 Light');
        spotlightFolder.add(this.contents, 'painting2LightEnabled').name('Painting 2 Light');
        spotlightFolder.add(this.contents, 'windowLightEnabled').name('Window Light');
        spotlightFolder.add(this.contents, 'beetlePaintingLightEnabled').name('Beetle Painting Light');
        spotlightFolder.add(this.contents, 'sofaLightEnabled').name('Sofa Light');
        spotlightFolder.add(this.contents, 'lampLightEnabled').name('Lamp Light');
        spotlightFolder.open()
    }
}

export { MyGuiInterface };