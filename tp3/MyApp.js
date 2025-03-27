
import * as THREE from 'three';
import { MyGuiInterface } from './MyGuiInterface.js';
import { MyCamera } from './Classes/MyCamera.js';
import Stats from 'three/addons/libs/stats.module.js'
import { MyAxis } from './MyAxis.js';
import { MyReader } from './Classes/MyReader.js'
import { MyOutdoor } from './Classes/MyOutdoor.js';

/**
 * This class contains the application object
 */
class MyApp  {
    
    INMENU = 0;
    CHOOSE_PLAYER = 1;
    CHOOSE_OPPONENT = 2;
    CHOOSE_START = 3;
    STARTED = 4;
    ENDED = 5;

    constructor() {
        this.scene = null
        this.stats = null

        // other attributes
        this.renderer = null
        this.renderTarget = null;
        this.gui = null
        this.axis = null

        this.camera = null
        this.axis = null
        this.reader = null;

        this.playerName = "Player";
        this.opponentName = "Opponent";

        this.winner = null;
        
        // this.raycaster = new THREE.Raycaster();
        // this.mousePos = new THREE.Vector2();

        this.state = this.INMENU;
        this.paused = false;

        this.startTime = null;
        this.elapsedTime = 0;
        this.timeLimit = 300;

        this.spritesheet = null;

        this.overlayCanvas = null;
        this.overlayContext = null;

        this.outdoorDisplay = null;
        
        this.directionallight = new THREE.Object3D();
    }

    /**
     * initializes the application
     */
    init() {
                
        // Create an empty scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x101010 );

        this.stats = new Stats()
        this.stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(this.stats.dom)

        this.camera = new MyCamera(this);

        
        // Create a renderer with Antialiasing
        this.renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setClearColor("#000000");
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        this.renderTarget = new THREE.WebGLRenderTarget(512, 512);

        // this.axis = new MyAxis(this)
        // this.scene.add(this.axis)
        this.reader = new MyReader(this);
        this.scene.add(this.reader);
        
        this.outdoorDisplay = new MyOutdoor(this);

        // Append Renderer to DOM
        document.getElementById("canvas").appendChild( this.renderer.domElement );

        this.overlayCanvas = document.createElement('canvas');
        this.overlayCanvas.width = window.innerWidth;
        this.overlayCanvas.height = window.innerHeight;
        this.overlayCanvas.style.position = 'absolute';
        this.overlayCanvas.style.top = '0';
        this.overlayCanvas.style.left = '0';
        this.overlayCanvas.style.pointerEvents = 'none';
        document.body.appendChild(this.overlayCanvas);
        this.overlayContext = this.overlayCanvas.getContext('2d');

        window.addEventListener('keydown', (e) => {
            if (this.state == this.INMENU) return;

            if (e.key === ' ')
            {
                if (this.state < this.STARTED && this.state != this.INMENU)
                {
                    this.state++;
                    if (this.state === this.STARTED) {
                        this.startTime = Date.now(); 
                    }
                }
                else if (this.state == this.STARTED)
                {
                    this.paused = !this.paused;

                    if (this.paused) {
                        this.pauseStartTime = Date.now(); 
                    } else {
                        const pauseDuration = Date.now() - this.pauseStartTime; 
                        this.startTime += pauseDuration; 
                    }
                }
            }
            else if (e.key === 'Escape')
            {
                this.endGame();
            }
            else if (e.key == 'c')
            {
                this.camera.nextCamera();
            }
            else if (e.key == 't')
            {
                this.reader.track.visible = !this.reader.track.visible;
            }
            else if (e.key == 'l')
            {
                this.directionallight.visible = !this.directionallight.visible;
            }
        });

        document.addEventListener(
            "click",
            event => {
                var mouse = new THREE.Vector2();
                mouse.x = event.clientX / window.innerWidth * 2 - 1;
                mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

                var raycaster = new THREE.Raycaster();
                raycaster.setFromCamera(mouse, this.camera.cameras['Freefly']);
                var intersects = raycaster.intersectObjects(this.scene.getObjectByName('scene').children, true);
            
                if (intersects.length > 0)
                {
                    intersects[0].point.x *= -1;
                    // console.log(this.reader.track.getClosestPoint(intersects[0].point));
                    console.log(-intersects[0].point.x.toFixed(3) + ", " + intersects[0].point.y.toFixed(3) + ", " + intersects[0].point.z.toFixed(3));
                    // navigator.clipboard.writeText("new THREE.Vector3(" + intersects[0].point.x.toFixed(3) + ", 0, " + intersects[0].point.z.toFixed(3) + "),")
                }
            },
            false
        );

        var form = document.getElementById("form");
        form.addEventListener('submit', event => {
            event.preventDefault();
    
            var form = document.getElementById("form");
            var formData = new FormData(form);
    
            if (formData.get("pname") != "") this.playerName = formData.get("pname");
            if (formData.get("oname") != "") this.opponentName = formData.get("oname");
    
            document.getElementById("menu").remove();

            this.state++;
        });
    }


    /**
     * @param {MyGuiInterface}  the gui interface object
     */
    setGui(gui) {   
        this.gui = gui
    }

    drawTextFromSpritesheet(text, position) {
        if (!this.spritesheet || !this.overlayContext) return;

        const charWidth = 32; 
        const charHeight = 32;
        const gridSize = 16;

        this.overlayContext.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);

        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i);
            const col = charCode % gridSize;
            const row = Math.floor(charCode / gridSize);
            const sx = col * charWidth;
            const sy = row * charHeight;
            const dx = position.x + i * charWidth;
            const dy = position.y;

            this.overlayContext.drawImage(
                this.spritesheet.image,
                sx,
                sy,
                charWidth,
                charHeight,
                dx,
                dy,
                charWidth,
                charHeight
            );
        }
    }

    displayText(text, position) {
        if (!this.spritesheet) {
            console.warn("Spritesheet not loaded yet!");
            return;
        }
    
        const fontSize = 1;
        const charSize = 1 / 16; 
        const material = new THREE.MeshBasicMaterial({
            map: this.spritesheet,
            transparent: true,
            side: THREE.DoubleSide
        });
    
        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i);
            const u = (charCode % 16) * charSize;
            const v = 1 - Math.floor(charCode / 16) * charSize - charSize;
    
            const geometry = new THREE.PlaneGeometry(fontSize, fontSize);
            const uvAttribute = geometry.attributes.uv;
    
            uvAttribute.setXY(0, u, v);
            uvAttribute.setXY(1, u+charSize, v);
            uvAttribute.setXY(2, u, v+charSize);
            uvAttribute.setXY(3, u+charSize, v+charSize);
    
            const mesh = new THREE.Mesh(geometry, material);
    
            mesh.rotation.x = -Math.PI; 
            mesh.rotation.y = Math.PI/2; 
    
            mesh.position.set(position.x+i * fontSize, position.y, position.z);
            this.scene.add(mesh);
        }
    }
    
    


    checkTimeLimit() {
        if (this.state === this.STARTED) {
            const now = Date.now();
            this.elapsedTime = Math.floor((now - this.startTime) / 1000);

            if (this.elapsedTime >= this.timeLimit) {
                this.endGame();
            }
        }
    }

    endGame() {
        this.state = this.ENDED;
        console.log("Game over!");
        this.updateDisplay();
        this.drawTextFromSpritesheet("Game Over!", {x: window.innerWidth / 2 - 100, y: window.innerHeight / 2});
    }

    /**
    * the main render function. Called in a requestAnimationFrame loop
    */
    render () {
        this.stats.begin()
        this.camera.update()

        if (this.state === this.STARTED && !this.paused) {
            this.checkTimeLimit();
        }

        if (!this.paused) {
            this.reader.update();
            this.reader.checkCollisions()
        }
        
        if (this.winner == null)
        {
            if (this.reader.track.progress >= 998) this.setWinner(this.playerName, this.opponentName, this.elapsedTime);
            else if (this.reader.route.completedLaps > 0) this.setWinner(this.opponentName, this.playerName, this.elapsedTime);
        }
        else
        {
            var pos = new THREE.Vector3(-23.124, 3, -14.333);
            var target = new THREE.Vector3(-29.008, 1.913, -18.882)

            let distance = Math.sqrt( Math.pow(pos.x - this.camera.activeCamera.position.x, 2) + Math.pow(pos.y - this.camera.activeCamera.position.y, 2) + Math.pow(pos.z - this.camera.activeCamera.position.z, 2));
            if (distance > 0.2)
            {
                var rot = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().lookAt(this.camera.activeCamera.position, target, new THREE.Vector3(0,1,0)));
                this.camera.activeCamera.quaternion.slerp(rot, 0.2)

                this.camera.activeCamera.position.lerp(pos, 0.05)
            }
        }
    
        this.updateDisplay()

        // render the scene
        this.reader.weirddynamicdisplay.visible = false;
        this.renderer.setRenderTarget(this.renderTarget);
        this.renderer.render(this.scene, this.camera.activeCamera);

        this.reader.weirddynamicdisplay.visible = true;
        this.renderer.setRenderTarget(null);
        this.renderer.render(this.scene, this.camera.activeCamera);

        // subsequent async calls to the render loop
        requestAnimationFrame( this.render.bind(this) );

        this.stats.end()
    }

    setWinner(winner, loser, elapsedTime) {
        this.winner = winner;
        this.state = this.ENDED
        console.log(`The winner is ${winner}`);
        console.log(`The loser is ${loser}`);
        console.log("Game over!");
        this.updateDisplay();

        const minutes = Math.floor(elapsedTime / 60);
        const seconds = elapsedTime % 60;
        const time = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        this.reader.drawText("GAME OVER!", 40,10);
        this.reader.drawText(`WINNING PLAYER: ${winner}`, 10,30);
        this.reader.drawText(`LOSING PLAYER : ${loser}`, 10,50);
        this.reader.drawText(`WINNER TIME: ${time}`, 10,70);
        
        this.camera.setActiveCamera("Freefly")

        if (this.reader.choices.choice_player == "red")
        {
            this.reader.choices.balloon_red.visible = true;
            this.reader.choices.balloon_red.position.set(-26.917, 2, -17.317)
        }
        else if (this.reader.choices.choice_player == "blue")
        {
            this.reader.choices.balloon_blue.visible = true;
            this.reader.choices.balloon_blue.position.set(-26.917, 2, -17.317)
        }

        if (this.reader.choices.choice_opponent == "black")
        {
            this.reader.choices.balloon_black.visible = true;
            this.reader.choices.balloon_black.position.set(-26.206, 2, -18.963)
        }
        else if (this.reader.choices.choice_opponent == "yellow")
        {
            this.reader.choices.balloon_yellow.visible = true;
            this.reader.choices.balloon_yellow.position.set(-26.206, 2, -18.963)
        }
    }

    updateDisplay() {
        const laps = this.reader.route.completedLaps; 

        const balloonLaps = this.reader.track.completedLaps

        let layer = 0;
        let vouchers = 0;

        if (this.reader.balloon) {
            layer = this.reader.balloon.currentLayer;
            vouchers = this.reader.balloon.vouchers;
        }
  
        const minutes = Math.floor(this.elapsedTime / 60);
        const seconds = this.elapsedTime % 60;
        const time = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        const remainingTime = Math.max(this.timeLimit - this.elapsedTime, 0);
        const remainingMinutes = Math.floor(remainingTime / 60);
        const remainingSeconds = remainingTime % 60;
        const timeLeft = `${remainingMinutes}:${remainingSeconds.toString().padStart(2, '0')}`;

        let gameStatus = 'Starting';
        if (this.state === this.STARTED) {
            gameStatus = this.paused ? 'Paused' : 'Running';
        } else if (this.state === this.ENDED) {
            gameStatus = 'Ended';
        }

        this.outdoorDisplay.updateLaps(laps);
        this.outdoorDisplay.updateBalloonLaps(balloonLaps);
        this.outdoorDisplay.updateLayer(layer);
        this.outdoorDisplay.updateVouchers(vouchers);
        this.outdoorDisplay.updateTime(time); 
        this.outdoorDisplay.updateStatus(gameStatus);
        this.outdoorDisplay.updateTimeLimit(timeLeft); 
    }
}


export { MyApp };