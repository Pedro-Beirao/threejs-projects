import * as THREE from 'three'

/**
 * Manages the outdoor display for the game
 * Displays game information such as laps, air layers, vouchers, time, and game status
 */
class MyOutdoor {
    constructor(app) {
        this.app = app;
        
        this.canvas = document.createElement('canvas');
        this.canvas.width = 430; 
        this.canvas.height = 240;
        this.canvas.style.position = 'absolute';
        this.canvas.style.bottom = '10px'; 
        this.canvas.style.left = '10px'; 
        this.canvas.style.pointerEvents = 'none';
        document.body.appendChild(this.canvas);
        this.context = this.canvas.getContext('2d');

        this.spritesheet = null;
        const loader = new THREE.TextureLoader();
        loader.load('objs/spritesheet.png', (texture) => {
            this.spritesheet = texture;
        });

        this.laps = 0;
        this.ballonLaps = 0;
        this.layer = 0;
        this.vouchers = 0;
        this.time = "0:00";
        this.status = "Running";
        this.timeLimit = "0:00";

        this.updateDisplay();

        const balloon_race1 = this.app.reader.text.createText("BALLOON")
        balloon_race1.position.set(-12.46, 2.2, -5.732)
        balloon_race1.rotation.set(0, Math.PI / 5, 0)

        const balloon_race2 = this.app.reader.text.createText("RACE")
        balloon_race2.position.set(-11.515, 1.5, -6.048)
        balloon_race2.rotation.set(0, Math.PI / 5, 0)
        this.app.scene.add(balloon_race1)
        this.app.scene.add(balloon_race2)
    }

    /**
     * Draws text on the canvas using the spritesheet
     * @param {string} text - The text to draw
     * @param {number} x - The x-coordinate on the canvas
     * @param {number} y - The y-coordinate on the canvas
     * @param {number} [scale=0.6] - Scaling factor for the text
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


    /**
     * Updates the outdoor display with the current game information.
     */
    updateDisplay() {
        if (!this.context) return;

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.app.state == this.app.STARTED)
        {
            this.drawText(`Completed Laps Op: ${this.laps}`, 10, 10);
            this.drawText(`Completed Laps Bal: ${this.ballonLaps}`, 10, 40 );
            this.drawText(`Air Layer: ${this.layer}`, 10, 70);
            this.drawText(`Available Vouchers: ${this.vouchers}`, 10, 100);
            this.drawText(`Time Spent: ${this.time}`, 10, 130);
            this.drawText(`Time Left: ${this.timeLimit}`, 10, 160);
            this.drawText(`Game Status: ${this.status}`, 10, 190);
        }
    }

    updateLaps(laps) {
        this.laps = laps;
        this.updateDisplay();
    }

    updateBalloonLaps(laps) {
        this.ballonLaps = laps;
        this.updateDisplay();
    }

    updateLayer(layer) {
        this.layer = layer;
        this.updateDisplay();
    }

    updateVouchers(vouchers) {
        this.vouchers = vouchers;
        this.updateDisplay();
    }

    updateTime(time) {
        this.time = time;
        this.updateDisplay();
    }

    updateStatus(status) {
        this.status = status;
        this.updateDisplay();
    }

    updateTimeLimit(time) {
        this.timeLimit = time;
        this.updateDisplay();
    }
}

export { MyOutdoor };
