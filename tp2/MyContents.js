import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { LoadObjects } from './load/LoadObjects.js'
/**
 *  This class contains the contents of out application
 */
class MyContents  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app) {
        this.app = app
        this.axis = null

        this.reader = new MyFileReader(this.onSceneLoaded.bind(this));
        this.reader.open("scenes/scene.json");
    }

    /**
     * initializes the contents
     */
    init() {
        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.addSpiral();
            this.app.scene.add(this.axis)
        }
    }

    /**
     * Adds a spiral to the scene using BufferGeometry
     */
    addSpiral() {
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        const indices = [];
    
        const layers = 3; 
        const radius = 8; 
        const segments = 5; 
    
       
        const color = new THREE.Color(0xf54284);
    
        
        for (let i = 0; i <= layers; i++) {
            const currentRadius = radius * (1 - i / layers); 
            for (let j = 0; j < segments; j++) {
                const angle = (j / segments) * Math.PI * 2;
                const x = currentRadius * Math.cos(angle);
                const y = currentRadius * Math.sin(angle);
    
                positions.push(x, y, 0); 
                colors.push(color.r, color.g, color.b); 
            }
        }
    
        
        for (let i = 0; i < layers; i++) {
            for (let j = 0; j < segments; j++) {
                const current = i * segments + j;
                const next = i * segments + (j + 1) % segments;
                const above = (i + 1) * segments + j;
                const aboveNext = (i + 1) * segments + (j + 1) % segments;
    
                
                indices.push(current, above, aboveNext);
                indices.push(current, aboveNext, next);
            }
        }
    
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.setIndex(indices);
    
        
        const material = new THREE.MeshBasicMaterial({
            vertexColors: true,
            side: THREE.DoubleSide, 
            wireframe: true, 
        });
    
        
        const mesh = new THREE.Mesh(geometry, material);

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        mesh.position.set(-19.9, 8, 0); 

        mesh.rotation.set(0, Math.PI/2, 0); 

        
        mesh.scale.set(0.5, 0.5, 0.5); 

        this.app.scene.add(mesh);
    }
    
    

 
    /**
     * called when the json scene is loaded 
     * @param {*} data - the scene data
     */
    onSceneLoaded(data) {
        console.info("YASF loaded.")
        this.onAfterSceneLoadedAndBeforeRender(data);
    }
    
    /**
     * Prints the YASF data to the console
     * @param {*} data - the YASF data
     * @param {*} indent - the indentation string
     */
    printYASF(data, indent = '') {
        for (let key in data) {
            if (typeof data[key] === 'object' && data[key] !== null) {
                console.log(`${indent}${key}:`);
                this.printYASF(data[key], indent + '\t');
            } else {
                console.log(`${indent}${key}: ${data[key]}`);
            }
        }
    }


    /**
     * Called after the scene is loaded and before the render loop
     * @param {*} data - the scene data
     */
    onAfterSceneLoadedAndBeforeRender(data) {
        const bgColor = new THREE.Color(
            data.yasf.globals.background.r / 255,
            data.yasf.globals.background.g / 255,
            data.yasf.globals.background.b / 255
        );
        this.app.scene.background = bgColor;

        const ambientLight = new THREE.AmbientLight(
            new THREE.Color(
                data.yasf.globals.ambient.r / 255,
                data.yasf.globals.ambient.g / 255,
                data.yasf.globals.ambient.b / 255
            )
        );
        this.app.scene.add(ambientLight);

        const fogColor = new THREE.Color(
            data.yasf.fog.color.r,
            data.yasf.fog.color.g,
            data.yasf.fog.color.b
        );

        this.app.scene.fog = new THREE.Fog(fogColor, data.yasf.fog.near, data.yasf.fog.far);

        const texLoader = new THREE.TextureLoader();
        var textures = {}

        for (let key in data.yasf.textures) {
            const texture = data.yasf.textures[key];

            if (texture.type === "video") {
                console.log(`Loading video texture: ${key}`);
                const video = document.createElement("video");
                video.src = "scenes/video/fixed_barbie.mp4"; 
                video.autoplay = true; 
                video.muted = true;
                video.loop = true; 
                video.preload = "auto"; 

                video.play();

                const videoTexture = new THREE.VideoTexture(video);
                videoTexture.minFilter = THREE.LinearFilter;
                videoTexture.magFilter = THREE.LinearFilter;
                videoTexture.format = THREE.RGBAFormat;
                
                textures[key] = videoTexture;
            } else {
                const texture = texLoader.load(data.yasf.textures[key].filepath)
                textures[key] = texture
            }
        }
        
        var materials = {}
        for (var key in data.yasf.materials)
        {
            let m = data.yasf.materials[key];
            let material = new THREE.MeshPhongMaterial();
            material.color.setRGB(m.color.r, m.color.g, m.color.b);
            material.specular.setRGB(m.specular.r, m.specular.g, m.specular.b);
            material.specular.setRGB(m.specular.r, m.specular.g, m.specular.b);
            material.emissive.setRGB(m.emissive.r, m.emissive.g, m.emissive.b);
            material.shininess = m.shininess;
            material.map = textures[m.textureref];

            if (m.bumpref) {
                material.bumpMap = textures[m.bumpref];
                material.bumpScale = m.bumpScale || 1.0; 
            }

            materials[key] = material;
        }

    

        console.log(data);
        let object = LoadObjects.Load(data.yasf.graph, materials);
        this.app.scene.add(object);
        
    }

    update() {
        
    }
}

export { MyContents };

