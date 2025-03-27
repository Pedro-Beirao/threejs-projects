import * as THREE from 'three';
import { MyBeetle } from './MyBeetle.js';

/**
 * MyPainting class which represents a painting object
 */
class MyPainting extends THREE.Object3D {
    /**
     * Constructor for the MyPainting class
     * @param {*} app - the application object
     * @param {string} imagePath - the path to the image file
     * @param {number} width - the width of the painting
     * @param {number} height - the height of the painting
     * @param {boolean} hasBeetle - whether the painting has a beetle or not
     */
    constructor(app, imagePath, width, height, hasBeetle=false) {
        super();
        this.app = app
        this.type = 'Group';

        const texLoader = new THREE.TextureLoader();

        // Image
        const imageTex = texLoader.load(imagePath);
        const imageMat = new THREE.MeshPhongMaterial({ map: imageTex, color: "rgb(128,128,128))", specular: "rgb(0,0,0)", emissive: "#000000", shininess: 0})
        const imageGeom = new THREE.PlaneGeometry(width, height)
        let image = new THREE.Mesh(imageGeom, imageMat);
        image.position.z = .1;
        this.add(image);


        // Frame
        const frameTex = texLoader.load( 'Textures/pinktravertine.jpg' );
        const frameMat = new THREE.MeshPhongMaterial({ map: frameTex, color: "rgb(100,100,100))", specular: "rgb(20,20,20)", emissive: "#000000", shininess: 20})
        const hFrameGeom = new THREE.BoxGeometry(width + .2, .2, .2)
        const vFrameGeom = new THREE.BoxGeometry(.2, height + .2, .2)

        let hFrame = new THREE.Mesh(hFrameGeom, frameMat);
        hFrame.position.x = -.1;
        hFrame.position.y = height / 2 + .1;
        hFrame.position.z = .1;
        this.add(hFrame);

        hFrame = new THREE.Mesh(hFrameGeom, frameMat);
        hFrame.position.x = .1;
        hFrame.position.y = - height / 2 - .1;
        hFrame.position.z = .1;
        this.add(hFrame);

        let vFrame = new THREE.Mesh(vFrameGeom, frameMat);
        vFrame.position.x = - width / 2 - .1;
        vFrame.position.y = -.1;
        vFrame.position.z = .1;
        this.add(vFrame);

        vFrame = new THREE.Mesh(vFrameGeom, frameMat);
        vFrame.position.x = width / 2 + .1;
        vFrame.position.y = .1;
        vFrame.position.z = .1;
        this.add(vFrame);

        if (hasBeetle)
        {
            this.beetle = new MyBeetle(app)
            this.beetle.position.z = .2
            this.beetle.position.x = -3
            this.beetle.position.y = -1.5
            this.beetle.scale.set(.4,.4,.4)
            this.add(this.beetle)
        }
    }
}

export { MyPainting };
