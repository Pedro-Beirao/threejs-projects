import * as THREE from 'three'

class My3DText extends THREE.Group {
    constructor(app) {
        super();
        this.app = app;

        const loader = new THREE.TextureLoader();
        this.texture = loader.load( './objs/spritesheet.png' );
        this.texture.magFilter = THREE.NearestFilter;
        this.texture.minFilter = THREE.NearestFilter;
        this.texture.wrapS = THREE.RepeatWrapping;
        this.texture.wrapT = THREE.RepeatWrapping;
        
        this.chars = []
        this.createChars()
    }

    createChars()
    {
        const geom = new THREE.PlaneGeometry(1, 1);

        for (var i = 0; i < 16; i++)
        {
            for (var j = 0; j < 16; j++)
            {
                var t = this.texture.clone();
                t.offset.set(j/16, 1 - (i + 1)/16);
                t.repeat.set(1/16, 1/16);

                const m = new THREE.MeshBasicMaterial({ map: t, transparent:true, side: THREE.DoubleSide});

                const char = new THREE.Mesh(geom, m);

                this.chars.push(char);
            }
        }


    }

    createText(text, spacing = 1)
    {
        const parent = new THREE.Group()
        
        for (var c in text)
        {
            const charCode = text[c].charCodeAt(0)
            const obj = this.chars[charCode].clone();

            obj.position.x = c * spacing;
            parent.add(obj)
        }

        return parent;
    }
}

export { My3DText };
