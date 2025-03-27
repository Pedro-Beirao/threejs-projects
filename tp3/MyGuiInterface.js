import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MyApp } from './MyApp.js';
import * as THREE from 'three'

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
    }

    /**
     * Initialize the gui interface
     */
    init()
    {
        const cameraFolder = this.datgui.addFolder('General')
        cameraFolder.add(this.app.camera, 'activeCameraName', [ 'Freefly', 'Top', 'FirstPerson']).name("[C]amera").listen();
        cameraFolder.add(this.app.directionallight, 'visible').name("Enable Directional [L]ight").listen();
        cameraFolder.add(this.app.reader.track, 'visible').name("Display [T]rack Collision").listen();
        cameraFolder.open()
    }
}

export { MyGuiInterface };