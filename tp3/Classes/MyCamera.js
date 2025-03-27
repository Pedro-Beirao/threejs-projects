import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

class MyCamera extends THREE.Group {
    constructor(app)
    {
        super();
        this.app = app;
        this.controls = null
        
        this.activeCamera = null
        this.activeCameraName = null
        this.lastCameraName = null
        this.cameras = []
        this.frustumSize = 20
        
        this.initCameras();
        this.setActiveCamera('Freefly')
        
        // manage window resizes
        window.addEventListener('resize', this.onResize.bind(this), false );
    }

    initCameras()
    {
        const aspect = window.innerWidth / window.innerHeight;

        // Create a basic perspective camera
        const perspective1 = new THREE.PerspectiveCamera( 75, aspect, 0.1, 20000 )
        perspective1.position.set(4.837, 10, 9.328)
        this.cameras['Freefly'] = perspective1

        // defines the frustum size for the orthographic cameras
        const left = -this.frustumSize / 2 * aspect
        const right = this.frustumSize /2 * aspect 
        const top = this.frustumSize / 2 
        const bottom = -this.frustumSize / 2
        const near = -this.frustumSize /2
        const far =  this.frustumSize

        // create a top view orthographic camera
        const topCam = new THREE.PerspectiveCamera( 75, aspect, 0.1, 20000 )
        topCam.position.set(0,20,0)
        topCam.lookAt(new THREE.Vector3(0, -100, 0))
        this.cameras['Top'] = topCam

        const firstPersonCam = new THREE.PerspectiveCamera(90, aspect, 0.1, 20000);
        firstPersonCam.position.set(0, 0, 0); 
        this.cameras['FirstPerson'] = firstPersonCam;
    }

    setActiveCamera(cameraName) {   
        this.activeCameraName = cameraName
        this.activeCamera = this.cameras[this.activeCameraName]
    }

    getActiveCamera() { 
        return this.activeCamera
    }

    /**
     * updates the active camera if required
     * this function is called in the render loop
     * when the active camera name changes
     * it updates the active camera and the controls
     */
    updateCameraIfRequired() {

        // camera changed?
        if (this.lastCameraName !== this.activeCameraName) {
            this.lastCameraName = this.activeCameraName;
            this.activeCamera = this.cameras[this.activeCameraName]
            document.getElementById("camera").innerHTML = this.activeCameraName
            
            if (this.app.reader.balloon !== null)
                this.activeCamera.position.z = this.app.reader.balloon.balloon.position.z;
            
            // call on resize to update the camera aspect ratio
            // among other things
            this.onResize()

            // are the controls yet?
            if (this.controls === null) {
                // Orbit controls allow the camera to orbit around a target.
                this.controls = new OrbitControls( this.activeCamera, this.app.renderer.domElement );
                this.controls.enableZoom = true;
                this.controls.target = new THREE.Vector3(0,5,0)
                this.controls.update();
            }
            else
            {
                this.controls.object = this.activeCamera

                if (this.activeCameraName == "Top" || this.activeCameraName == "FirstPerson" )
                {
                    this.controls.enableRotate = false;
                    this.controls.enablePan = false;
                }
                else
                {
                    this.controls.enableRotate = true;
                    this.controls.enablePan = true;
                }
            }
        }
    }

    onResize() {
        if (this.activeCamera !== undefined && this.activeCamera !== null) {
            this.activeCamera.aspect = window.innerWidth / window.innerHeight;
            this.activeCamera.updateProjectionMatrix();
            this.app.renderer.setSize( window.innerWidth, window.innerHeight );
        }
    }

    update()
    {
        this.updateCameraIfRequired();

        this.lastCameraName = this.activeCameraName

        if (this.activeCameraName == "Freefly")
        {
            // if (this.app.state == this.app.INMENU && this.once)
            //     this.cameras['Freefly'].lookAt(-12.488, 0.246, -23.403);

            // this.once = false;
        }
        else if (this.activeCameraName === 'FirstPerson' && this.app.reader.balloon) {
            const balloonPosition = this.app.reader.balloon.balloon.position;

            this.cameras['FirstPerson'].position.set(balloonPosition.x, balloonPosition.y - 0.2, balloonPosition.z);

            this.cameras['FirstPerson'].lookAt(balloonPosition.x, balloonPosition.y - 10, balloonPosition.z);
        }
        else if (this.activeCameraName === "Top" && this.app.reader.balloon !== null)
        {
            this.activeCamera.position.x = this.app.reader.balloon.balloon.position.x;
            this.activeCamera.position.z = this.app.reader.balloon.balloon.position.z;
            this.activeCamera.rotation.set(-Math.PI / 2,0, 0)
        }
    }

    nextCamera()
    {
        if (this.activeCameraName == "Freefly") this.setActiveCamera("Top");
        else if (this.activeCameraName == "Top") this.setActiveCamera("FirstPerson");
        else if (this.activeCameraName == "FirstPerson") this.setActiveCamera("Freefly");
    }
}

export { MyCamera };
