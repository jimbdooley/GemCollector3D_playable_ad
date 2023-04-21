
const DrawerScore = {
    TEXT_H_R: 0.95,
    TEXT_NUM_SPACE_R: 0.2,
    reg: [0, 0, 0, 0],
    dob: DisplayObject(),
    drawn: false,
    draw(z, n, _i, _score) {
        if (!this.drawn) {
            
            this.drawn = true
            return
        }
        const mapI = _i + ""
        const score = _score + ""
        const numsWH = (Math.max(2, mapI.length) + n.length + Math.max(3, score.length) + 0.6) * 95 / 125
        const scoreW = TEXT_D_SCALES[2*Textname.goldScore.ordinal]
        const scoreH = TEXT_D_SCALES[2*Textname.goldScore.ordinal + 1]
        const levelW = TEXT_D_SCALES[2*Textname.goldLevel.ordinal]
        const levelH = TEXT_D_SCALES[2*Textname.goldLevel.ordinal + 1]
        const textWH = (levelW / levelH + scoreW / scoreH) * this.TEXT_H_R
        const allWH = numsWH + textWH + 0.5 + 2 * this.TEXT_NUM_SPACE_R
        const regWH = World.regionScore[2] / World.regionScore[3]
        const dH = allWH <= regWH ? 1 : regWH / allWH
        World.regionScore[1] += World.regionScore[3] * (1 - dH) * 0.5
        World.regionScore[3] *= dH

        this.reg[1] = World.regionScore[1] + 0.5 * (1 - this.TEXT_H_R) * World.regionScore[3]
        this.reg[3] = World.regionScore[3] * this.TEXT_H_R

        this.reg[0] = World.regionScore[0] + World.regionScore[2]
        this.reg[0] -= World.regionScore[3] * this.TEXT_H_R * levelW / levelH
        this.reg[0] -= World.regionScore[3] * 95 * (2 + n.length + 0.6) / 125
        this.reg[2] = this.reg[3] * (levelW / levelH + this.TEXT_NUM_SPACE_R)

        DrawerText.draw(Textname.goldLevel, z, this.reg)

        this.reg[0] = World.regionScore[0]
        this.reg[2] = this.reg[3] * scoreW / scoreH
        
        DrawerText.draw(Textname.goldScore, z,this.reg)

        this.reg[1] = World.regionScore[1]
        this.reg[3] = World.regionScore[3]
        this.reg[0] += this.reg[2] + this.TEXT_NUM_SPACE_R * this.reg[3] + 0.5 * this.reg[3] * 95 / 125
        this.reg[2] = this.reg[3] * 95 / 125
        setXYZSXSYFromRegionAndZ(this.dob, this.reg, z)
        DrawerVanilla.draw(this.dob, score.substring(0, 1), PosNormIndTexs.square)
        for (let i = 1; i < score.length; i++) {
            this.reg[0] += this.reg[3] * 95 / 125
            setXYZSXSYFromRegionAndZ(this.dob, this.reg, z)
            DrawerVanilla.draw(this.dob, score.substring(i, i+1), PosNormIndTexs.square)
        }

        this.reg[0] = World.regionScore[0] + World.regionScore[2]
        this.reg[0] -= 2.6*this.reg[3] * 95 / 125
        this.reg[0] -= this.reg[3] * (1 + n.length) * 95 / 125
        this.reg[0] += 2 * this.reg[3] * this.TEXT_NUM_SPACE_R
        for (let i = 0; i < n.length; i++) {
            this.reg[0] += this.reg[3] * 95 / 125
            setXYZSXSYFromRegionAndZ(this.dob, this.reg, z)
            DrawerVanilla.draw(this.dob, n.substring(i, i+1), PosNormIndTexs.square)
        }
        this.reg[0] += 0.8 * this.reg[3] * 95 / 125
        setXYZSXSYFromRegionAndZ(this.dob, this.reg, z-0.5)
        DrawerVanilla.draw(this.dob, "minus", PosNormIndTexs.square)
        for (let i = 0; i < mapI.length; i++) {
            this.reg[0] += (i == 0 ? 0.8 : 1) * this.reg[3] * 95 / 125
            setXYZSXSYFromRegionAndZ(this.dob, this.reg, z)
            DrawerVanilla.draw(this.dob, mapI.substring(i, i+1), PosNormIndTexs.square)
        }
    },
}