
const Scene = {
    intro: {i: 0},
    underwater_rocks: {i: 1},
    desert_plateus: {i: 2},
    forest_blue_sky: {i: 3},
    fairy_tale_stick_villiage: {i: 4},
    fairy_tale_blue_swamp: {i: 5},
}
const Scene_values = [Scene.intro, Scene.underwater_rocks, Scene.desert_plateus, Scene.forest_blue_sky, Scene.fairy_tale_stick_villiage, Scene.fairy_tale_blue_swamp]
Scene.values = function() { return Scene_values }

const sceneToDrawables = [
    [
        "intro_1",
        "intro_2",
        "intro_3",
        "intro_4",
        "intro_5",
        "intro_6",
        "intro_7", 
    ],
    [
        "underwater_rocks_1",
        "underwater_rocks_2",
        "underwater_rocks_3",
        "underwater_rocks_4",
        "underwater_rocks_5",
        "underwater_rocks_6", 
    ],
    [
        "desert_plateus_1",
        "desert_plateus_2",
        "desert_plateus_3",
        "desert_plateus_4",
        "desert_plateus_5",
    ],
    [
        "forest_blue_sky_1",
        "forest_blue_sky_2",
        "forest_blue_sky_3",
        "forest_blue_sky_4",
        "forest_blue_sky_5", 
    ],
    [
        "fairy_tale_stick_village_1",
        "fairy_tale_stick_village_2",
        "fairy_tale_stick_village_3",
        "fairy_tale_stick_village_4",
        "fairy_tale_stick_village_5",
        "fairy_tale_stick_village_6",
    ],
    [
        "fairy_tale_blue_swamp_1",
        "fairy_tale_blue_swamp_2",
        "fairy_tale_blue_swamp_3",
        "fairy_tale_blue_swamp_4",
        "fairy_tale_blue_swamp_5",
    ],
]

const DrawerScene = {
    displayObject: DisplayObject(),
    posLoc: -1,
    texLoc: -1,
    samplerLocs: [-1, -1, -1, -1, -1, -1, -1, -1],
    pvmLoc: -1,
    dataLoc: -1,
    shader: null,
    clearBMP: Bitmap.createBitmap([0, 0, 0, 0], 1, 1),
    sceneToTexHandleOffset: {},
    texHandles: [0, 0, 0, 0, 0, 0, 0, 0],
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    prevT: 0,
    lastLoadedScene: null,
    activeTextureList: [
        gl.TEXTURE0,
        gl.TEXTURE1,
        gl.TEXTURE2,
        gl.TEXTURE3,
        gl.TEXTURE4,
        gl.TEXTURE5,
        gl.TEXTURE6,
        gl.TEXTURE7,
    ],
    setupShader() {
        this.shader = Shader(assets["shaders/scene.vert"], assets["shaders/scene.frag"])
        for (let i = 0; i < this.texHandles.length; i++) {
            this.texHandles[i] = gl.createTexture()
        }
        this.pvmLoc = gl.getUniformLocation(this.shader.full, "u_pvmMat")
        this.dataLoc = gl.getUniformLocation(this.shader.full, "u_data")
        this.posLoc = gl.getAttribLocation(this.shader.full, "a_pos")
        this.texLoc = gl.getAttribLocation(this.shader.full, "a_tex")
        for (let i = 0; i < 8; i++) {
            this.samplerLocs[i] = gl.getUniformLocation(this.shader.full, `u_sampler${i}`)
        }
    },
    setup() {
        this.lastLoadedScene = null
        this.setupShader()
    },
    bmpDrawableInts: [],
    bmp_w: 1,
    bmp_h: 1,
    loadScene(scene) {
        this.bmpDrawableInts=[]
        for (const d of sceneToDrawables[scene.i]) {
            if (drawableArrs[d + ".png"] == null) return 0
            this.bmpDrawableInts.push(0)
        }
        for (let i = 0; i < 8; i++) {
            const arr = sceneToDrawables[scene.i]
            const bmp = i < arr.length ? drawableArrs[arr[i] + ".png"] : this.clearBMP
            if (i == 0) {
                this.bmp_w = bmp.width
                this.bmp_h = bmp.height
            }
            gl.bindTexture(gl.TEXTURE_2D, this.texHandles[i])
            //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            //    new Uint8Array([0, 0, 255, 255]));
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bmp)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        }
        this.lastLoadedScene = scene
        return 1
    },
    scrollR: 0,
    xyz: [0, 0, 0],
    draw(_region, scroll, scene) {
        const region = Settings.showScene ? _region : World.regionFullSquare
        if (scene != this.lastLoadedScene) {
            if (this.loadScene(scene) == 0) return 0
        }
        const yDist = yDistFromZAndDeviceRegion(SCENE_0, region)
        const xDist = xDistFromZAndDeviceRegion(SCENE_0, region)
        setWorldXYZFromDeviceXY(this.xyz, region[0]+0.5*region[2], region[1]+0.5*region[3], SCENE_0)
        const texX_over_bmpWs = region[2] * this.bmp_h / (region[3] * this.bmp_w)
        this.displayObject.x = this.xyz[0]
        this.displayObject.y = this.xyz[1]
        this.displayObject.z = this.xyz[2]
        this.displayObject.sx = 0.5 * xDist
        this.displayObject.sy = 0.5 * yDist
        World.pvm.updateWithDisplayObject(this.displayObject)
        if (!Settings.showScene) {
            DrawerVanilla.draw(this.displayObject, "hand_bgr", PosNormIndTexs.square)
            return
        }
        
        gl.useProgram(this.shader.full)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, PosNormIndTexs.square.ind);
        
    
        gl.bindBuffer(gl.ARRAY_BUFFER, PosNormIndTexs.square.pos);
        gl.enableVertexAttribArray(this.posLoc)
        gl.vertexAttribPointer( this.posLoc, COORDS_PER_VERTEX, gl.FLOAT, 0, 0, 0)


        gl.bindBuffer(gl.ARRAY_BUFFER, PosNormIndTexs.square.tex);
        gl.enableVertexAttribArray(this.texLoc)
        gl.vertexAttribPointer(this.texLoc, COORDS_PER_VERTEX, gl.FLOAT, 0, 0, 0)

        gl.uniformMatrix4fv(this.pvmLoc, false, World.pvm.pvm)
        
        const rate0 = 0.003
        const dRate = 0.018
        const maxRate = World.viewWidth <= World.viewHeight ? 0.4 : 0.7
        this.data[0] = texX_over_bmpWs
        const dT = this.prevT == 0 ? 0 : World.t_s-this.prevT
        this.scrollR = scroll ? maxRate : Math.max(0, this.scrollR - 0.01)
        for (let i = 0; i < this.bmpDrawableInts.length; i++) {
            const r = i / this.bmpDrawableInts.length
            this.data[i + 4] = (this.data[i + 4] + this.scrollR*dT*(rate0 + 8*r*r*dRate)) % 1
        }
        gl.uniform4fv(this.dataLoc, this.data)

        const texHandleOffset = 8 * this.sceneToTexHandleOffset[scene.i]
        for (let i = 0; i < 8; i++) {
            gl.activeTexture(this.activeTextureList[i])
            gl.bindTexture(gl.TEXTURE_2D, this.texHandles[i])
            gl.uniform1i(this.samplerLocs[i], i)
        }
        gl.drawElements(gl.TRIANGLES, PosNormIndTexs.square.indArr.length, gl.UNSIGNED_SHORT,0);
        this.prevT  = World.t_s
        return 1
    },
}
