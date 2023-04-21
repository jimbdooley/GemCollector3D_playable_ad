
const DrawerVanilla = {
    posLoc: -1,
    normLoc: -1,
    texLoc: -1,
    samplerLoc: -1,
    lightDirLoc: -1,
    pvmLoc: -1,
    mLoc: -1,
    bmpInPlace: {
        //"hand_bgr": Bitmap.createBitmap([Color.argb(255, 238, 118, 0)], 1, 1, Bitmap.Config.ARGB_8888),
        "gearMetal": Bitmap.createBitmap([Color.argb(255, 100, 100, 112)], 1, 1, Bitmap.Config.ARGB_8888),
        "btnColor": Bitmap.createBitmap([Color.argb(255, BUTTON_COLOR[0], BUTTON_COLOR[1], BUTTON_COLOR[2])], 1, 1, Bitmap.Config.ARGB_8888),
        "btnCloseColor": Bitmap.createBitmap([Color.argb(255, BUTTON_CLOSE_COLOR[0], BUTTON_CLOSE_COLOR[1], BUTTON_CLOSE_COLOR[2])], 1, 1, Bitmap.Config.ARGB_8888),
        "letter": Bitmap.createBitmap([
            Color.argb(255, 55, 55, 55),
            Color.argb(255, 255, 255, 0),
            Color.argb(255, 0, 0, 0),
            Color.argb(255, 255, 255, 0),
        ], 2, 2, Bitmap.Config.ARGB_8888),
        "red": Bitmap.createBitmap([Color.argb(255, 255, 0, 0)], 1, 1, Bitmap.Config.ARGB_8888),
        "green": Bitmap.createBitmap([Color.argb(255, 0, 255, 0)], 1, 1, Bitmap.Config.ARGB_8888),
        "blue": Bitmap.createBitmap([Color.argb(255, 0, 0, 255)], 1, 1, Bitmap.Config.ARGB_8888),
        "yellow": Bitmap.createBitmap([Color.argb(255, 255, 255, 0)], 1, 1, Bitmap.Config.ARGB_8888),
        "thanksBGR": Bitmap.createBitmap([Color.argb(255, 255, 230, 0)], 1, 1, Bitmap.Config.ARGB_8888),
        "counterfeit": Bitmap.createBitmap([Color.argb(255, 194, 178, 128)], 1, 1, Bitmap.Config.ARGB_8888),
        "shade": Bitmap.createBitmap([Color.argb(220, 0, 0, 0)], 1, 1, Bitmap.Config.ARGB_8888),
    },
    bmpDrawables: {
        "finger": "finger.png",
        "desert_plateus_1": "desert_plateus_1.png",
        "icon": "icon600_trans.png",
        "crate_hand": "crate_hand.png",
        "tmap": "tmap.png",
        "hand_bgr": "hand_bgr.png",
        "map_square": "map_square.png",
        "map_hexagon": "map_hexagon.png",
        "map_octagon": "map_octagon.png",
        "wood": "wood.png",
        "rust": "rust.png",
        "minus": "minus.png",
        "plus": "plus.png",
        "0": "n0.png",
        "1": "n1.png",
        "2": "n2.png",
        "3": "n3.png",
        "4": "n4.png",
        "5": "n5.png",
        "6": "n6.png",
        "7": "n7.png",
        "8": "n8.png",
        "9": "n9.png",
    },
    strToTexHandleI: {},
    strToLastLang: {},
    drawableStrToLoaded: {},
    texHandles: [],
    shader: null,
    setupBmp: function (bmp, handle) {
        gl.bindTexture(gl.TEXTURE_2D, handle)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bmp)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    },
    langToScoreSize: {},
    langToLevelSize: {},


    textnameSetup() {
        for (const key in Textname) {
            if (!("bmp" in Textname[key])) continue
            this.setupBmp(Textname[key].bmp, this.texHandles[this.strToTexHandleI[key]])
        }
    },

    setup: function (context) {
        while (this.drawableStrToLoaded.length > 0) this.drawableStrToLoaded.pop()
        for (key in this.bmpDrawables) {
            this.strToTexHandleI[key] = this.texHandles.length
            this.texHandles.push(-1)
        }
        for (key in this.bmpInPlace) {
            this.strToTexHandleI[key] = this.texHandles.length
            this.texHandles.push(-1)
        }
        for (const key in Textname) {
            if (!("bmp" in Textname[key])) continue
            this.strToTexHandleI[key] = this.texHandles.length
            this.texHandles.push(-1)
        }
        for (let i = 0; i < this.texHandles.length; i++) {
            this.texHandles[i] = gl.createTexture()
        }
        this.textnameSetup()
        for (key in this.bmpInPlace) {
            this.setupBmp(this.bmpInPlace[key], this.texHandles[this.strToTexHandleI[key]])
        }
        this.shader = Shader(getTextFileString(context, "shaders/pos_norm_ind_tex.vert"),
            getTextFileString(context, "shaders/pos_norm_ind_tex.frag"))
        this.pvmLoc = gl.getUniformLocation(this.shader.full, "u_pvmMat")
        this.mLoc = gl.getUniformLocation(this.shader.full, "u_mMat")
        this.posLoc = gl.getAttribLocation(this.shader.full, "a_pos")
        this.normLoc = gl.getAttribLocation(this.shader.full, "a_norm")
        this.texLoc = gl.getAttribLocation(this.shader.full, "a_tex")
        this.samplerLoc = gl.getUniformLocation(this.shader.full, "u_sampler")
        this.lightDirLoc = gl.getUniformLocation(this.shader.full, "u_light_dir")
        //console.log("vanilla frag", this.shader.fragCompileLog)
        //console.log("vanilla vert", this.shader.vertCompileLog)
        //console.log("Drawer Created", "Vanilla Drawer")
    },

    DIRECT_LIGHT: [0, 0, 1],
    LIGHT_30_85: [
        0.3,
        0.85 * Math.sqrt(1 - 0.3 * 0.3),
        Math.sqrt(1 - 0.85 * 0.85) * Math.sqrt(1 - 0.3 * 0.3)
    ],
    LIGHT_RIGHT: [Math.sqrt(2) / 2, 0, Math.sqrt(2) / 2],
    BTN_NOT_PRESSED: [0.1, 0.3, Math.sqrt(0.9)],
    BTN_PRESSED: [0.65 * 0.1, 0.65 * 0.3, 0.65 * Math.sqrt(0.9),],
    draw: function (o, bmpName, bufs, preUpdated = false, lightArray = this.DIRECT_LIGHT) {
        if (bmpName in this.bmpDrawables && drawableArrs[this.bmpDrawables[bmpName]] == null) return

        if (bmpName in this.bmpDrawables) {
            if (!(bmpName in this.drawableStrToLoaded) || !this.drawableStrToLoaded[bmpName]) {
                const bmp = drawableArrs[this.bmpDrawables[bmpName]]
                this.setupBmp(bmp, this.texHandles[this.strToTexHandleI[bmpName]])
                this.drawableStrToLoaded[bmpName] = true
            }
        }

        if (!preUpdated) World.pvm.updateWithDisplayObject(o)

        gl.useProgram(this.shader.full)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufs.ind);

        gl.bindBuffer(gl.ARRAY_BUFFER, bufs.pos);
        gl.enableVertexAttribArray(this.posLoc)
        gl.vertexAttribPointer(this.posLoc, COORDS_PER_VERTEX, gl.FLOAT, 0, 0, 0)

        gl.bindBuffer(gl.ARRAY_BUFFER, bufs.norm);
        gl.enableVertexAttribArray(this.normLoc)
        gl.vertexAttribPointer(this.normLoc, COORDS_PER_VERTEX, gl.FLOAT, 0, 0, 0)

        gl.bindBuffer(gl.ARRAY_BUFFER, bufs.tex);
        gl.enableVertexAttribArray(this.texLoc)
        gl.vertexAttribPointer(this.texLoc, COORDS_PER_VERTEX, gl.FLOAT, 0, 0, 0)


        gl.uniformMatrix4fv(this.pvmLoc, false, World.pvm.pvm)
        gl.uniformMatrix4fv(this.mLoc, false, World.pvm.m)

        gl.activeTexture(gl.TEXTURE0)
        //console.log(`${bmpName} using texhandleI; ${this.strToTexHandleI[bmpName]}`)
        gl.bindTexture(gl.TEXTURE_2D, this.texHandles[this.strToTexHandleI[bmpName]])
        gl.uniform1i(this.samplerLoc, 0)

        gl.uniform3fv(this.lightDirLoc, lightArray)

        gl.drawElements(gl.TRIANGLES, bufs.indArr.length, gl.UNSIGNED_SHORT, 0)

        gl.disableVertexAttribArray(this.posLoc)
        gl.disableVertexAttribArray(this.normLoc)
        gl.disableVertexAttribArray(this.texLoc)

    },


}