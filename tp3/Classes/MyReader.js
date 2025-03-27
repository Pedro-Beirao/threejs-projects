import * as THREE from 'three'
import { LoadObjects } from '../load/LoadObjects.js'
import { MyTrack } from './MyTrack.js'
import { MyRoute } from './MyRoute.js'
import { MyBalloon } from './MyBalloon.js'
import { MyOpponent } from './MyOpponent.js'
import { MyFileReader } from '../parser/MyFileReader.js';
import { MyPowerUp } from './MyPowerUp.js';
import { MyObstacle } from './MyObstacle.js';
import { MyChoices } from './MyChoices.js'
import { My3DText } from './My3DText.js'
import { MyWater } from './MyWater.js'
import { MyFirework } from './MyFirework.js'
import { MyWeirdDisplay } from './MyWeirdDisplay.js'
import { MyWeirdDynamicDisplay } from './MyWeirdDynamicDisplay.js'


/**
 * Handles the game setup
 * Responsible for managing the game's main objects, including track, balloon, opponent, power-ups, obstacles, and environment
 */
class MyReader extends THREE.Group
{
    constructor(app)
    {
        super();
        this.app = app;
        
        this.fileReader = new MyFileReader(this.loadYasf.bind(this));
        this.fileReader.open("scenes/scene.json");

        this.track = new MyTrack(this.app);
        this.route = new MyRoute(this.track.spacedPoints);
        this.balloon = null;
        this.opponent = null
        this.choices = new MyChoices(this.app);
        this.powerUps = [];
        this.obstacles = [];
        this.fireworks = []
        this.text = new My3DText(this.app);
        this.water = new MyWater(this.app, 40);
        this.water.position.set(-16, -1, -13);
        this.weirddisplay = new MyWeirdDisplay(this.app)
        this.weirddisplay.scale.set(0.4, 0.4, 0.4);
        this.weirddisplay.position.set(2.169, 1, -23.848);
        this.weirddisplay.rotation.y = -Math.PI / 6
        this.weirddynamicdisplay = new MyWeirdDynamicDisplay(this.app)
        this.weirddynamicdisplay.scale.set(1, 1, 1);
        this.weirddynamicdisplay.position.set(-1.035, 2.5, -32.495);
        this.weirddynamicdisplay.rotation.y = Math.PI / 12

        this.canvas = document.createElement('canvas');
        this.canvas.width = 500; 
        this.canvas.height = 300;
        this.canvas.style.position = 'absolute';
        this.canvas.style.bottom = '200px'; 
        this.canvas.style.left = '350px'; 
        this.canvas.style.pointerEvents = 'none';
        document.body.appendChild(this.canvas);
        this.context = this.canvas.getContext('2d');

        this.spritesheet = null;
        const loader = new THREE.TextureLoader();
        loader.load('objs/spritesheet.png', (texture) => {
            this.spritesheet = texture;
        });


        this.app.scene.add(this.track);
        this.app.scene.add(this.route);
        this.app.scene.add(this.choices);
        this.app.scene.add(this.water);
        this.app.scene.add(this.weirddisplay);
        this.app.scene.add(this.weirddynamicdisplay);
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
     * Loads power-ups, obstacles, balloons, and the opponent into the scene
     */
    load()
    {
        const powerupPositions = [{ x: 2.97, y: 4, z: -9.261 }, { x: 12, y: 4.5, z: -15 }, { x: -1, y: 4.5, z: -14.5 }];
        powerupPositions.forEach(pos => {
            const powerUp = new MyPowerUp(pos, this.app);
            this.powerUps.push(powerUp);
        });
        
        const obstaclePositions = [{ x: 6, y: 3.5, z: -20 }, { x: 8.5, y: 4, z: -25 }, { x: 20, y: 4, z: -15.5 }, { x: -15, y: 4, z: -14.5 },];
        obstaclePositions.forEach(pos => {const obstacle = new MyObstacle(pos, this.app); this.obstacles.push(obstacle); });
        this.obstacles.forEach(obstacle => this.app.scene.add(obstacle));

        this.balloon = new MyBalloon(this.app, this.track, this.choices.choice_player);
        this.balloon.balloon.position.copy(this.choices.choice_start_player);
        this.add(this.balloon);
        this.balloon.setPowerUps(this.powerUps);
        this.balloon.setObstacles(this.obstacles);

        this.opponent = new MyOpponent(this.app, this.route, this.choices.choice_opponent);
        this.opponent.balloon.position.copy(this.choices.choice_start_opponent);
        this.add(this.opponent);
        
        this.app.camera.setActiveCamera("Top")

        // const hello = this.text.createText("hello")
        // this.add(hello)
    }

    /**
     * Checks for collisions between balloons, power-ups, and obstacles
     */
    checkCollisions() {
        if (!this.balloon) return;
    
        this.obstacles.forEach((obstacle, index) => {
            if (obstacle.boundingSphere && this.balloon.boundingSphere.intersectsSphere(obstacle.boundingSphere)) {
                console.log("Collision with obstacle detected!");
                this.balloon.handleCollisionWithObstacle();
                this.removeObstacle(obstacle, index); 
            }
            obstacle.update();
        });
    
        this.powerUps.forEach((powerUp, index) => {
            if (powerUp && this.balloon.boundingSphere.intersectsSphere(powerUp.boundingSphere)) {
                console.log("Collision with power-up detected!");
                this.balloon.handleCollisionWithPowerUp();
                this.removePowerUp(powerUp, index); 
            }
            powerUp.update();
        });
        
    }
    
    
    /**
     * Removes a power-up from the scene and respawns it after a delay
     * @param {Object} powerUp - The power-up object to remove
     * @param {number} index - The index of the power-up in the array
     */
    removePowerUp(powerUp, index) {
        this.app.scene.remove(powerUp);
        const removedPowerUps = this.powerUps.splice(index, 1);
        const removedPowerUp = removedPowerUps[0];
        console.log("Powerup removed");
        setTimeout(() => {this.bringPowerUp(removedPowerUp.position);}, 10000); 
    }

    /**
     * Removes an obstacle from the scene and respawns it after a delay
     * @param {Object} obstacle - The obstacle object to remove
     * @param {number} index - The index of the obstacle in the array
     */
    removeObstacle(obstacle, index) {
        this.app.scene.remove(obstacle);
        const removedObstacles = this.obstacles.splice(index, 1);
        const removedObstacle = removedObstacles[0];
        console.log("Obstacle removed");
        setTimeout(() => {this.bringObstacle(removedObstacle.position);}, 10000);
    }
    

    bringPowerUp(position) {
        const newPowerUp = new MyPowerUp(position, this.app);
        this.powerUps.push(newPowerUp);
        console.log("Power-Up came back!");
    }

    bringObstacle(position) {
        const newObstacle = new MyObstacle(position, this.app);
        this.obstacles.push(newObstacle);
        console.log("Obstacle came back!");
    }
    
    

    /**
     * Updates all game objects and manages the state of the game
     */
    update()
    {
        this.choices.update();
        this.water.update();

        if (this.app.state == this.app.STARTED)
        {
            if (this.balloon === null) this.load()

            this.balloon.update(); 
            this.opponent.update();

        } else if(this.app.state == this.app.ENDED) {
            if(Math.random()  < 0.05 ) {
                this.fireworks.push(new MyFirework(this.app, this))
            }

            for( let i = 0; i < this.fireworks.length; i++ ) {
                if (this.fireworks[i].done) {
                    this.fireworks.splice(i,1)
                    continue
                }
                this.fireworks[i].update()
            }
        }
    }

    /**
     * Draws text onto the canvas using a spritesheet
     * @param {string} text - The text to draw
     * @param {number} x - The x-coordinate of the text
     * @param {number} y - The y-coordinate of the text
     * @param {number} [scale=0.6] - The scaling factor for the text
     */
    drawText(text, x, y, scale = 0.6) {
        if (!this.spritesheet) return;

        const charWidth = 32 * scale; 
        const charHeight = 32 * scale;
        const gridSize = 16; 

        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i);
            const col = charCode % gridSize;
            const row = Math.floor(charCode / gridSize);
            const sx = col * 32;
            const sy = row * 32;

            this.context.drawImage(
                this.spritesheet.image,
                sx,
                sy,
                32,
                32,
                x + i * charWidth,
                y,
                charWidth,
                charHeight
            );
        }
    }
    

    loadYasf(data)
    {
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

        this.app.directionallight = this.app.scene.getObjectByName("LIGHT")
    }
}

export { MyReader };