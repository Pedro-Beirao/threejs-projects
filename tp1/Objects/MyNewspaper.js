import * as THREE from 'three';
import { MyNurbsBuilder} from "../utils/MyNurbsBuilder.js"

/**
 * This class contains a 3D representation of a newspaper object using NURBS surfaces and curves
 */
class MyNewspaper extends THREE.Object3D
{
    /**
     * Constructor for the MyNewspaper class
     * @param {*} app - the application object
     */
    constructor(app)
    {
        super();
        this.texture = new THREE.TextureLoader().load('Textures/newspaper.jpg');

        // control points for the NURBS surface
        let controlPoints =
            [
                [
                    [ -1.5, -2, 0.0, 1 ],
                    [ -1.5,  2, 0.0, 1 ]
                ],
                [
                    [ 0, -2, 2.0, 1 ],
                    [ 0,  2, 2.0, 1 ]
                ],
                [
                    [ 1.5, -2, 0.0, 1 ],
                    [ 1.5,  2, 0.0, 1 ]
                ]
            ];

        this.nurbsBuilder = new MyNurbsBuilder();

        // Material
        this.material = new THREE.MeshPhongMaterial({
            color: 0xFFFFFF,
            side: THREE.DoubleSide,
            map: this.texture,
        });

        // NURBS surface
        let surfaceData = this.nurbsBuilder.build(
            controlPoints,
            2,
            1,
            10,
            10,
            this.material
        );

        let mesh = new THREE.Mesh(surfaceData, this.material);
        mesh.rotation.set(0, 0, 0);
        mesh.scale.set(1, 1, 1);
        mesh.position.set(0, 0, 0);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.add(mesh);

        mesh = new THREE.Mesh(surfaceData, this.material);
        mesh.rotation.set(0, 0, 0);
        mesh.scale.set(1, 1, 1);
        mesh.position.set(3, 0, 0);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.add(mesh);
    }
}

export { MyNewspaper };