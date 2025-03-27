import * as THREE from 'three'
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';


/**
 * Represents a custom scene object that extends THREE.Group.
 * This allows for grouping multiple objects under a single parent node in a scene graph.
 */
class MyObject extends THREE.Group
{
    /**
     * Constructs a new MyObject.
     * @param {string} name - The name of the object.
     * @param {string} materialId - The material ID associated with this object.
     */
    constructor(name, materialId)
    {
        super();
        this.material = materialId;
        this.name = name;
    }
}

/**
 * Object loading utility to handle hierarchical scene graphs.
 */
export const LoadObjects =
{
    objects: {},
    materials: {},

    /**
     * Loads objects and builds a hierarchical scene graph.
     * @param {Object} nodes - The scene nodes data (hierarchical structure).
     * @param {Object} materials_ - The materials data (key-value pairs of materials).
     * @returns {MyObject} - The root object of the loaded scene.
     */
    Load(nodes, materials_)
    {
        this.materials = materials_;
        let stack = [];

        let rootNode = nodes[nodes.rootid];
        let rootObject = new MyObject("scene");
        let rootTransform = this.GetTransforms(
            { translate: { x: 0, y: 0, z: 0 }, rotate: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
            rootNode
        )
        stack.push({
            node: rootNode, 
            object: rootObject,
             material: rootNode.material, 
             castShadow: rootNode.castShadows, 
             receiveShadow: rootNode.receiveShadows, 
             transform: rootTransform
            });

        while (stack.length > 0)
        {
            let {node: node, object: object, material: material, castShadow: castShadow, receiveShadow: receiveShadow, transform: transform} = stack.pop();
            let newObject = new MyObject(node.id)

            if ("materialref" in node) {
                material = this.materials[node["materialref"].materialId]
            }

            transform = this.GetTransforms(transform, node);
            newObject = this.AddTransforms(newObject, transform);

            for (let key in node.children)
            {
                let child = node.children[key];

                let childTransform = this.GetTransforms(transform, child);
                
                switch (child["type"]) {
                    case "noderef": {
                        let noderef = new MyObject(child.id);
                        noderef = this.AddTransforms(noderef, childTransform);
                        if ("materialref" in child) {
                            material = this.materials[child["materialref"].materialId];
                        } 

                        if (("nodeId" in child) && (child["nodeId"] in nodes)) {
                            stack.push({
                                node: nodes[child["nodeId"]],
                                object: noderef,
                                material: material,
                                castShadow: castShadow,
                                receiveShadow: receiveShadow,
                                transform: childTransform
                            });
                        }

                        newObject.add(noderef);
                        break;
                    }

                    case "nodesList": {
                        console.log(`Processing nodesList for node: ${node.id}, references: ${child}`);
                        for (let referencedNodeId of child) {
                            if (!nodes[referencedNodeId]) {
                                console.warn(`Node '${referencedNodeId}' referenced in 'nodesList' does not exist.`);
                                continue;
                            }

                            let referencedNode = new MyObject(referencedNodeId);
                            let referencedNodeData = nodes[referencedNodeId];
                            let childTransform = this.GetTransforms(transform, referencedNodeData);

                            referencedNode = this.AddTransforms(referencedNode, childTransform);

                            stack.push({
                                node: referencedNodeData,
                                object: referencedNode,
                                material: material,
                                castShadow: castShadow,
                                receiveShadow: receiveShadow,
                                transform: childTransform
                            });

                            console.log(`Node '${referencedNodeId}' exists and will be added.`);
                            newObject.add(referencedNode);
                        }
                        break;
                    }

                    case "node": {
                        let node = new MyObject(child.id);
                        node = this.AddTransforms(node, childTransform);
                        if ("materialref" in child) {
                            material = this.materials[child["materialref"].materialId];
                        }

                        stack.push({
                            node: child,
                            object: node,
                            material: material,
                            castShadow: castShadow,
                            receiveShadow: receiveShadow,
                            transform: childTransform
                        });

                        newObject.add(node);
                        break;
                    }

                    case "pointlight":
                    case "spotlight":
                    case "directionallight": {
                        let light = this.GetLight(child);
                        light = this.AddTransforms(light, childTransform);
                        newObject.add(light);
                        console.log(`Light '${child["type"]}' added to the scene.`);
                        break;
                    }

                    case "rectangle":
                    case "triangle":
                    case "box":
                    case "cylinder":
                    case "sphere":
                    case "nurbs":
                    case "polygon": {
                        if ("materialref" in child) material = this.materials[child["materialref"].materialId];

                        let primitive = this.GetPrimitive(child, material, castShadow, receiveShadow);
                        primitive = this.AddTransforms(primitive, childTransform);
                        newObject.add(primitive);
                        break;
                    }

                    case "obj":
                        if ("materialref" in child) material = this.materials[child["materialref"].materialId];

                        let objLoader = new OBJLoader()
                        const mtlLoader = new MTLLoader();
                        mtlLoader.setMaterialOptions({side: THREE.DoubleSide, invertTrProperty: true});

                        mtlLoader.load('./' + child.obj + '.mtl', (mtl) => {
                            objLoader.setMaterials(mtl);
    
                            objLoader.load('./' + child.obj + '.obj', (obj) => {

                                obj.traverse( function( object )
                                {
                                    if ( object.isMesh && object.material.map )
                                    {
                                        object.material.map.minFilter = THREE.NearestFilter;
                                        object.material.map.magFilter = THREE.NearestFilter;
                                        object.receiveShadow = true;
                                    }
                                } );

                                obj.receiveShadow = true;
                                newObject.receiveShadow = true;
                                obj.name = obj.subtype + "_obj";

                                obj = this.AddTransforms(obj, childTransform);
                                newObject.add(obj);
                            });
                        })
                        break;

                    default:
                        console.warn(`Unknown child type: ${child["type"]}`);
                        break;
                }

            }

            object.add(newObject)

        }

        return rootObject;
    },

        /**
     * Applies transformations to a THREE.Object3D instance.
     * @param {THREE.Object3D} object - The object to transform.
     * @param {Object} add - The transformation parameters.
     * @returns {THREE.Object3D} - The transformed object.
     */
    AddTransforms(object, add)
    {
        object.position.x += add.translate.x;
        object.position.y += add.translate.y;
        object.position.z += add.translate.z;

        object.rotation.x = add.rotate.x * Math.PI / 180;
        object.rotation.y = add.rotate.y * Math.PI / 180;
        object.rotation.z = add.rotate.z * Math.PI / 180;

        object.scale.x *= add.scale.x;
        object.scale.y *= add.scale.y;
        object.scale.z *= add.scale.z;

        return object
    },

        /**
     * Calculates the cumulative transformation for a child node based on its parent's transformations.
     * @param {Object} parentTransforms - Transformations of the parent object.
     * @param {Object} child - The child node with its transformation data.
     * @returns {Object} - Combined transformation parameters.
     */
    GetTransforms(parentTransforms, child)
    {
        let ret = {"translate": {x: 0, y: 0, z: 0}, "rotate": {x: 0, y: 0, z: 0}, "scale": {x: 1, y: 1, z: 1}}
        if ("transforms" in child)
        {
            for (let t in child.transforms) {
                let transform = child.transforms[t];
            
                switch (transform.type) {
                    case "translate":
                        ret.translate.x += transform.amount.x;
                        ret.translate.y += transform.amount.y;
                        ret.translate.z += transform.amount.z;
                        break;
            
                    case "rotate":
                        ret.rotate.x += transform.amount.x;
                        ret.rotate.y += transform.amount.y;
                        ret.rotate.z += transform.amount.z;
                        break;
            
                    case "scale":
                        ret.scale.x *= transform.amount.x;
                        ret.scale.y *= transform.amount.y;
                        ret.scale.z *= transform.amount.z;
                        break;
            
                    default:
                        console.warn(`Unknown transform type: ${transform.type}`);
                        break;
                }
            }
            
        }
        return ret;
    },

    /**
     * Creates a primitive object based on the node data.
     * @param {*} node  - The node data.
     * @param {*} material  - The material to apply to the primitive.
     * @param {*} castShadow  - Whether the primitive should cast shadows.
     * @param {*} receiveShadow  - Whether the primitive should receive shadows.
     * @returns  {THREE.Mesh} - The primitive object.
     */
    GetPrimitive(node, material, castShadow=false, receiveShadow=false)
    {
        let primitive;
        
        if (material == null)
        {
            material = new THREE.MeshPhongMaterial(
            {
                color: 0xFFFFFF,
                flatShading: false,
            });
        }

    
        switch (node["type"])
        {
            case 'rectangle':
                console.log(`Creating rectangle with xy1: ${JSON.stringify(node.xy1)} and xy2: ${JSON.stringify(node.xy2)}`);
                primitive = this.GetRectangle(node, material);
                break;
            case 'box':
                primitive = this.GetBox(node, material);
                break;
            case 'triangle':
                primitive = this.GetTriangle(node, material);
                break;
            case 'cylinder':
                primitive = this.GetCylinder(node, material);      
                break;
            case 'sphere':
                primitive = this.GetSphere(node, material); 
                break;
            default:
                return;
        }
    
        primitive.castShadow = castShadow;
        primitive.receiveShadow = receiveShadow;
        primitive.name = primitive.subtype + "_obj";
        return primitive;
    },

    /**
     * Creates a rectangle object based on the node data.
     * @param {*} node  - The node data.
     * @param {*} material  - The material to apply to the rectangle.
     * @returns  {THREE.Mesh} - The rectangle object.
     */
    GetRectangle(node, material)
    {
        let width =  Math.abs(node.xy2.x - node.xy1.x);
        let height = Math.abs(node.xy2.y - node.xy1.y);

        if (!("parts_x" in node)){
             node.parts_x = 1;
        }

        if (!("parts_y" in node)){
             node.parts_y = 1;
        }
    
        let geometry = new THREE.PlaneGeometry(width, height, node.parts_x, node.parts_y);
    
        let rectangle = new THREE.Mesh(geometry, material);
        rectangle.position.x = (node.xy2.x + node.xy1.x)/2;
        rectangle.position.y = (node.xy2.y + node.xy1.y)/2;
    
        return rectangle;
    },

    /**
     * Creates a box object based on the node data.
     * @param {*} node  - The node data.
     * @param {*} material  - The material to apply to the box.
     * @returns {THREE.Mesh} - The box object.
     */
    GetBox(node, material)
    {
        let width = Math.abs(node.xyz2.x - node.xyz1.x);
        let height = Math.abs(node.xyz2.y - node.xyz1.y);
        let depth = Math.abs(node.xyz2.z - node.xyz1.z);

        if (!("parts_x" in node)){
                node.parts_x = 1;
        } 
        if (!("parts_y" in node)){
                node.parts_y = 1;
        }
        if (!("parts_z" in node)){
                node.parts_z = 1;
        } 
    
        let geometry = new THREE.BoxGeometry(width, height, depth, node.parts_x, node.parts_y, node.parts_z);
    
        let box = new THREE.Mesh(geometry, material);
        box.position.x = (node.xyz2.x + node.xyz1.x)/2;
        box.position.y = (node.xyz2.y + node.xyz1.y)/2;
        box.position.z = (node.xyz2.z + node.xyz1.z)/2;
    
        return box;
    },

    /**
     * Creates a triangle object based on the node data.
     * @param {*} node  - The node data.
     * @param {*} material  - The material to apply to the triangle.
     * @returns  {THREE.Mesh} - The triangle object.
     */
    GetTriangle(node, material)
    {
        let v1 = new THREE.Vector3(... node.xyz1);
        let v2 = new THREE.Vector3(... node.xyz2);
        let v3 = new THREE.Vector3(... node.xyz3);
        
        let geometry = new THREE.Geometry();
        let threetriangle = new THREE.Triangle( v1, v2, v3 );
        let normal = threetriangle.normal();

        geometry.vertices.push(threetriangle.a);
        geometry.vertices.push(threetriangle.b);
        geometry.vertices.push(threetriangle.c);

        geometry.faces.push( new THREE.Face3( 0, 1, 2, normal ) );

        const triangle = new THREE.Mesh(geometry, material);
        
        return triangle;
    },

    /**
     * Creates a cylinder object based on the node data.
     * @param {*} node - The node data.
     * @param {*} material  - The material to apply to the cylinder.
     * @returns  {THREE.Mesh} - The cylinder object.
     */
    GetCylinder(node, material)
    {
        let capsclose = (("capsclose") in node) ? node.capsclose : false;
        let thetastart = (("thetastart") in node) ? (node.thetastart * Math.PI / 180) : 0;
        let thetalength = (("thetalength") in node) ? (node.thetalength * Math.PI / 180) : (2 * Math.PI);

        const geometry = new THREE.CylinderGeometry(node.top, node.base, node.height, node.slices, node.stacks, !capsclose, thetastart, thetalength);
          
        const cylinder = new THREE.Mesh(geometry, material);
        return cylinder;
    },

    /**
     * Creates a sphere object based on the node data.
     * @param {*} node - The node data.
     * @param {*} material - The material to apply to the sphere.
     * @returns {THREE.Mesh} - The sphere object.
     */
    GetSphere(node, material)
    {
        let thetastart = (("thetastart") in node) ? node.thetastart * Math.PI / 180 : 0;
        let thetalength = (("thetalength") in node) ? node.thetalength * Math.PI / 180 : 2 * Math.PI;
        let phistart = (("phistart") in node) ? node.phistart * Math.PI / 180 : 0;
        let philength = (("philength") in node) ? node.philength * Math.PI / 180 : Math.PI;

        const geometry = new THREE.SphereGeometry(node.radius, node.slices, node.stacks, phistart, philength, thetastart, thetalength);
          
        const cylinder = new THREE.Mesh(geometry, material);
        return cylinder; 
    },

    /**
     * Creates a light object based on the node data.
     * @param {*} node - The node data.
     * @returns {MyObject} - The light object.
     */
    GetLight(node)
    {
        let lightParent = new MyObject();
        let light;

        switch (node["type"])
        {
            case 'pointlight':
                light = new THREE.PointLight();
                light.distance = node.distance ?? 1000;
                light.decay = node.decay ?? 2;
                break;
            case 'spotlight':
                light = new THREE.SpotLight();
                light.distance = node.distance ?? 1000;
                light.angle = node.angle ? THREE.MathUtils.degToRad(node.angle) : Math.PI / 3;
                light.decay = node.decay ?? 2;
                light.penumbra = node.penumbra ?? 1;

                let target = new THREE.Object3D();
                if (node.target) {
                    target.position.set(
                        node.target.x ?? 0, 
                        node.target.y ?? 0,
                        node.target.z ?? 0
                    );
                } else {
                    console.warn(`Spotlight target not defined for node '${node.id}', defaulting to (0, 0, 0).`);
                }
                light.target = target;
                lightParent.add(target);
                break;
            case 'directionallight':
                light = new THREE.DirectionalLight();
                break;
            default:
                break;
        }
        
        light.visible = node.enabled ?? true;
        light.color = node.color;
        light.intensity = node.intensity ?? 1;
        light.position.x = node.position.x;
        light.position.y = node.position.y;
        light.position.z = node.position.z;
        light.castShadow = true
        light.shadow.mapSize.width = 2048
        light.shadow.mapSize.height = 2048
        light.shadow.camera.near = 0.5
        light.shadow.camera.far = 10000
        light.name = "LIGHT";
        light.shadowCameraNear = 1;
        light.shadowCameraFar = 10000;
        light.shadow.camera.top = 50;
        light.shadow.camera.bottom = -50;
        light.shadow.camera.left = 50;
        light.shadow.camera.right = -50;

        lightParent.add(light);
        return lightParent;
    }
}