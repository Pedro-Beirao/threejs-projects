import * as THREE from 'three'
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';

/**
 * Handles the player and opponent selection process in the game
 * Allows the user to choose the balloon colors for both players and their starting positions
 */
class MyChoices extends THREE.Group{

    /**
     * Constructor for the MyChoices class.
     * @param {Object} app - Application object
     */
    constructor(app) {
        super();
        this.app = app;
        
        this.balloon_red = this.createBalloon("red")
        this.balloon_red_pos = new THREE.Vector3(-29.005, 1, -11.578)
        this.balloon_red.position.copy(this.balloon_red_pos)
        this.add(this.balloon_red)

        this.balloon_blue = this.createBalloon("blue")
        this.balloon_blue_pos = new THREE.Vector3(-30.388, 1, -12.309)
        this.balloon_blue.position.copy(this.balloon_blue_pos)
        this.add(this.balloon_blue)

        this.balloon_yellow = this.createBalloon("yellow")
        this.balloon_yellow_pos = new THREE.Vector3(-27.667, 1, -25.980)
        this.balloon_yellow.position.copy(this.balloon_yellow_pos)
        this.add(this.balloon_yellow)

        this.balloon_black = this.createBalloon("black")
        this.balloon_black_pos = new THREE.Vector3(-26.725, 1, -26.390)
        this.balloon_black.position.copy(this.balloon_black_pos)
        this.add(this.balloon_black)

        this.camPos1 = new THREE.Vector3(-28.35, 1, -14.008)
        this.camTarget1 = new THREE.Vector3(-29.931, 1, -11.942)

        this.camPos2 = new THREE.Vector3(-26.58, 1, -24.317)
        this.camTarget2 = new THREE.Vector3(-27.289, 1, -26.304)

        this.camPos3 = new THREE.Vector3(0.553, 15, -2.687)
        this.camTarget3 = new THREE.Vector3(0.553, 0.000, -2.687)

        this.startPos1 = new THREE.Vector3(0.507, 3, -4.105);
        this.startPos2 = new THREE.Vector3(1.334, 3, -2.419);

        const spriteTexture = new THREE.TextureLoader().load('./objs/circle.png');
        const spriteMaterial = new THREE.SpriteMaterial({ map: spriteTexture });
        this.circle = new THREE.Sprite(spriteMaterial);
        this.circle.position.set(this.balloon_red_pos.x, this.balloon_red_pos.y + 0.3, this.balloon_red_pos.z)
        this.add(this.circle)

        this.current_choice = false;
        this.previousState = this.app.state;

        this.choice_player = "red";
        this.choice_opponent = "yellow"
        this.choice_start_player = this.startPos1;
        this.choice_start_opponent = this.startPos2;

        window.addEventListener('keydown', (e) => {
            if (e.key == 'a') this.current_choice = false;
            else if (e.key == 'd') this.current_choice = true;
        });
    }

    /**
     * Creates a balloon of the specified color using an OBJ model and material
     * @param {string} color - The color of the balloon
     * @returns {THREE.Group} A group containing the balloon model
     */
    createBalloon(color)
    {
        const parent = new THREE.Group();

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

                parent.add(detailedBalloon);
            });
        });

        return parent;
    }

    update()
    {
        var pos = null
        var target = null

        var keys_ui = document.getElementById("choices");

        if (this.app.state == this.app.CHOOSE_PLAYER)
        {
            this.circle.visible = true;
            keys_ui.style.visibility = "visible"

            pos = this.camPos1
            target = this.camTarget1

            if (!this.current_choice)
            {
                this.circle.position.set(this.balloon_red_pos.x, this.balloon_red_pos.y + 0.3, this.balloon_red_pos.z)
                this.choice_player = "red";
            }
            else
            {
                this.circle.position.set(this.balloon_blue_pos.x, this.balloon_blue_pos.y + 0.3, this.balloon_blue_pos.z)
                this.choice_player = "blue"
            }
        }
        else if (this.app.state == this.app.CHOOSE_OPPONENT)
        {
            this.circle.visible = true;
            keys_ui.style.visibility = "visible"
            
            pos = this.camPos2
            target = this.camTarget2

            if (!this.current_choice)
            {
                this.circle.position.set(this.balloon_yellow_pos.x, this.balloon_yellow_pos.y + 0.3, this.balloon_yellow_pos.z)
                this.choice_opponent = "yellow";
            }
            else
            {
                this.circle.position.set(this.balloon_black_pos.x, this.balloon_black_pos.y + 0.3, this.balloon_black_pos.z)
                this.choice_opponent = "black";
            }
        }
        else if (this.app.state == this.app.CHOOSE_START)
        {
            this.circle.visible = true;
            keys_ui.style.visibility = "visible"
            
            pos = this.camPos3
            target = this.camTarget3

            if (!this.current_choice)
            {
                this.circle.position.set(this.startPos1.x, 1, this.startPos1.z)
                this.choice_start_player = this.startPos1
                this.choice_start_opponent = this.startPos2;
            }
            else
            {
                this.circle.position.set(this.startPos2.x, 1, this.startPos2.z)
                this.choice_start_player = this.startPos2;
                this.choice_start_opponent = this.startPos1;
            }
        }
        else
        {
            this.circle.visible = false;
            keys_ui.style.visibility = "hidden"

            if (this.app.state == this.app.STARTED)
            {
                if (this.choice_player == "red") this.balloon_red.visible = false;
                else if (this.choice_player == "blue") this.balloon_blue.visible = false;
                if (this.choice_opponent == "yellow") this.balloon_yellow.visible = false;
                else if (this.choice_opponent == "black") this.balloon_black.visible = false;
            }

            return;
        }


        var rot = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().lookAt(this.app.camera.activeCamera.position, target, new THREE.Vector3(0,1,0)));
        this.app.camera.activeCamera.quaternion.slerp(rot, 0.2)

        let distance = Math.sqrt( Math.pow(pos.x - this.app.camera.activeCamera.position.x, 2) + Math.pow(pos.y - this.app.camera.activeCamera.position.y, 2) + Math.pow(pos.z - this.app.camera.activeCamera.position.z, 2));
        if (distance < 0.2) return;

        this.app.camera.activeCamera.position.lerp(pos, 0.05)

        // var dir = new THREE.Vector3(pos.x - this.app.camera.activeCamera.position.x, pos.y - this.app.camera.activeCamera.position.y, pos.z - this.app.camera.activeCamera.position.z).normalize();


        // this.app.camera.activeCamera.position.x += dir.x * 0.5;
        // this.app.camera.activeCamera.position.y += dir.y * 0.5;
        // this.app.camera.activeCamera.position.z += dir.z * 0.5;

        // var rot = new THREE.Object3D()
        // rot.position.copy(this.app.camera.activeCamera.position)
        // rot.lookAt(target)
        // this.app.camera.activeCamera.quaternion.rotateTowards(rot.quaternion, 0.01);

        // this.app.camera.activeCamera.lookAt(target)
    }
}

export { MyChoices };
