
const DrawerIndicator = {
    posLoc: -1,
    texLoc: -1,
    dataLoc: -1,
    pvmLoc: -1,
    mLoc: -1,
    u_data: [0, 0, 0, 0, 0, 0, 0, 0],
    shader: null,
    setup(context) {
        this.shader = Shader(getTextFileString(context, "shaders/indicator.vert"),
            getTextFileString(context, "shaders/indicator.frag"))
        this.pvmLoc = gl.getUniformLocation(this.shader.full, "u_pvmMat")
        this.mLoc = gl.getUniformLocation(this.shader.full, "u_mMat")
        this.posLoc = gl.getAttribLocation(this.shader.full, "a_pos")
        this.texLoc = gl.getAttribLocation(this.shader.full, "a_tex")
        this.dataLoc = gl.getUniformLocation(this.shader.full, "u_data")
    },
    draw(o, bufs, r, g, b) {
        const maxT_s = World.t_s * 0.8
        this.u_data[0] = maxT_s % 1
        this.u_data[1] = (0.5 + maxT_s) % 1
        this.u_data[2] = maxT_s % 1
        this.u_data[3] = (0.5 + maxT_s) % 1
        this.u_data[4] = r
        this.u_data[5] = g
        this.u_data[6] = b

        World.pvm.updateWithDisplayObject(o)

        gl.useProgram(this.shader.full)

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufs.ind);

        gl.bindBuffer(gl.ARRAY_BUFFER, bufs.pos);
        gl.enableVertexAttribArray(this.posLoc)
        gl.vertexAttribPointer(this.posLoc, COORDS_PER_VERTEX, gl.FLOAT, 0, 0, 0)


        gl.bindBuffer(gl.ARRAY_BUFFER, bufs.tex);
        gl.enableVertexAttribArray(this.texLoc)
        gl.vertexAttribPointer(this.texLoc, COORDS_PER_VERTEX, gl.FLOAT, 0, 0, 0)

        gl.uniformMatrix4fv(this.pvmLoc, false, World.pvm.pvm)
        gl.uniformMatrix4fv(this.mLoc, false, World.pvm.m)

        gl.uniform4fv(this.dataLoc, this.u_data)

        gl.drawElements(gl.TRIANGLES, bufs.indArr.length, gl.UNSIGNED_SHORT, 0)

        gl.disableVertexAttribArray(this.posLoc)
        gl.disableVertexAttribArray(this.texLoc)
    }
}