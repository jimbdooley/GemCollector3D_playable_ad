
const DrawerRowCheck = {
    posLoc: -1,
    texLoc: -1,
    samplerLoc: -1,
    dataLoc: -1,
    pvmLoc: -1,
    dob: DisplayObject(),
    bmp: null,
    texHandles: [-1],
    shader: null,
    setupBmp(bmp, handle) {
        gl.bindTexture(gl.TEXTURE_2D, handle)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bmp)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    },
    thZFromStartStop(startStop) {
        if (Math.abs() < 0.01) {
            return 0.5 * Math.PI
        } else if (startStop[0] > startStop[2]) {
            return Math.atan((startStop[3] - startStop[1]) / (startStop[2] - startStop[0]))
        } else {
            return Math.atan((startStop[3] - startStop[1]) / (startStop[2] - startStop[0]))
        }
    },
    u_data: [0, 0, 0, 0],
    setup(context) {
        this.texHandles[0] = gl.createTexture()
        this.setupBmp(drawable["flame.png"], this.texHandles[0])
        this.shader = Shader(getTextFileString(context, "shaders/row_check.vert"),
            getTextFileString(context, "shaders/row_check.frag"))
        this.pvmLoc = gl.getUniformLocation(this.shader.full, "u_pvmMat")
        this.posLoc = gl.getAttribLocation(this.shader.full, "a_pos")
        this.texLoc = gl.getAttribLocation(this.shader.full, "a_tex")
        this.samplerLoc = gl.getUniformLocation(this.shader.full, "u_sampler")
        this.dataLoc = gl.getUniformLocation(this.shader.full, "u_data")
    },
    dScale: 1.3,
    animT: 30,
    colors: [[1, 0, 0], [0, 1, 0], [1, 0.9, 0]],
    draw(startStop, mapScale, bufs, colorI) {
        const t = World.t_s % this.animT
        for (let i = 0; i < 3; i++) {
            this.u_data[i] = this.colors[colorI][i]
        }
        this.u_data[3] = t - 0.5 * this.animT

        
        this.dob.x = 0.5 * (startStop[0] + startStop[2])
        this.dob.y = 0.5 * (startStop[1] + startStop[3])
        this.dob.z = BOARD_Z + 0.15
        const dx = startStop[0] - startStop[2]
        const dy = startStop[1] - startStop[3]
        this.dob.sx = 0.5*(2*this.dScale*mapScale + Math.sqrt(dx*dx + dy*dy))
        this.dob.sy = this.dScale*mapScale
        this.dob.thZ = this.thZFromStartStop(startStop)

        World.pvm.updateWithDisplayObject(this.dob)

        gl.useProgram(this.shader.full)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufs.ind);

        gl.bindBuffer(gl.ARRAY_BUFFER, bufs.pos);
        gl.enableVertexAttribArray(this.posLoc)
        gl.vertexAttribPointer(this.posLoc, COORDS_PER_VERTEX, gl.FLOAT, 0, 0, 0)


        gl.bindBuffer(gl.ARRAY_BUFFER, bufs.tex);
        gl.enableVertexAttribArray(this.texLoc)
        gl.vertexAttribPointer(this.texLoc, COORDS_PER_VERTEX, gl.FLOAT, 0, 0, 0)


        gl.uniformMatrix4fv(this.pvmLoc, false, World.pvm.pvm)

        gl.activeTexture(gl.TEXTURE0)
        //console.log(`${bmpName} using texhandleI; ${this.strToTexHandleI[bmpName]}`)
        gl.bindTexture(gl.TEXTURE_2D, this.texHandles[0])
        gl.uniform1i(this.samplerLoc, 0)

        gl.uniform4fv(this.dataLoc, this.u_data)

        gl.drawElements(gl.TRIANGLES, bufs.indArr.length, gl.UNSIGNED_SHORT, 0)

        gl.disableVertexAttribArray(this.posLoc)
        gl.disableVertexAttribArray(this.texLoc)
    },
}