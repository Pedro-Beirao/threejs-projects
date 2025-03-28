/**
 *  Contains the content of a loaded scene
 *  Credits: Alexandre Valle (alexandre.valle@fe.up.pt)
 *  Version: 2023-10-13
 * 
 *  DO NOT CHANGE THIS FILE. IT WILL BE MODIFIED OR REPLACED DURING EVALUATION
 * 
 *  USAGE: you can read the contents of the file and use it to create the scene objects 
 *  in MyContents.js or in other classes called from MyContents.js
 */

/**
 * This class contains the scene data object
 */
class MySceneData  {

    constructor() {
      this.options = null;
      this.fog = null;

      this.materials = []
      this.lights = [];
      this.textures = [];
      
      this.cameras = [];
      this.activeCameraId = null;
      
      this.nodes = [];
      this.rootId = null;
  
      this.descriptors = [];

      this.customAttributeName = "custom"

      this.descriptors["globals"] = [
        {name: "background", type: "rgba" },
        {name: "ambient", type: "rgba"},
      ]
  
      this.descriptors["fog"] = [
        {name: "color", type: "rgba" },
        {name: "near", type: "float"},
        {name: "far", type: "float"},
      ]

      this.descriptors["texture"] = [
        {name: "id", type: "string" },
        {name: "filepath", type: "string"},
        {name: "isVideo", type: "boolean", required: false, default: false}, // a nice way to see if the texture is a video or not            
        {name: "magFilter", type: "string", required: false, default: "LinearFilter"}, // to be used in later classes
        {name: "minFilter", type: "string", required: false, default: "LinearMipmapLinearFilter"}, // to be used in later classes
        {name: "mipmaps", type: "boolean", required: false, default: true}, // by default threejs generates mipmaps for you
        {name: "anisotropy", type: "integer", required: false, default: 1}, // default is 1. A higher value gives a less blurry result than a basic mipmap, at the cost of more texture samples being used
        {name: "mipmap0", type: "string", required: false, default: ""},
        {name: "mipmap1", type: "string", required: false, default: ""},
        {name: "mipmap2", type: "string", required: false, default: ""},
        {name: "mipmap3", type: "string", required: false, default: ""},
      ]
        

      this.descriptors["material"] = [
        {name: "id", type: "string"},
        {name: "color", type: "rgba"},
        {name: "specular", type: "rgba"},
        {name: "emissive", type: "rgba"},
        {name: "shininess", type: "float"},
        {name: "wireframe", type: "boolean", required: false, default: false},
        {name: "shading", type: "item", required: false, choices: ["none","flat","smooth"], default: "smooth"},
        {name: "textureref", type: "string", required: false, default: null}, // The color map. May optionally include an alpha channel. The texture map color is modulated by the diffuse color. Default null.
        {name: "texlength_s", type: "float", required: false, default: 1.0},
        {name: "texlength_t", type: "float", required: false, default: 1.0},
        {name: "twosided", type: "boolean", required: false, default: false},
        {name: "bumpref", type: "string", required: false, default: null}, // bump map is to be used in later classes
        {name: "bumpscale", type: "float", required: false, default: 1.0},
        {name: "specularref", type: "string", required: false, default: null}, // bump map is to be used in later classes
        {name: "specularscale", type: "float", required: false, default: 1.0},
      ]

    this.descriptors["orthogonal"] = [
      {name: "id", type: "string"},
      {name: "type", type: "string"},
      {name: "near", type: "float"},
      {name: "far", type: "float"},
      {name: "location", type: "vector3"},
      {name: "target", type: "vector3"},
      {name: "left", type: "float"},
      {name: "right", type: "float"},
      {name: "bottom", type: "float"},
      {name: "top", type: "float"},
    ]

    this.descriptors["perspective"] = [
      {name: "id", type: "string"},
      {name: "type", type: "string"},
      {name: "angle", type: "float"},
      {name: "near", type: "float"},
      {name: "far", type: "float"},
      {name: "location", type: "vector3"},
      {name: "target", type: "vector3"}
    ]
    
    this.descriptors["cylinder"] = [
      {name: "type", type: "string"},
      {name: "base", type: "float"},
      {name: "top", type: "float"},
      {name: "height", type: "float"},
      {name: "slices", type: "integer"},
      {name: "stacks", type: "integer"},
      {name: "capsclose", type: "boolean", required: false, default: false},
      {name: "thetaStart", type: "float", required: false, default: 0.0},
      {name: "thetaLength", type: "float", required: false, default: 2 * Math.PI},
      {name: "distance", type: "float", required: false, default: 0.0}, // The distance at which to display this level of detail. Default 0.0.  
    ]

        /*
            In the following primitives, distance is to be used with LODs (later classes)
        */
		this.descriptors["rectangle"] = [
      {name: "type", type: "string"},
			{name: "xy1", type: "vector2"},
			{name: "xy2", type: "vector2"},
      {name: "parts_x", type: "integer", required: false, default: 1},
			{name: "parts_y", type: "integer", required: false, default: 1},
      {name: "distance", type: "float", required: false, default: 0.0}, // The distance at which to display this level of detail. Default 0.0.  
		]

		this.descriptors["triangle"] = [
      {name: "type", type: "string"},
			{name: "xyz1", type: "vector3"},
			{name: "xyz2", type: "vector3"},
			{name: "xyz3", type: "vector3"},
      {name: "distance", type: "float", required: false, default: 0.0}, // The distance at which to display this level of detail. Default 0.0.  
		]

        // to be used in final classes of TP2 or in TP3
    this.descriptors["model3d"] = [
      {name: "type", type: "string"},
			{name: "filepath", type: "string"},
      {name: "distance", type: "float", required: false, default: 0.0}, // The distance at which to display this level of detail. Default 0.0.  
		]

		this.descriptors["sphere"] = [
      {name: "type", type: "string"},
			{name: "radius", type: "float"},
			{name: "slices", type: "integer"},
			{name: "stacks", type: "integer"},
      {name: "thetastart", type: "float", required: false, default: 0.0},
      {name: "thetalength", type: "float", required: false, default: 2 * Math.PI},
      {name: "phistart", type: "float", required: false, default: 0.0},
      {name: "philength", type: "float", required: false, default: 2 * Math.PI},
      {name: "distance", type: "float", required: false, default: 0.0}, // The distance at which to display this level of detail. Default 0.0.  
		]

    this.descriptors["box"] = [
      {name: "type", type: "string"},
			{name: "xyz1", type: "vector3"},
			{name: "xyz2", type: "vector3"},
			{name: "parts_x", type: "integer", required: false, default: 1},
			{name: "parts_y", type: "integer", required: false, default: 1},
      {name: "parts_z", type: "integer", required: false, default: 1},
      {name: "distance", type: "float", required: false, default: 0.0}, // The distance at which to display this level of detail. Default 0.0.  
    ]
        

    this.descriptors["nurbs"] = [
      {name: "type", type: "string"},
			{name: "degree_u", type: "integer"},
			{name: "degree_v", type: "integer"},
      {name: "parts_u", type: "integer"},
      {name: "parts_v", type: "integer"},
      {name: "distance", type: "float", required: false, default: 0.0}, // The distance at which to display this level of detail. Default 0.0.  
      {name: "controlpoints", type: "list", listOf: "controlpoint"},
		]

    this.descriptors["controlpoint"] = [
      {name: "position", type: "vector3"}
		]

    this.descriptors["skybox"] = [
      {name: "type", type: "string"},
      {name: "width", type: "float" },
			{name: "height", type: "float" },
			{name: "depth", type: "float" },
			{name: "texture_up_ref", type: "string"}, // up
			{name: "texture_dn_ref", type: "string"}, // down
			{name: "texture_bk_ref", type: "string"}, // back
      {name: "texture_lt_ref", type: "string"}, // left
			{name: "texture_ft_ref", type: "string"}, // front
			{name: "texture_rt_ref", type: "string"}, // right
    ]

    this.descriptors["polygon"] = [
      {name: "type", type: "string"},
      {name: "radius", type: "float"},
      {name: "stacks", type: "integer"},
      {name: "slices", type: "integer"},
      {name: "color_c", type: "rgba"},
      {name: "color_p", type: "rgba"},
    ]

		this.descriptors["spotlight"] = [
      {name: "type", type: "string"},
			{name: "id", type: "string" },
			{name: "color", type: "rgba"},
			{name: "position", type: "vector3"}, 	
			{name: "target", type: "vector3"}, 		
			{name: "angle", type: "float"},
      {name: "enabled", type: "boolean", required: false, default: true},
			{name: "intensity", type: "float", required: false, default: 1.0},
			{name: "distance", type: "float", required: false, default: 1000},
			{name: "decay", type: "float", required: false, default: 2.0},
			{name: "penumbra", type: "float", required: false, default: 1.0},
			{name: "castshadow", type: "boolean", required: false, default: false},
      {name: "shadowfar", type: "float", required: false, default: 500.0},
      {name: "shadowmapsize", type: "integer", required: false, default: 512},
		]

		this.descriptors["pointlight"] = [
      {name: "type", type: "string"},
			{name: "id", type: "string" },
			{name: "color", type: "rgba"},
			{name: "position", type: "vector3"}, 
      {name: "enabled", type: "boolean", required: false, default: true},
			{name: "intensity", type: "float", required: false, default: 1.0},
			{name: "distance", type: "float", required: false, default: 1000},
			{name: "decay", type: "float", required: false, default: 2.0},
			{name: "castshadow", type: "boolean", required: false, default: false},
      {name: "shadowfar", type: "float", required: false, default: 500.0},
      {name: "shadowmapsize", type: "integer", required: false, default: 512},		
		]

		this.descriptors["directionallight"] = [
      {name: "type", type: "string"},
			{name: "id", type: "string" },
			{name: "color", type: "rgba"},
			{name: "position", type: "vector3"},
      {name: "enabled", type: "boolean", required: false, default: true},
			{name: "intensity", type: "float", required: false, default: 1.0},
			{name: "castshadow", type: "boolean", required: false, default: false},
      {name: "shadowleft", type: "float", required: false, default: -5.0},
      {name: "shadowright", type: "float", required: false, default: 5.0}, 
      {name: "shadowbottom", type: "float", required: false, default: -5.0},
      {name: "shadowtop", type: "float", required: false, default: 5.0}, 
      {name: "shadowfar", type: "float", required: false, default: 500.0},
      {name: "shadowmapsize", type: "integer", required: false, default: 512},
		]

      this.primaryNodeIds = ["globals", "fog" ,"textures", "materials", "cameras", "graph"]

      this.primitiveIds = ["cylinder", "rectangle", "triangle", "sphere", "nurbs" , "box", "model3d", "skybox", "polygon" ]

      this.lightIds = ["spotlight", "pointlight", "directionallight"]
    }

    createCustomAttributeIfNotExists(obj) {
        if (obj[this.customAttributeName] === undefined || obj[this.customAttributeName] === null) obj[this.customAttributeName] = {}
    }

    setOptions(options) {
        this.options = options;
        this.createCustomAttributeIfNotExists(options)
        console.debug("added options " + JSON.stringify(options));
    }

    getOptions() {
        return this.options;
    }

    setFog(fog) {
        this.fog = fog;
        this.createCustomAttributeIfNotExists(fog)
        console.debug("added fog " + JSON.stringify(fog));
    }

    getFog() {
        return this.fog;
    }
    setRootId(rootId) {
        console.debug("set graph root id to '" + rootId + "'");
        this.rootId = rootId;
    }

    getMaterial(id) {
        let value = this.materials[id]
        if (value === undefined) return null
        return value
    }

    addMaterial(material) {
        let obj = this.getMaterial(material.id); 
        if (obj !== null && obj !== undefined) {
            throw new Error("inconsistency: a material with id " + material.id + " already exists!");		
        }
        this.materials[material.id] = material;
        this.createCustomAttributeIfNotExists(material)
        console.debug("added material " + JSON.stringify(material));
    };

    addTexture(texture) {
        let obj = this.getTexture(texture.id); 
        if (obj !== null && obj !== undefined) {
            throw new Error("inconsistency: a texture with id " + texture.id + " already exists!");		
        }
        this.textures[texture.id] = texture;
        this.createCustomAttributeIfNotExists(texture)
        console.debug("added texture" + JSON.stringify(texture))
    };

    getTexture(id) {
        let value = this.textures[id]
        if (value === undefined) return null
        return value
    };

    setActiveCameraId(id) {
        console.debug("set active camera id to '" + id + "'");
        return this.activeCameraId = id;
    }

    getCamera(id) {
        let value = this.cameras[id]
        if (value === undefined) return null
        return value
    };

    setActiveCamera(id) {
        this.activeCameraId = id;
    }

    addCamera(camera) {
        if (camera.type !== "orthogonal" && camera.type !== "perspective") {
            throw new Error("inconsistency: unsupported camera type " + camera.type + "!");
        }

        let obj = this.getCamera(camera.id);
        if (obj !== null && obj !== undefined) {
            throw new Error("inconsistency: a camera with id " + camera.id + " already exists!");
        }
        this.cameras[camera.id] = camera
        this.createCustomAttributeIfNotExists(camera)
        console.debug("added camera " + JSON.stringify(camera))
    }

    getLight(id) {	
        let value = this.lights[id]
        if (value === undefined) return null
        return value
    }

    addLight(light) {
        var obj = this.getLight(light.id);
        if (obj !== null && obj !== undefined) {
            throw new Error("inconsistency: a light with id " + light.id + " already exists!");		
        }
        this.lights[light.id] = light;
        this.createCustomAttributeIfNotExists(light)
        console.debug("added light " + JSON.stringify(light));
    }

    getNode(id) {	
        let value = this.nodes[id];
        if (value === undefined) return null
        return value
    }

    createEmptyNode(id) {
        let obj = this.getNode(id) 
        if (obj !== null && obj !== undefined) {
            throw new Error("inconsistency: a node with id " + id + " already exists!");		
        }

		obj = {id: id, transformations: [], materialIds : [], children: [], loaded: false, type:"node"};
        this.addNode(obj);
        return obj;
	}


    addNode(node) {
        let obj = this.getNode(node.id) 
        if (obj !== null && obj !== undefined) {
            throw new Error("inconsistency: a node with id " + node.id + " already exists!");		
        }
        this.nodes[node.id] = node;
        this.createCustomAttributeIfNotExists(node)
        console.debug("added node " + JSON.stringify(node));
    };

    addChildToNode(node, child) {

        if (child === undefined) {
            throw new Error("inconsistency: undefined child add to node!");		
        }

        if (node.children === undefined) {
            throw new Error("inconsistency: a node has an undefined array of children!");		
        }
        node.children.push(child)
        this.createCustomAttributeIfNotExists(child)
        console.debug("added node child" + JSON.stringify(child));
    }

    createEmptyPrimitive() {
      let obj = { type : "primitive", subtype: null, representations: [], loaded : false}
      return obj
    }		

    onLoadFinished(app, contents) {
        console.info("------------------ consolidating data structures ------------------");
        
        console.debug("consolidating materials...");
        // TODO: check material refs and replace with material objects
        
        console.debug("consolidating scene graph root...");
        // TODO: check root not null and root exists
        
        console.debug("consolidating camera...");
        // TODO: check active camera not null and exists
        
        // TODO: continue consolidation checks
    }
}
export { MySceneData };

