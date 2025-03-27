import * as THREE from 'three'

class MyRoute extends THREE.Group
{
    constructor(spacedPoints, app)
    {
        super();
        this.app = app;
        this.name = "track";
        this.spacedPoints = []
        for (var p = 0; p < spacedPoints.length; p++)
            if (p % 10 == 0)
                this.spacedPoints.push(spacedPoints[p]);

        this.progress = 0;
        this.completedLaps = 0;

        // for (var i in this.spacedPoints)
        // {
        //     var geom = new THREE.BoxGeometry(.3,.3,.3);
        //     var cube = new THREE.Mesh(geom);
        //     cube.position.x = -this.spacedPoints[i].x;
        //     cube.position.y = 3;
        //     cube.position.z = this.spacedPoints[i].z;
        //     this.add(cube)
        // }
    }

    getNext()
    {
        this.progress++;

        if (this.progress < 0) this.progress = 0;
        else if (this.progress >= this.spacedPoints.length) {
            //this.progress = this.spacedPoints.length - 1;
            this.progress = 0;
            this.completedLaps++;
            this.lapCounted = true;
            console.log("Lap completed: " + this.completedLaps);

            if (this.app && this.app.updateDisplay) {
                this.app.updateDisplay();
            }
        }

        return this.spacedPoints[this.progress]
    }
}

export { MyRoute };