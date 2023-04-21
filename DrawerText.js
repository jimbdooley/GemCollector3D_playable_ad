
const DrawerText = {
    o: DisplayObject(),
    actualRegion: [0, 0, 0, 0],
    draw(tn, z, _region=null) {
        const button = "btn" in tn ? tn.btn : null
        const region = _region ? _region : (button == null ? textnameToRegion[tn.name] : button.textRegion)
        const w = TEXT_D_SCALES[2*tn.ordinal]
        const h = TEXT_D_SCALES[2*tn.ordinal+1]
        this.actualRegion[0] = Math.floor(region[0] + 0.5 * region[2] - 0.5 * w)
        this.actualRegion[1] = Math.floor(region[1] + 0.5 * region[3] - 0.5 * h)
        this.actualRegion[2] = w
        this.actualRegion[3] = h
        if ("btn" in tn) {
            for (let i =0; i < 4; i++) tn.btn.actualTextRegion[i] = this.actualRegion[i]
        }
        setXYZSXSYFromRegionAndZ(this.o, this.actualRegion, z)
        this.o.z -= button != null ? button.pressed : 0

        let light = DrawerVanilla.DIRECT_LIGHT
        if (button != null && button.pressed == 0) {
            light = DrawerVanilla.BTN_NOT_PRESSED
        } else if (button != null) {
            light = DrawerVanilla.BTN_PRESSED
        } else {
            light = DrawerVanilla.DIRECT_LIGHT
        }
        
        DrawerVanilla.draw(this.o, tn.name, PosNormIndTexs.square, false, light)
        
    },
}