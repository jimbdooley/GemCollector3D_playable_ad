const DrawerGem = {
    posLocs : [],
    normLocs : [],
    pvmLocs : [],
    mInvLocs : [],
    mCenLocs : [],
    samplerLocs : [],
    lightsLocs : [],
    colorLocs : [],
    envDLocs: [],
    envDArr: [0, 0, 0, 0],
    shaders : [],
    texHandle : [-1],
    shaderverts : [], // TODO: Delete
    shaderfrags : [], // TODO: Delete

    setup : function() {
        const consts_regular = getTextFileString(null, "gem_shaders/consts_regular.glsl")
        const other_funcs = getTextFileString(null, "gem_shaders/other_funcs.glsl")
        const set_color_regular = getTextFileString(null, "gem_shaders/set_color_regular.glsl")
        const main_func = getTextFileString(null, "gem_shaders/main_func.glsl")

        this.texHandle[0] = gl.createTexture()
        initCubeTexture(this.texHandle[0], BLOCKY_BITMAP)
        for (gemShape of GemShape.values()) {
            this.shaderverts.push(getTextFileString(null, "gem_shaders/gem.vert"))
            if (gemShape.shaderI < 0) continue
            const get_normal = getTextFileString(null, `gem_shaders/get_normal_${gemShape.name}.glsl`)
            //this.shaderfrags.push(consts_regular + get_normal + other_funcs + set_color_regular + main_func)
            this.shaders.push(Shader(getTextFileString(null, "gem_shaders/gem.vert"),
                 consts_regular + get_normal + other_funcs + set_color_regular + main_func,
                 gemShape.name))
            //this.shaders.push(Shader(vcode, fcode, "drawergemtest"))
            this.posLocs.push(gl.getAttribLocation(this.shaders[gemShape.shaderI].full, "a_pos"))
            this.normLocs.push(gl.getAttribLocation(this.shaders[gemShape.shaderI].full, "a_norm"))
            this.pvmLocs.push(gl.getUniformLocation(this.shaders[gemShape.shaderI].full, "u_pvmMat"))
            this.mInvLocs.push(gl.getUniformLocation(this.shaders[gemShape.shaderI].full, "u_mMat_inv"))
            this.mCenLocs.push(gl.getUniformLocation(this.shaders[gemShape.shaderI].full, "u_mMat_cen"))
            this.samplerLocs.push(gl.getUniformLocation(this.shaders[gemShape.shaderI].full, "u_sampler"))
            this.lightsLocs.push(gl.getUniformLocation(this.shaders[gemShape.shaderI].full, "u_lights"))
            this.colorLocs.push(gl.getUniformLocation(this.shaders[gemShape.shaderI].full, "u_color"))
            this.envDLocs.push(gl.getUniformLocation(this.shaders[gemShape.shaderI].full, "u_env_d_mx"))
        }
    },
    draw : function(o, gemShape, gemColor, lights) {

        const bufs = GEM_PNIs[gemShape.i]

        World.pvm.updateWithDisplayObject(o)

        World.pvm.updateCenters()
        const shaderShape = shaderShapeFromGemShape(gemShape)
        gl.useProgram(this.shaders[shaderShape.shaderI].full);
        /*

uniform samplerCube u_sampler;
attribute vec4 a_pos;
attribute vec4 a_norm;
uniform mat4 u_pvmMat;
uniform mat4 u_mMat_inv;
uniform mat4 u_mMat_cen;

uniform vec4 u_color[1];
uniform vec3 u_lights[3];
        */
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufs.ind);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, bufs.pos);
        gl.enableVertexAttribArray(this.posLocs[shaderShape.shaderI]);
        gl.vertexAttribPointer(this.posLocs[shaderShape.shaderI], 4, gl.FLOAT, 0, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, bufs.norm);
        gl.enableVertexAttribArray(this.normLocs[shaderShape.shaderI]);
        gl.vertexAttribPointer(this.normLocs[shaderShape.shaderI], 4, gl.FLOAT, 0, 0, 0);
        
        //gl.bindBuffer(gl.ARRAY_BUFFER, bufs.tex);
        //gl.enableVertexAttribArray(this.test_shader_locs.a_uv);
        //gl.vertexAttribPointer(this.test_shader_locs.a_uv, 4, gl.FLOAT, 0, 0, 0);
        
        gl.uniformMatrix4fv(this.pvmLocs[shaderShape.shaderI], false, World.pvm.pvm);
        gl.uniformMatrix4fv(this.mInvLocs[shaderShape.shaderI], false, World.pvm.mCenInv);
        gl.uniformMatrix4fv(this.mCenLocs[shaderShape.shaderI], false, World.pvm.mCen);

        gl.uniform4fv(this.colorLocs[shaderShape.shaderI], colorArrFromGemColor[gemColor.i])
        this.envDArr[0] = envDMxFromScale(o.scale)
        gl.uniform4fv(this.envDLocs[shaderShape.shaderI], this.envDArr)
        gl.uniform3fv(this.lightsLocs[shaderShape.shaderI], lights)

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texHandle[0]);
        gl.uniform1i(this.samplerLocs[shaderShape.shaderI], 0);

        gl.drawElements(gl.TRIANGLES, bufs.indArr.length, gl.UNSIGNED_SHORT,0);
    },

}