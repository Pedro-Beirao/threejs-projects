import * as THREE from 'three';
import { MyNurbsBuilder } from '../utils/MyNurbsBuilder.js';

/**
 * This class contains a 3D representation of a flower object using NURBS surfaces and curves
 */
class MyFlower extends THREE.Object3D {

    /**
     * Constructor for the MyFlower class
     */
    constructor() {
        super();

        // NURBS builder
        this.builder = new MyNurbsBuilder()

        // Materials
        this.petalMaterial = new THREE.MeshPhongMaterial({ color: 0x8a0e52, side: THREE.DoubleSide});
        this.stemMaterial = new THREE.MeshPhongMaterial({ color: 0x44752f, side: THREE.DoubleSide });
        this.polMaterial = new THREE.MeshPhongMaterial({ color: 0xc9a32e, side: THREE.DoubleSide, specular: 0xFFFFFF });
        this.petalMaterialSmall = new THREE.MeshPhongMaterial({ color: 0xf7c6cb, side: THREE.DoubleSide });
        this.polMaterialSmall = new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide, specular: 0xFFFFFF });

        const map = new THREE.TextureLoader().load( 'Textures/soil.jpg' );
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        this.soilMaterial = new THREE.MeshPhongMaterial({ map: map, color: 0x422828, specular: 0xFFFFFF });

        // NURBS surface parameters
        this.orderU = 2
        this.orderV = 2
        this.samplesU = 20;
        this.samplesV = 20;

        // soil base of the flowers
        const baseCylinder = new THREE.CylinderGeometry(0.145, 0.145, 0, 32);
        const baseMesh = new THREE.Mesh(baseCylinder, this.soilMaterial);
        baseMesh.position.set(0, 0.5, 0.05);
        baseMesh.receiveShadow = true;
        this.add(baseMesh);

        this.createBigFlower();
        this.createSmallerFlower();

        }

    /**
     * Creates a smaller flower object using NURBS surfaces and curves and adds it to the scene
     */
    createSmallerFlower(){
      
      // stem
      const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(0.4, 1.5, 0), new THREE.Vector3(0.4, 1, 0), 
                                                    new THREE.Vector3(0, 0, 0));

      const geometry = new THREE.TubeGeometry(curve, 64, 0.03);

      let stem = new THREE.Mesh(geometry, this.stemMaterial);
      stem.scale.set(0.5, 0.5, 0.5);
      stem.position.set(-0.15, 0.09, 0.05);
      stem.castShadow = true;
      stem.receiveShadow = true;
      this.add(stem);

      // polen
      const pol = new THREE.CylinderGeometry(0.03, 0.03, 0.01, 32);
      const polmesh = new THREE.Mesh(pol, this.polMaterialSmall);
      polmesh.position.set(0.05, 0.855, 0.05);
      polmesh.receiveShadow = true;
      this.add(polmesh);

      // petals
      const points = [
          // U = 0
          [
            [0, 1, -2.0, 1],
            [-0.8, 1, -2.0, 1],
            [-0.8, 0.0, 0.0, 1],
          ],
          [
            [0, 1, -2.0, 1],
            [-0.0, 1, -2.0, 1],
            [-0.0, 1, 0.0, 1],
          ],
          // U = 1
          [
            [0, 1, -2.0, 1],
            [0.8, 1, -2.0, 1],
            [0.8, 0.0, 0.0, 1],
          ],
      ];

      const petalGeometry = this.builder.build(points, this.orderU, this.orderV, this.samplesU, this.samplesV, this.petalMaterialSmall);

      for (let i = 0; i < 8; i++) {
          const petalMesh = new THREE.Mesh(petalGeometry, this.petalMaterialSmall);
          petalMesh.scale.set(0.05, 0.05, 0.05);
          petalMesh.position.set(0.05, 0.826, 0.05);
          petalMesh.rotation.y = (i * Math.PI) / 4;
          petalMesh.castShadow = true;
          petalMesh.receiveShadow = true;
          this.add(petalMesh);
    }
  }

  /**
   * Creates a big flower object using NURBS surfaces and curves and adds it to the scene
   */
  createBigFlower(){
    // stem
    const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(-0.5, -2.0, 0), new THREE.Vector3(-0.5, -0.35, 0),
                                                  new THREE.Vector3(0.0, 0, 0));

    const geometry = new THREE.TubeGeometry(curve, 64, 0.04);

    let stem = new THREE.Mesh(geometry, this.stemMaterial);
    stem.scale.set(0.5, 0.5, 0.5);
    stem.position.set(0.3, 1, 0);
    stem.castShadow = true;
    stem.receiveShadow = true;
    this.add(stem);

    // polen
    const pol = new THREE.CylinderGeometry(0.05, 0.05, 0.01, 32);
    const polmesh = new THREE.Mesh(pol, this.polMaterial);
    polmesh.position.set(0.3, 1.011, 0);
    polmesh.receiveShadow = true;
    this.add(polmesh);

    // petals
    const points = [
          // U = 0
          [
            [-0.0, 1.5, -4.0, 1],
            [-1, 0.2, -4.0, 1],
            [-1.0, 0.0, 0.0, 1],
          ],
          [
            [-0.0, 1.5, -4.0, 1],
            [-0.0, 1.5, -4.0, 1],
            [-0.0, 0.2, 0.0, 1],
          ],
          // U = 1
          [
            [0.0, 1.5, -4.0, 1],
            [1, 0.2, -4.0, 1],
            [1.0, 0.0, 0.0, 1],
          ],
    ];

    const petalGeometry = this.builder.build(points, this.orderU, this.orderV, this.samplesU, this.samplesV, this.petalMaterial);

    for (let i = 0; i < 8; i++) {
        const petalMesh = new THREE.Mesh(petalGeometry, this.petalMaterial);
        petalMesh.scale.set(0.05, 0.05, 0.05);
        petalMesh.position.set(0.3, 0.986, -0.005);
        petalMesh.rotation.y = (i * Math.PI) / 4;
        petalMesh.rotation.x = -Math.PI / 12;
        petalMesh.castShadow = true;
        petalMesh.receiveShadow = true;
        this.add(petalMesh);
    }
  }
}

export { MyFlower };
