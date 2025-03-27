import * as THREE from 'three'

class MyTrack extends THREE.Group
{
    constructor(app)
    {
        super();
        this.app = app;
        this.name = "track";
        this.point = [];
        this.spacedPoints = [];
        this.createTrack();
        this.progress = 0;
        this.completedLaps = 0;
        this.lapCounted = false;
    }

    createTrack()
    {
        let curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-0.972, 0, -3.239),
            new THREE.Vector3(-6.649, 0, -15.437),
            new THREE.Vector3(-7.132, 0, -17.459),
            new THREE.Vector3(-6.443, 0, -19.208),
            new THREE.Vector3(-3.026, -2, -25.257),
            new THREE.Vector3(-1.022, -2, -26.569),
            new THREE.Vector3(1.096, -2, -26.230),
            new THREE.Vector3(2.397, -2, -24.848),
            new THREE.Vector3(2.663, -2, -22.842),
            new THREE.Vector3(2.421, 0, -19.514),
            new THREE.Vector3(3.243, 0, -17.448),
            new THREE.Vector3(4.344, 0, -17.275),
            new THREE.Vector3(5.586, 0, -18.084),
            new THREE.Vector3(6.135, 0, -19.441),
            new THREE.Vector3(6.387, 0, -22.607),
            new THREE.Vector3(6.713, 0, -25.533),
            new THREE.Vector3(6.568, 0, -27.588),
            new THREE.Vector3(5.784, 0, -29.050),
            new THREE.Vector3(4.560, 0, -29.825),
            new THREE.Vector3(0.467, 0, -30.788),
            new THREE.Vector3(-2.528, -1, -30.882),
            new THREE.Vector3(-3.832, -1, -30.555),
            new THREE.Vector3(-5.451, -1, -29.452),
            new THREE.Vector3(-6.172, -1.2, -28.542),
            new THREE.Vector3(-7.711, -1.2, -26.319),
            new THREE.Vector3(-9.267, -1.2, -23.586),
            new THREE.Vector3(-10.421, -1.2, -22.294),
            new THREE.Vector3(-10.833, -1.2, -22.145),
            new THREE.Vector3(-12.220, -.5, -21.708),
            new THREE.Vector3(-16.186, -.5, -21.629),
            new THREE.Vector3(-23.363, -.5, -21.400),
            new THREE.Vector3(-25.473, 0, -20.767),
            new THREE.Vector3(-26.623, 0, -19.699),
            new THREE.Vector3(-26.954, 0, -18.080),
            new THREE.Vector3(-26.256, 0, -16.418),
            new THREE.Vector3(-24.191, 0, -15.521),
            new THREE.Vector3(-19.420, 0, -15.305),
            new THREE.Vector3(-16.583, -1, -15.159),
            new THREE.Vector3(2.586, -7, -14.648),
            new THREE.Vector3(10.059, 0, -14.838),
            new THREE.Vector3(19.202, 0, -14.541),
            new THREE.Vector3(20.946, 0, -13.679),
            new THREE.Vector3(21.754, 0, -12.538),
            new THREE.Vector3(22.090, 0, -11.146),
            new THREE.Vector3(21.548, -.5, -9.299),
            new THREE.Vector3(20.187, -.5, -7.973),
            new THREE.Vector3(18.681, -.5, -6.481),
            new THREE.Vector3(18.248, -1, -4.960),
            new THREE.Vector3(18.614, -1, -2.228),
            new THREE.Vector3(18.372, -1, -0.635),
            new THREE.Vector3(16.718, -1.5, 0.385),
            new THREE.Vector3(14.768, -1.5, -0.363),
            new THREE.Vector3(13.198, -1.5, -1.597),
            new THREE.Vector3(11.833, -1, -1.648),
            new THREE.Vector3(10.153, -1, -0.393),
            new THREE.Vector3(7.935, -.5, 1.509),
            new THREE.Vector3(6.541, -.5, 2.267),
            new THREE.Vector3(5.234, -.5, 2.646),
            new THREE.Vector3(3.968, -.5, 2.687),
            new THREE.Vector3(2.395, 0, 2.059),
            new THREE.Vector3(1.268, 0, 0.829),
            new THREE.Vector3(0.504, 0, -0.136),
            new THREE.Vector3(-0.972, 0, -3.239),

          ]);
        let segments = 1000;
        let width = 1.8;

        const texture = new THREE.TextureLoader().load("./scenes/textures/bumpText.jpg");
        texture.wrapS = THREE.RepeatWrapping;
    
        let material = new THREE.MeshBasicMaterial({ map: texture });
        material.map.repeat.set(3, 3);
        material.map.wrapS = THREE.RepeatWrapping;
        material.map.wrapT = THREE.RepeatWrapping;

        let geometry = new THREE.TubeGeometry(
            curve,
            segments,
            width,
            3 ,
            true
        );
        let mesh = new THREE.Mesh(geometry, material);
    
        this.points = curve.getPoints(segments);

        this.spacedPoints = curve.getSpacedPoints(segments);
    
        let group = new THREE.Group();
    
        group.add(mesh);
    
        group.rotateZ(Math.PI);
        group.scale.set(1, 0.2, 1);
        this.add(group);

        this.visible = false;
    }

    // The returned Y is the distance in XZ, just to optimize
    getClosestPoint(point)
    {

        
        var p = this.progress - 10;
        if (p < 0) p = 0;
        var n = this.progress + 10;

        if (n === 1008 && !this.lapCounted) {
            this.completedLaps++;
            this.lapCounted = true; 
            console.log(`Lap completed: ${this.completedLaps}`);
        }

        if (n < 1000 && this.lapCounted) {
            this.lapCounted = false;
        }

        if (n >= 1000) {
            n = 999;
        }

        var closest = new THREE.Vector3(10000, 100000, 10000);
        for (var i = p; i < n; i++)
        {
            let distance = Math.sqrt( Math.pow(-this.spacedPoints[i].x - point.x, 2) + Math.pow(this.spacedPoints[i].z - point.z, 2) );
            
            if (distance < closest.y)
            {
                closest = new THREE.Vector3(-this.spacedPoints[i].x, distance, this.spacedPoints[i].z);
                this.progress = i
            }
        }
        
        return closest;
    }
}

export { MyTrack };